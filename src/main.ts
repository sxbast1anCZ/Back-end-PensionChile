import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { SecurityConfig } from './common/security/security.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Configuración de seguridad con Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }));

  // Compresión de respuestas
  app.use(compression());

  // Configuración global de validación con seguridad mejorada
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: false, // Mayor seguridad en conversiones
    },
    exceptionFactory: (errors) => {
      logger.warn(`Validación fallida: ${JSON.stringify(errors.map(e => e.constraints))}`);
      return new ValidationPipe().createExceptionFactory()(errors);
    },
  }));

  // Configuración de CORS con seguridad mejorada
  app.enableCors(SecurityConfig.cors);

  // Trust proxy para rate limiting detrás de reverse proxy
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('PensionChile API')
    .setDescription(`
## Bienvenido a la API de PensionChile

Esta API permite la gestión completa de una plataforma que conecta estudiantes universitarios con propietarios de pensiones en Chile.

### Funcionalidades principales:
- **Autenticación y autorización** con JWT
- **Gestión de usuarios** (estudiantes y propietarios)
- **Sistema de publicaciones** con fotos y reseñas
- **Búsqueda geográfica** por regiones, provincias y comunas de Chile
- **Catálogo de universidades** chilenas
- **Sistema de pagos** para publicaciones premium

### Seguridad:
- Autenticación JWT obligatoria para operaciones sensibles
- Validación estricta de datos de entrada
- Protección contra ataques comunes (XSS, SQL Injection)
- Rate limiting por usuario y operación
- Headers de seguridad implementados
- Sanitización automática de entrada

### Estructura de respuestas:
Todas las respuestas siguen el formato estándar con códigos HTTP apropiados y mensajes descriptivos.

### Rate Limits:
- **Autenticación**: 5 intentos por 15 minutos
- **Pagos**: 10 operaciones por hora
- **General**: 100 requests por 15 minutos
- **Búsquedas**: 30 requests por minuto

### Soporte:
Para consultas técnicas, contactar al equipo de desarrollo.
    `)
    .setVersion('1.0.0')
    .addTag('Authentication', 'Endpoints para registro, login y gestión de sesiones')
    .addTag('Users', 'Gestión de perfiles de usuario y configuraciones')
    .addTag('Publications', 'CRUD de publicaciones de pensiones con fotos y detalles')
    .addTag('Geography', 'Información geográfica de Chile (regiones, provincias, comunas)')
    .addTag('Universities', 'Catálogo de universidades chilenas')
    .addTag('Payments', 'Sistema de pagos para publicaciones premium')
    .addTag('Reviews', 'Sistema de reseñas y calificaciones')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'access-token',
    )
    .addServer('http://localhost:3000', 'Servidor de desarrollo')
    .addServer('https://api.pensionchile.cl', 'Servidor de producción')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customfavIcon: 'https://pensionchile.cl/favicon.ico',
    customSiteTitle: 'PensionChile API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #1f2937; font-size: 2rem; }
      .swagger-ui .scheme-container { background: #f8fafc; padding: 15px; border-radius: 8px; }
      .swagger-ui .info .description p { margin-bottom: 10px; }
      .swagger-ui .info .description h3 { color: #059669; margin-top: 20px; }
    `,
  });

  await app.listen(process.env.PORT ?? 3000);
  
  logger.log(`
🚀 Aplicación iniciada en: http://localhost:${process.env.PORT ?? 3000}
📚 Documentación Swagger: http://localhost:${process.env.PORT ?? 3000}/api
🗄️  Base de datos PostgreSQL en puerto: 5433
🛡️  Seguridad: Headers implementados, Rate limiting activo
🔒 Validación: Sanitización automática de entrada
  `);
}
bootstrap();
