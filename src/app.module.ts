import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PagosModule } from './pagos/pagos.module';
// Middleware de seguridad habilitado
import { SecurityMiddleware } from './common/security/security.middleware';
import { SecurityConfig } from './common/security/security.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Configuración global de rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: SecurityConfig.rateLimit.general.windowMs,
        limit: SecurityConfig.rateLimit.general.max,
      },
      {
        name: 'auth',
        ttl: SecurityConfig.rateLimit.auth.windowMs,
        limit: SecurityConfig.rateLimit.auth.max,
      },
      {
        name: 'payments',
        ttl: SecurityConfig.rateLimit.payments.windowMs,
        limit: SecurityConfig.rateLimit.payments.max,
      },
    ]),
    PrismaModule,
    AuthModule,
    PagosModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Habilitar rate limiting globalmente
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Middleware de seguridad habilitado con control de acceso por niveles
    consumer
      .apply(SecurityMiddleware)
      .forRoutes('*');
  }
}
