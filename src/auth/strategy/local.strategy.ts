import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'correoElectronico', // ⚠️ CLAVE: especifica el campo del email
      passwordField: 'contrasena'         // ⚠️ CLAVE: especifica el campo de la contraseña
    });
  }

  async validate(correoElectronico: string, contrasena: string): Promise<any> {
    console.log('LocalStrategy - Email recibido:', correoElectronico); // Debug
    console.log('LocalStrategy - Password recibido:', contrasena ? '***' : 'vacío'); // Debug
    
    const loginDto: LoginDto = { 
        correoElectronico, 
        contrasena 
    };
    const user = await this.authService.validateUser(loginDto);
    
    console.log('LocalStrategy - Usuario validado:', user ? 'Sí' : 'No'); // Debug
    
    if (!user) {
        throw new UnauthorizedException();
    }
    return user;
  }
}
