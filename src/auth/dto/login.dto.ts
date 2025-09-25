import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'usuario@example.com',
        format: 'email'
    })
    @IsEmail({}, { message: 'Formato de correo electrónico inválido' })
    @IsNotEmpty()
    correoElectronico: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'MiPassword123!',
        minLength: 6
    })
    @IsString()
    @IsNotEmpty()
    contrasena: string;
}