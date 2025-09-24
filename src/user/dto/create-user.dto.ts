import { IsNotEmpty, IsString, IsEmail, IsInt, IsOptional, Matches, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9]{7,8}[0-9Kk]$/, { message: 'RUT inválido' })
    rut: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'Los nombres y apellidos deben contener al menos 3 caracteres' })
    nombreUsuario: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'Los nombres y apellidos deben contener al menos 3 caracteres' })
    primerApellido: string;

    @IsString()
    @IsOptional()
    @MinLength(3, { message: 'Los nombres y apellidos deben contener al menos 3 caracteres' })
    segundoApellido?: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\+569\d{8}$/, { message: 'Número de teléfono inválido' })
    telefono: string;

    @IsEmail({}, { message: 'Formato de correo electrónico inválido' })
    @IsNotEmpty()
    correoElectronico: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    contrasena: string;

    @IsInt()
    @IsNotEmpty()
    tipoUsuarioId: number;

    @IsInt()
    @IsOptional()
    estadoUsuarioId?: number;
}