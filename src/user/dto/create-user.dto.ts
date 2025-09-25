import { IsNotEmpty, IsString, IsEmail, IsInt, IsOptional, Matches, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'RUT chileno sin puntos ni guión',
        example: '12345678K',
        pattern: '^[0-9]{7,8}[0-9Kk]$'
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9]{7,8}[0-9Kk]$/, { message: 'RUT inválido' })
    rut: string;

    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Juan Carlos',
        minLength: 3
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'Los nombres y apellidos deben contener al menos 3 caracteres' })
    nombreUsuario: string;

    @ApiProperty({
        description: 'Primer apellido del usuario',
        example: 'Pérez',
        minLength: 3
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'Los nombres y apellidos deben contener al menos 3 caracteres' })
    primerApellido: string;

    @ApiPropertyOptional({
        description: 'Segundo apellido del usuario (opcional)',
        example: 'González',
        minLength: 3
    })
    @IsString()
    @IsOptional()
    @MinLength(3, { message: 'Los nombres y apellidos deben contener al menos 3 caracteres' })
    segundoApellido?: string;

    @ApiProperty({
        description: 'Número de teléfono con formato chileno',
        example: '+56987654321',
        pattern: '^\\+569\\d{8}$'
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\+569\d{8}$/, { message: 'Número de teléfono inválido' })
    telefono: string;

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
        minLength: 8
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    contrasena: string;

    @ApiProperty({
        description: 'ID del tipo de usuario',
        example: 1,
        type: 'integer'
    })
    @IsInt()
    @IsNotEmpty()
    tipoUsuarioId: number;

    @ApiPropertyOptional({
        description: 'ID del estado del usuario (opcional)',
        example: 1,
        type: 'integer'
    })
    @IsInt()
    @IsOptional()
    estadoUsuarioId?: number;
}