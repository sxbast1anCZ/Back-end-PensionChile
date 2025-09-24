import { Injectable, NestMiddleware, BadRequestException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SecurityConfig, isSuspiciousInput, sanitizeString } from './security.config';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SecurityMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // 1. Validar y sanitizar parámetros de entrada
    this.validateAndSanitizeInput(req);
    
    // 2. Detectar patrones sospechosos
    this.detectSuspiciousActivity(req);
    
    // 3. Agregar headers de seguridad
    this.addSecurityHeaders(res);
    
    // 4. Logging de seguridad
    this.logSecurityEvent(req);
    
    next();
  }

  private validateAndSanitizeInput(req: Request) {
    // Validar body si existe
    if (req.body && typeof req.body === 'object') {
      this.sanitizeObject(req.body);
    }

    // Validar query parameters
    if (req.query && typeof req.query === 'object') {
      this.sanitizeObject(req.query);
    }

    // Validar route parameters
    if (req.params && typeof req.params === 'object') {
      this.sanitizeObject(req.params);
    }
  }

  private sanitizeObject(obj: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        
        if (typeof value === 'string') {
          // Detectar entrada sospechosa ANTES de sanitizar
          if (isSuspiciousInput(value)) {
            this.logger.warn(`Entrada sospechosa detectada en campo ${key}: ${value.substring(0, 100)}...`);
            throw new BadRequestException(`Entrada inválida detectada en campo: ${key}`);
          }
          
          // Sanitizar el valor
          obj[key] = sanitizeString(value);
          
          // Validar longitud después de sanitización
          if (obj[key].length > SecurityConfig.validation.maxStringLength) {
            throw new BadRequestException(`Campo ${key} excede la longitud máxima permitida`);
          }
        } else if (typeof value === 'object' && value !== null) {
          // Recursivamente sanitizar objetos anidados
          this.sanitizeObject(value);
        }
      }
    }
  }

  private detectSuspiciousActivity(req: Request) {
    const userAgent = req.get('User-Agent') || '';
    const ip = req.ip || req.connection.remoteAddress;
    
    // Detectar User-Agents sospechosos
    const suspiciousUserAgents = [
      'sqlmap',
      'nikto',
      'nmap',
      'burp',
      'owasp',
      'zap',
      'scanner',
    ];
    
    const isSuspiciousUA = suspiciousUserAgents.some(ua => 
      userAgent.toLowerCase().includes(ua)
    );
    
    if (isSuspiciousUA) {
      this.logger.warn(`User-Agent sospechoso detectado desde IP ${ip}: ${userAgent}`);
      throw new BadRequestException('Actividad sospechosa detectada');
    }

    // Detectar múltiples parámetros SQL típicos de inyección
    const fullUrl = req.originalUrl || '';
    const sqlKeywords = ['union', 'select', 'insert', 'delete', 'drop', 'exec', 'script'];
    const sqlKeywordCount = sqlKeywords.filter(keyword => 
      fullUrl.toLowerCase().includes(keyword)
    ).length;
    
    if (sqlKeywordCount >= 2) {
      this.logger.warn(`Posible intento de SQL injection desde IP ${ip}: ${fullUrl}`);
      throw new BadRequestException('Solicitud inválida');
    }
  }

  private addSecurityHeaders(res: Response) {
    const { headers } = SecurityConfig;
    
    res.setHeader('X-Frame-Options', headers.xFrameOptions);
    res.setHeader('X-Content-Type-Options', headers.xContentTypeOptions);
    res.setHeader('X-XSS-Protection', headers.xXssProtection);
    res.setHeader('Referrer-Policy', headers.referrerPolicy);
    res.setHeader('X-Powered-By', 'PensionChile'); // Ocultar tecnología real
  }

  private logSecurityEvent(req: Request) {
    // Solo loggear eventos relevantes para seguridad
    const sensitiveRoutes = ['/auth', '/pagos', '/admin'];
    const isSensitiveRoute = sensitiveRoutes.some(route => 
      req.path.startsWith(route)
    );
    
    if (isSensitiveRoute) {
      const logData = {
        ip: req.ip || req.connection.remoteAddress,
        method: req.method,
        path: req.path,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
        // NO incluir datos sensibles como body completo
      };
      
      this.logger.log(`Acceso a ruta sensible: ${JSON.stringify(logData)}`);
    }
  }
}

/**
 * Decorator para validar roles con logging de seguridad
 */
export function SecureRoles(...roles: string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
      const req = args.find(arg => arg && arg.user);
      
      if (req && req.user) {
        const logger = new Logger('SecureRoles');
        logger.log(`Usuario ${req.user.idUsuario} accediendo a ${target.constructor.name}.${propertyKey}`);
        
        // Validar que el usuario tenga uno de los roles requeridos
        const userRole = req.user.tipoUsuario;
        if (!roles.includes(userRole)) {
          logger.warn(`Acceso denegado: Usuario ${req.user.idUsuario} intentó acceder sin permisos suficientes`);
          throw new BadRequestException('No tienes permisos para esta acción');
        }
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}