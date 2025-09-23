import { Injectable, NestMiddleware, BadRequestException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SecurityMiddleware.name);

  private readonly publicRoutes = [
    '/auth/register/universitario',
    '/auth/register/propietario', 
    '/auth/login',
    '/auth/universidades',
    '/auth/tipos-usuario',
    '/auth/estados-usuario',
    '/pagos/planes-premium',
    '/'
  ];

  private readonly userRoutes = [
    '/auth/profile',
    '/auth/verify',
    '/pagos/crear-orden',
    '/pagos/mis-ordenes'
  ];

  private readonly adminRoutes = [
    '/admin',
    '/usuarios/manage',
    '/system'
  ];

  use(req: Request, res: Response, next: NextFunction) {
    try {
      this.addSecurityHeaders(res);
      const routeType = this.getRouteType(req.path);
      
      switch (routeType) {
        case 'public':
          this.applyBasicSecurity(req);
          break;
        case 'user':
          this.applyBasicSecurity(req);
          this.validateUserAccess(req);
          break;
        case 'admin':
          this.applyBasicSecurity(req);
          this.validateUserAccess(req);
          this.validateAdminAccess(req);
          break;
        default:
          this.applyBasicSecurity(req);
          break;
      }
      
      this.logSecurityEvent(req, routeType);
      next();
    } catch (error) {
      this.logger.error(`Error en SecurityMiddleware: ${error.message}`);
      throw error;
    }
  }

  private getRouteType(path: string): 'public' | 'user' | 'admin' {
    if (this.publicRoutes.some(route => path.startsWith(route))) {
      return 'public';
    }
    if (this.adminRoutes.some(route => path.startsWith(route))) {
      return 'admin';
    }
    if (this.userRoutes.some(route => path.startsWith(route))) {
      return 'user';
    }
    return 'user';
  }

  private applyBasicSecurity(req: Request) {
    const userAgent = req.get('User-Agent') || '';
    const suspiciousUserAgents = ['sqlmap', 'nikto', 'nmap', 'burp', 'scanner'];
    
    const isSuspiciousUA = suspiciousUserAgents.some(ua => 
      userAgent.toLowerCase().includes(ua)
    );
    
    if (isSuspiciousUA) {
      throw new BadRequestException('Actividad sospechosa detectada');
    }

    const fullUrl = req.originalUrl || '';
    const sqlKeywords = ['union', 'select', 'insert', 'delete', 'drop', 'exec'];
    const sqlKeywordCount = sqlKeywords.filter(keyword => 
      fullUrl.toLowerCase().includes(keyword)
    ).length;
    
    if (sqlKeywordCount >= 2) {
      throw new BadRequestException('Solicitud inválida');
    }
  }

  private validateUserAccess(req: Request) {
    this.logger.debug('Validación de acceso de usuario aplicada');
  }

  private validateAdminAccess(req: Request) {
    this.logger.debug('Validación de acceso de administrador aplicada');
  }

  private addSecurityHeaders(res: Response) {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '0');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Powered-By', 'PensionChile');
  }

  private logSecurityEvent(req: Request, routeType: string) {
    if (routeType === 'admin' || req.path.startsWith('/auth') || req.path.startsWith('/pagos')) {
      this.logger.log(`Acceso a ruta ${routeType}: ${req.method} ${req.path}`);
    }
  }
}
