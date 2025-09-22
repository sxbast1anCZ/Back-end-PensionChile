import { IsEmail, IsString, MinLength, IsOptional, IsInt, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'RUT chileno con formato XX.XXX.XXX-X',
    example: '12345678-9',
    pattern: '^[0-9]+[-][0-9kK]{1}$',
    minLength: 11,
    maxLength: 12
  })
  @IsString()
  @Length(11, 12, { message: 'RUT debe tener entre 11 y 12 caracteres' })
  @Matches(/^[0-9]+[-][0-9kK]{1}$/, { message: 'Formato de RUT inválido (ej: 12345678-9)' })
  rut: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Carlos',
    minLength: 2
  })
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombreUsuario: string;

  @ApiProperty({
    description: 'Primer apellido del usuario',
    example: 'Pérez',
    minLength: 2
  })
  @IsString()
  @MinLength(2, { message: 'El primer apellido debe tener al menos 2 caracteres' })
  primerApellido: string;

  @ApiPropertyOptional({
    description: 'Segundo apellido del usuario (opcional)',
    example: 'González'
  })
  @IsOptional()
  @IsString()
  segundoApellido?: string;

  @ApiProperty({
    description: 'Número de teléfono chileno (9 dígitos)',
    example: '912345678',
    pattern: '^[0-9]{9}$',
    minLength: 9,
    maxLength: 9
  })
  @IsString()
  @Length(9, 9, { message: 'Su teléfono debe tener exactamente 9 caracteres. EJ: 912345678' })
  @Matches(/^[0-9]{9}$/, { message: 'Su teléfono debe contener solo números' })
  telefono: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@estudiante.uchile.cl',
    format: 'email'
  })
  @IsEmail({}, { message: 'Debe ingresar un formato de email válido. EJ: email@email.com' })
  correoElectronico: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 8 caracteres, debe incluir mayúscula, minúscula, número y carácter especial)',
    example: 'MiPassword123!',
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'
  })
  @IsString()
  @MinLength(8, { message: 'Su contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Su contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial'
  })
  contrasena: string;

  @ApiProperty({
    description: 'Tipo de usuario (1: Universitario, 2: Propietario, 3: Administrador)',
    example: 1,
    enum: [1, 2, 3],
    type: 'integer'
  })
  @IsInt({ message: 'Tipo de usuario debe ser un número' })
  tipoUsuario: number;
}