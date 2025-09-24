import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './user';
import { JwtService } from '@nestjs/jwt';
import { PayloadEntity } from './payload';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) {}

    async validateUser(body: LoginDto) {
        try {
            console.log('AuthService - Validando email:', body.correoElectronico); // Debug
            
            const user = await this.userService.findOneUser(body.correoElectronico);
            
            console.log('AuthService - Usuario encontrado:', user ? 'Sí' : 'No'); // Debug
            
            if (!user) {
                return null;
            }

            const matchResult = await bcrypt.compare(body.contrasena, user.contrasena);
            console.log('AuthService - Contraseña válida:', matchResult); // Debug
            
            if (matchResult) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { contrasena, ...result } = user;
                return result;
            }
            return null;
        } catch (error) {
            console.error('Error en validateUser:', error); // Debug
            if (error instanceof Error) throw new InternalServerErrorException(error.message);
        }
    }

    login(user: UserEntity) {
    const payload: PayloadEntity = { 
        sub: user.id, 
        correoElectronico: user.correoElectronico,
        tipoUsuarioId: user.tipoUsuarioId,
        estadoUsuarioId: user.estadoUsuarioId
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
