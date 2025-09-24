import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Formato de correo electrónico inválido' })
    @IsNotEmpty()
    correoElectronico: string;

    @IsString()
    @IsNotEmpty()
    contrasena: string;
}