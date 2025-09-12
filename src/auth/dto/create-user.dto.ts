import { IsEmail, IsString, MinLength, IsOptional, IsInt, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(11, 12, { message: 'RUT debe tener entre 11 y 12 caracteres' })
  @Matches(/^[0-9]+[-][0-9kK]{1}$/, { message: 'Formato de RUT inválido (ej: 12345678-9)' })
  rut: string;

  @IsString()
  @MinLength(2, { message: 'Nombre debe tener al menos 2 caracteres' })
  nombreUsuario: string;

  @IsString()
  @MinLength(2, { message: 'Primer apellido debe tener al menos 2 caracteres' })
  primerApellido: string;

  @IsOptional()
  @IsString()
  segundoApellido?: string;

  @IsString()
  @Length(9, 9, { message: 'Su teléfono debe tener exactamente 9 carácteres. EJ: 912345678' })
  @Matches(/^[0-9]{9}$/, { message: 'Su teléfono debe contener solo números' })
  telefono: string;

  @IsEmail({}, { message: 'Debe ingresar un formato de email válido. EJ: email@email.com' })
  correoElectronico: string;

  @IsString()
  @MinLength(8, { message: 'Su contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Su contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial'
  })
  contrasena: string;

  @IsInt({ message: 'Tipo de usuario debe ser un número' })
  tipoUsuario: number;
}