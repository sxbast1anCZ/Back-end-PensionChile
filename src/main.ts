import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de CORS
  app.enableCors({
    origin: 'http://localhost:3000', // URL del frontend Next.js
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  // Configuración de validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades no definidas en el DTO
    forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
    transform: true, // Transforma los tipos automáticamente
  }));

  // Configuración de Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('PensionChile API')
    .setDescription('API REST para la plataforma PensionChile - Sistema de gestión de pensiones estudiantiles')
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticación y registro')
    .addTag('publicaciones', 'Endpoints de gestión de publicaciones de alojamientos')
    .addTag('pagos', 'Endpoints de gestión de pagos y planes premium')
    .addTag('usuarios', 'Endpoints de gestión de usuarios')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'JWT-auth'
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Mantiene el token entre recargas
      tagsSorter: 'alpha', // Ordena los tags alfabéticamente
      operationsSorter: 'alpha', // Ordena las operaciones alfabéticamente
    },
    customSiteTitle: 'PensionChile API Docs',
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  console.log(`\n Aplicación iniciada en: http://localhost:${port}`);
  console.log(` Documentación Swagger: http://localhost:${port}/api`);
  console.log(`  Base de datos PostgreSQL en puerto: ${process.env.DATABASE_PORT || 5432}`);
}
void bootstrap();
