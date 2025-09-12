import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key', // Mejor usar variable de entorno
    });
  }

  async validate(payload: any) {
    return { 
      idUsuario: payload.sub, 
      correoElectronico: payload.email,
      tipoUsuario: payload.tipoUsuario,
      rut: payload.rut
    };
  }
}