import { Injectable, NestMiddleware, Logger } from '@nestjs/common';import { Injectable, NestMiddleware, BadRequestException, Logger } from '@nestjs/common';import { Injectable, NestMiddleware, BadRequestException, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

import { Request, Response, NextFunction } from 'express';import { Request, Response, NextFunction } from 'express';

@Injectable()

export class SecurityMiddleware implements NestMiddleware {import { SecurityConfig, isSuspiciousInput, sanitizeString } from './security.config';import { SecurityConfig, isSuspiciousInput, sanitizeString } from './security.config';

  private readonly logger = new Logger(SecurityMiddleware.name);



  use(req: Request, res: Response, next: NextFunction) {

    // Temporalmente simplificado para evitar errores@Injectable()@Injectable()

    this.addSecurityHeaders(res);

    next();export class SecurityMiddleware implements NestMiddleware {export class SecurityMiddleware implements NestMiddleware {

  }

  private readonly logger = new Logger(SecurityMiddleware.name);  private readonly logger = new Logger(SecurityMiddleware.name);

  private addSecurityHeaders(res: Response) {

    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    res.setHeader('X-Content-Type-Options', 'nosniff');

    res.setHeader('X-XSS-Protection', '0');  use(req: Request, res: Response, next: NextFunction) {  use(req: Request, res: Response, next: NextFunction) {

    res.setHeader('Referrer-Policy', 'no-referrer');

    res.setHeader('X-Powered-By', 'PensionChile');    // 1. Validar y sanitizar parámetros de entrada    // 1. Validar y sanitizar parámetros de entrada

  }

}    this.validateAndSanitizeInput(req);    this.validateAndSanitizeInput(req);

        

    // 2. Detectar patrones sospechosos    // 2. Detectar patrones sospechosos

    this.detectSuspiciousActivity(req);    this.detectSuspiciousActivity(req);

        

    // 3. Agregar headers de seguridad    // 3. Agregar headers de seguridad

    this.addSecurityHeaders(res);    this.addSecurityHeaders(res);

        

    // 4. Logging de seguridad    // 4. Logging de seguridad

    this.logSecurityEvent(req);    this.logSecurityEvent(req);

        

    next();    next();

  }  }



  private validateAndSanitizeInput(req: Request) {  private validateAndSanitizeInput(req: Request) {

    // Validar body si existe    // Validar body si existe

    if (req.body && typeof req.body === 'object') {    if (req.body && typeof req.body === 'object') {

      this.sanitizeObject(req.body);      this.sanitizeObject(req.body);

    }    }



    // Validar query parameters    // Validar query parameters

    if (req.query && typeof req.query === 'object') {    if (req.query && typeof req.query === 'object') {

      this.sanitizeObject(req.query);      this.sanitizeObject(req.query);

    }    }



    // Validar route parameters    // Validar route parameters

    if (req.params && typeof req.params === 'object') {    if (req.params && typeof req.params === 'object') {

      this.sanitizeObject(req.params);      this.sanitizeObject(req.params);

    }    }

  }  }



  private sanitizeObject(obj: any) {  private sanitizeObject(obj: any) {

    for (const key in obj) {    for (const key in obj) {

      if (Object.prototype.hasOwnProperty.call(obj, key)) {      if (Object.prototype.hasOwnProperty.call(obj, key)) {

        const value = obj[key];        const value = obj[key];

                

        if (typeof value === 'string') {        if (typeof value === 'string') {

          // Detectar entrada sospechosa ANTES de sanitizar          // Detectar entrada sospechosa ANTES de sanitizar

          if (isSuspiciousInput(value)) {          if (isSuspiciousInput(value)) {

            this.logger.warn(`Entrada sospechosa detectada en campo ${key}: ${value.substring(0, 100)}...`);            this.logger.warn(`Entrada sospechosa detectada en campo ${key}: ${value.substring(0, 100)}...`);

            throw new BadRequestException(`Entrada inválida detectada en campo: ${key}`);            throw new BadRequestException(`Entrada inválida detectada en campo: ${key}`);

          }          }

                    

          // Sanitizar el valor          // Sanitizar el valor

          obj[key] = sanitizeString(value);          obj[key] = sanitizeString(value);

                    

          // Validar longitud después de sanitización          // Validar longitud después de sanitización

          if (obj[key].length > SecurityConfig.validation.maxStringLength) {          if (obj[key].length > SecurityConfig.validation.maxStringLength) {

            throw new BadRequestException(`Campo ${key} excede la longitud máxima permitida`);            throw new BadRequestException(`Campo ${key} excede la longitud máxima permitida`);

          }          }

        } else if (typeof value === 'object' && value !== null) {        } else if (typeof value === 'object' && value !== null) {

          // Recursivamente sanitizar objetos anidados          // Recursivamente sanitizar objetos anidados

          this.sanitizeObject(value);          this.sanitizeObject(value);

        }        }

      }      }

    }    }

  }  }



  private detectSuspiciousActivity(req: Request) {  private detectSuspiciousActivity(req: Request) {

    const userAgent = req.get('User-Agent') || '';    const userAgent = req.get('User-Agent') || '';

    const ip = req.ip || req.connection.remoteAddress;    const ip = req.ip || req.connection.remoteAddress;

        

    // Detectar User-Agents sospechosos    // Detectar User-Agents sospechosos

    const suspiciousUserAgents = [    const suspiciousUserAgents = [

      'sqlmap',      'sqlmap',

      'nikto',      'nikto',

      'nmap',      'nmap',

      'burp',      'burp',

      'owasp',      'owasp',

      'zap',      'zap',

      'scanner',      'scanner',

    ];    ];

        

    const isSuspiciousUA = suspiciousUserAgents.some(ua =>     const isSuspiciousUA = suspiciousUserAgents.some(ua => 

      userAgent.toLowerCase().includes(ua)      userAgent.toLowerCase().includes(ua)

    );    );

        

    if (isSuspiciousUA) {    if (isSuspiciousUA) {

      this.logger.warn(`User-Agent sospechoso detectado desde IP ${ip}: ${userAgent}`);      this.logger.warn(`User-Agent sospechoso detectado desde IP ${ip}: ${userAgent}`);

      throw new BadRequestException('Actividad sospechosa detectada');      throw new BadRequestException('Actividad sospechosa detectada');

    }    }



    // Detectar múltiples parámetros SQL típicos de inyección    // Detectar múltiples parámetros SQL típicos de inyección

    const fullUrl = req.originalUrl || '';    const fullUrl = req.originalUrl || '';

    const sqlKeywords = ['union', 'select', 'insert', 'delete', 'drop', 'exec', 'script'];    const sqlKeywords = ['union', 'select', 'insert', 'delete', 'drop', 'exec', 'script'];

    const sqlKeywordCount = sqlKeywords.filter(keyword =>     const sqlKeywordCount = sqlKeywords.filter(keyword => 

      fullUrl.toLowerCase().includes(keyword)      fullUrl.toLowerCase().includes(keyword)

    ).length;    ).length;

        

    if (sqlKeywordCount >= 2) {    if (sqlKeywordCount >= 2) {

      this.logger.warn(`Posible intento de SQL injection desde IP ${ip}: ${fullUrl}`);      this.logger.warn(`Posible intento de SQL injection desde IP ${ip}: ${fullUrl}`);

      throw new BadRequestException('Solicitud inválida');      throw new BadRequestException('Solicitud inválida');

    }    }

  }  }



  private addSecurityHeaders(res: Response) {  private addSecurityHeaders(res: Response) {

    const { headers } = SecurityConfig;    const { headers } = SecurityConfig;

        

    res.setHeader('X-Frame-Options', headers.xFrameOptions);    res.setHeader('X-Frame-Options', headers.xFrameOptions);

    res.setHeader('X-Content-Type-Options', headers.xContentTypeOptions);    res.setHeader('X-Content-Type-Options', headers.xContentTypeOptions);

    res.setHeader('X-XSS-Protection', headers.xXssProtection);    res.setHeader('X-XSS-Protection', headers.xXssProtection);

    res.setHeader('Referrer-Policy', headers.referrerPolicy);    res.setHeader('Referrer-Policy', headers.referrerPolicy);

    res.setHeader('X-Powered-By', 'PensionChile'); // Ocultar tecnología real    res.setHeader('X-Powered-By', 'PensionChile'); // Ocultar tecnología real

  }  }



  private logSecurityEvent(req: Request) {  private logSecurityEvent(req: Request) {

    // Solo loggear eventos relevantes para seguridad    // Solo loggear eventos relevantes para seguridad

    const sensitiveRoutes = ['/auth', '/pagos', '/admin'];    const sensitiveRoutes = ['/auth', '/pagos', '/admin'];

    const isSensitiveRoute = sensitiveRoutes.some(route =>     const isSensitiveRoute = sensitiveRoutes.some(route => 

      req.path.startsWith(route)      req.path.startsWith(route)

    );    );

        

    if (isSensitiveRoute) {    if (isSensitiveRoute) {

      const logData = {      const logData = {

        ip: req.ip || req.connection.remoteAddress,        ip: req.ip || req.connection.remoteAddress,

        method: req.method,        method: req.method,

        path: req.path,        path: req.path,

        userAgent: req.get('User-Agent'),        userAgent: req.get('User-Agent'),

        timestamp: new Date().toISOString(),        timestamp: new Date().toISOString(),

        // NO incluir datos sensibles como body completo        // NO incluir datos sensibles como body completo

      };      };

            

      this.logger.log(`Acceso a ruta sensible: ${JSON.stringify(logData)}`);      this.logger.log(`Acceso a ruta sensible: ${JSON.stringify(logData)}`);

    }    }

  }  }

}}



/**/**

 * Decorator para validar roles con logging de seguridad * Decorator para validar roles con logging de seguridad

 */ */

export function SecureRoles(...roles: string[]) {export function SecureRoles(...roles: string[]) {

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    const originalMethod = descriptor.value;    const originalMethod = descriptor.value;

        

    descriptor.value = function (...args: any[]) {    descriptor.value = function (...args: any[]) {

      const req = args.find(arg => arg && arg.user);      const req = args.find(arg => arg && arg.user);

            

      if (req && req.user) {      if (req && req.user) {

        const logger = new Logger('SecureRoles');        const logger = new Logger('SecureRoles');

        logger.log(`Usuario ${req.user.idUsuario} accediendo a ${target.constructor.name}.${propertyKey}`);        logger.log(`Usuario ${req.user.idUsuario} accediendo a ${target.constructor.name}.${propertyKey}`);

                

        // Validar que el usuario tenga uno de los roles requeridos        // Validar que el usuario tenga uno de los roles requeridos

        const userRole = req.user.tipoUsuario;        const userRole = req.user.tipoUsuario;

        if (!roles.includes(userRole)) {        if (!roles.includes(userRole)) {

          logger.warn(`Acceso denegado: Usuario ${req.user.idUsuario} intentó acceder sin permisos suficientes`);          logger.warn(`Acceso denegado: Usuario ${req.user.idUsuario} intentó acceder sin permisos suficientes`);

          throw new BadRequestException('No tienes permisos para esta acción');          throw new BadRequestException('No tienes permisos para esta acción');

        }        }

      }      }

            

      return originalMethod.apply(this, args);      return originalMethod.apply(this, args);

    };    };

        

    return descriptor;    return descriptor;

  };  };

}}  
 
 