import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades no definidas en el DTO
    forbidNonWhitelisted: true, // Arroja error si hay propiedades extra
    transform: true, // Transforma automáticamente los tipos
  }));

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('PensionChile API')
    .setDescription('API del sistema de arriendo de propiedades para estudiantes universitarios en Chile')
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticación y registro')
    .addTag('publicaciones', 'Gestión de publicaciones de propiedades')
    .addTag('ubicaciones', 'Sistema de ubicaciones de Chile')
    .addTag('fotos', 'Gestión de fotos de publicaciones')
    .addTag('usuarios', 'Gestión de usuarios')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa el JWT token',
        in: 'header',
      },
      'JWT-auth', // Este nombre se usa en los decoradores
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'PensionChile API Docs',
    customfavIcon: 'https://nestjs.com/favicon.ico',
    customCss: `
      .topbar-wrapper .link {
        content: url('https://nestjs.com/logo-small.svg'); 
        width: 40px; 
        height: 40px;
      }
      .swagger-ui .topbar { background-color: #e21b5a; }
    `,
  });
  
  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 Aplicación ejecutándose en: http://localhost:3000');
  console.log('📚 Documentación API en: http://localhost:3000/api-docs');
}
bootstrap();
