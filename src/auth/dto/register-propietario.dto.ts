import { IsEmail, IsString, MinLength, IsOptional, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterPropietarioDto {
  @ApiProperty({
    description: 'RUT chileno con formato XXXXXXXX-X',
    example: '12345678-9',
    pattern: '^[0-9]+[-][0-9kK]{1}$',
    minLength: 10,
    maxLength: 12
  })
  @IsString({ message: 'El RUT debe ser una cadena de texto' })
  @Length(10, 12, { message: 'RUT debe tener entre 10 y 12 caracteres' })
  @Matches(/^[0-9]+[-][0-9kK]{1}$/, { message: 'Formato de RUT inválido (ej: 12345678-9)' })
  rut: string;

  @ApiProperty({
    description: 'Nombre del propietario',
    example: 'María Elena',
    minLength: 2,
    maxLength: 100
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  nombreUsuario: string;

  @ApiProperty({
    description: 'Primer apellido del propietario',
    example: 'González',
    minLength: 2,
    maxLength: 100
  })
  @IsString({ message: 'El primer apellido debe ser una cadena de texto' })
  @Length(2, 100, { message: 'El primer apellido debe tener entre 2 y 100 caracteres' })
  primerApellido: string;

  @ApiPropertyOptional({
    description: 'Segundo apellido del propietario (opcional)',
    example: 'Martínez',
    maxLength: 100
  })
  @IsOptional()
  @IsString({ message: 'El segundo apellido debe ser una cadena de texto' })
  @Length(0, 100, { message: 'El segundo apellido no puede exceder 100 caracteres' })
  segundoApellido?: string;

  @ApiProperty({
    description: 'Número de teléfono chileno (9 dígitos)',
    example: '987654321',
    pattern: '^[0-9]{9}$',
    minLength: 9,
    maxLength: 9
  })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Length(9, 9, { message: 'El teléfono debe tener exactamente 9 dígitos' })
  @Matches(/^[0-9]{9}$/, { message: 'El teléfono debe contener solo números (9 dígitos)' })
  telefono: string;

  @ApiProperty({
    description: 'Correo electrónico del propietario',
    example: 'maria.gonzalez@gmail.com',
    format: 'email'
  })
  @IsEmail({}, { message: 'Debe ingresar un formato de email válido' })
  correoElectronico: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 8 caracteres, debe incluir mayúscula, minúscula, número y carácter especial)',
    example: 'MiPassword123!',
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial'
  })
  contrasena: string;

  @ApiPropertyOptional({
    description: 'Biografía del propietario describiendo qué busca en un arrendatario',
    example: 'Busco estudiantes responsables y ordenados. Preferiblemente de carreras de ingeniería o medicina. No fumo y prefiero inquilinos que tampoco lo hagan.',
    maxLength: 1000
  })
  @IsOptional()
  @IsString({ message: 'La biografía debe ser una cadena de texto' })
  @Length(0, 1000, { message: 'La biografía no puede exceder 1000 caracteres' })
  biografiaUsuario?: string;
}