import { IsNotEmpty, IsString, IsEmail, IsOptional, Matches, MinLength, IsInt } from "class-validator";

export class CreateUniversitarioDto {
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

    // Campos específicos para universitarios
    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'La ciudad debe tener al menos 3 caracteres' })
    ciudad: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'La región debe tener al menos 3 caracteres' })
    region: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'La universidad debe tener al menos 3 caracteres' })
    universidadEstudio: string;

    @IsInt()
    @IsOptional()
    universidadId?: number;

    @IsInt()
    @IsOptional()
    estadoUsuarioId?: number;
}