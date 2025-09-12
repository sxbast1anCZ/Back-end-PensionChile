import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Debe ingresar un formato de email válido. EJ: email@email.com' })
  correoElectronico: string;

  @IsString()
  @MinLength(1, { message: 'Es necesario de una contraseña para iniciar sesión.' })
  password: string; // Passport espera 'password' por defecto
}