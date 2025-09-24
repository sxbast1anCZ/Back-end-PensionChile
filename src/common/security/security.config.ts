/**
 * Configuración de seguridad para PensionChile
 * Implementa mejores prácticas contra ataques comunes:
 * - SQL Injection
 * - XSS (Cross-Site Scripting)
 * - CSRF (Cross-Site Request Forgery)
 * - Rate Limiting
 * - Input Validation
 */

export const SecurityConfig = {
  // Rate Limiting - Previene ataques de fuerza bruta
  rateLimit: {
    // Límites generales
    general: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // Máximo 100 requests por IP cada 15 min
      message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
    },
    
    // Límites para autenticación (más estrictos)
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 5, // Máximo 5 intentos de login por IP cada 15 min
      message: 'Demasiados intentos de inicio de sesión, intenta de nuevo más tarde.',
    },
    
    // Límites para pagos (muy estrictos)
    payments: {
      windowMs: 60 * 60 * 1000, // 1 hora
      max: 10, // Máximo 10 operaciones de pago por IP cada hora
      message: 'Límite de operaciones de pago excedido, intenta de nuevo más tarde.',
    },
    
    // Límites para creación de contenido
    content: {
      windowMs: 60 * 60 * 1000, // 1 hora
      max: 20, // Máximo 20 publicaciones/reseñas por IP cada hora
      message: 'Límite de creación de contenido excedido, intenta de nuevo más tarde.',
    },
  },

  // Configuración de headers de seguridad
  headers: {
    // Previene clickjacking
    xFrameOptions: 'DENY',
    
    // Previene MIME type sniffing
    xContentTypeOptions: 'nosniff',
    
    // Habilita protección XSS del navegador
    xXssProtection: '1; mode=block',
    
    // Política de referrer estricta
    referrerPolicy: 'strict-origin-when-cross-origin',
    
    // Content Security Policy (ajustar según necesidades)
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
  },

  // Configuración de CORS
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://pensionchile.cl', 'https://www.pensionchile.cl'] // Dominios en producción
      : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'], // Desarrollo
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  },

  // Configuración de validación de entrada
  validation: {
    // Límites de tamaño
    maxStringLength: 1000,
    maxTextLength: 10000,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    
    // Patrones de sanitización
    sanitization: {
      // Caracteres peligrosos para SQL injection
      sqlInjectionPattern: /('|(\\x27)|(\\x2D\\x2D)|(%27)|(%2D%2D))/i,
      
      // Caracteres peligrosos para XSS
      xssPattern: /<script[^>]*>.*?<\/script>/gi,
      
      // Patrones HTML peligrosos
      htmlPattern: /<[^>]*>/g,
      
      // Caracteres especiales permitidos en textos
      allowedSpecialChars: /[a-zA-Z0-9\s\.,;:!?¿¡()áéíóúüñÁÉÍÓÚÜÑ\-_@#$%&*+=\[\]{}|\\:";'<>?,./~`]/,
    },
  },

  // Configuración de logging de seguridad
  logging: {
    // Eventos a loggear
    events: {
      failedLogins: true,
      suspiciousActivity: true,
      sqlInjectionAttempts: true,
      xssAttempts: true,
      rateLimitExceeded: true,
      paymentAnomalies: true,
    },
    
    // Campos sensibles que NUNCA deben loggearse
    sensitiveFields: [
      'password',
      'contrasena',
      'token',
      'cvv',
      'numeroTarjeta',
      'authorizationCode',
      'sessionId',
    ],
  },

  // Configuración de JWT
  jwt: {
    // Tiempo de expiración más corto para mayor seguridad
    expiresIn: '2h', // En lugar de 24h
    
    // Issuer y audience para validación adicional
    issuer: 'pensionchile-backend',
    audience: 'pensionchile-frontend',
    
    // Algoritmo seguro
    algorithm: 'HS512',
  },

  // Configuración de passwords
  password: {
    // Configuración de bcrypt
    saltRounds: 12, // Incrementar para mayor seguridad
    
    // Política de contraseñas
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    
    // Bloqueo por intentos fallidos
    maxFailedAttempts: 5,
    lockoutDuration: 30 * 60 * 1000, // 30 minutos
  },

  // Configuración específica para pagos
  payments: {
    // Timeout para órdenes de pago
    orderTimeout: 15 * 60 * 1000, // 15 minutos
    
    // Límites monetarios (en CLP)
    maxAmount: 1000000, // $1.000.000 CLP
    minAmount: 1000,    // $1.000 CLP
    
    // Validaciones adicionales
    requireStrongAuth: true, // 2FA para montos altos
    highAmountThreshold: 100000, // $100.000 CLP
    
    // IPs permitidas para webhooks de Transbank (actualizar según Transbank)
    allowedWebhookIPs: [
      '200.10.12.0/24', // Ejemplo - actualizar con IPs reales de Transbank
    ],
  },
};

// Función helper para sanitizar strings
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  // Remover caracteres peligrosos para XSS
  let sanitized = input.replace(SecurityConfig.validation.sanitization.xssPattern, '');
  
  // Escapar caracteres HTML
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  
  return sanitized.trim();
}

// Función helper para validar si un string contiene patrones sospechosos
export function isSuspiciousInput(input: string): boolean {
  if (!input) return false;
  
  const { sqlInjectionPattern, xssPattern } = SecurityConfig.validation.sanitization;
  
  return sqlInjectionPattern.test(input) || xssPattern.test(input);
}

// Función helper para generar un buyOrder único y seguro
export function generateSecureBuyOrder(): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `PEN-${timestamp}-${randomString}`;
}