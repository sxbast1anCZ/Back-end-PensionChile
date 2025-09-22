import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@estudiante.uchile.cl',
    format: 'email'
  })
  @IsEmail({}, { message: 'Debe ingresar un formato de email válido. EJ: email@email.com' })
  correoElectronico: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'miPasswordSegura123',
    minLength: 1
  })
  @IsString()
  @MinLength(1, { message: 'Es necesario de una contraseña para iniciar sesión.' })
  password: string; // Passport espera 'password' por defecto
}