import { 
  IsNotEmpty, 
  IsNumber, 
  IsString, 
  IsEnum, 
  IsObject,
  ValidateNested,
  IsPhoneNumber,
  Matches,
  Length,
  IsPositive
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Enum para métodos de pago
export enum MetodoPago {
  TARJETA_CREDITO = 'TARJETA_CREDITO',
  TARJETA_DEBITO = 'TARJETA_DEBITO',
  TRANSFERENCIA = 'TRANSFERENCIA'
}

// DTO para datos de facturación
export class DatosFacturacionDto {
  @ApiProperty({
    description: 'RUT del cliente (formato: 12345678-9)',
    example: '12345678-9',
    pattern: '^[0-9]+-[0-9kK]$'
  })
  @IsNotEmpty({ message: 'El RUT es obligatorio' })
  @IsString({ message: 'El RUT debe ser un texto' })
  @Matches(/^[0-9]+-[0-9kK]$/, { message: 'El RUT debe tener formato válido (12345678-9)' })
  rut: string;

  @ApiProperty({
    description: 'Razón social o nombre completo',
    example: 'Juan Pérez González',
    minLength: 2,
    maxLength: 100
  })
  @IsNotEmpty({ message: 'La razón social es obligatoria' })
  @IsString({ message: 'La razón social debe ser un texto' })
  @Length(2, 100, { message: 'La razón social debe tener entre 2 y 100 caracteres' })
  razonSocial: string;

  @ApiProperty({
    description: 'Dirección de facturación',
    example: 'Las Condes 123, Depto 45',
    minLength: 5,
    maxLength: 200
  })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @IsString({ message: 'La dirección debe ser un texto' })
  @Length(5, 200, { message: 'La dirección debe tener entre 5 y 200 caracteres' })
  direccion: string;

  @ApiProperty({
    description: 'Ciudad de facturación',
    example: 'Santiago',
    minLength: 2,
    maxLength: 50
  })
  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  @IsString({ message: 'La ciudad debe ser un texto' })
  @Length(2, 50, { message: 'La ciudad debe tener entre 2 y 50 caracteres' })
  ciudad: string;

  @ApiProperty({
    description: 'Teléfono de contacto (formato chileno: +56912345678)',
    example: '+56912345678'
  })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @IsPhoneNumber('CL', { message: 'El teléfono debe ser un número válido chileno' })
  telefono: string;
}

// DTO principal para crear orden de pago
export class CreateOrdenPagoDto {
  @ApiProperty({
    description: 'ID de la publicación a promover',
    example: 1,
    minimum: 1
  })
  @IsNotEmpty({ message: 'El ID de la publicación es obligatorio' })
  @IsNumber({}, { message: 'El ID de la publicación debe ser un número' })
  @IsPositive({ message: 'El ID de la publicación debe ser positivo' })
  idPublicacion: number;

  @ApiProperty({
    description: 'ID del plan premium seleccionado',
    example: 2,
    minimum: 1
  })
  @IsNotEmpty({ message: 'El ID del plan premium es obligatorio' })
  @IsNumber({}, { message: 'El ID del plan premium debe ser un número' })
  @IsPositive({ message: 'El ID del plan premium debe ser positivo' })
  idPlanPremium: number;

  @ApiProperty({
    description: 'Método de pago seleccionado',
    enum: MetodoPago,
    example: MetodoPago.TARJETA_CREDITO
  })
  @IsNotEmpty({ message: 'El método de pago es obligatorio' })
  @IsEnum(MetodoPago, { message: 'El método de pago debe ser válido' })
  metodoPago: MetodoPago;

  @ApiProperty({
    description: 'Datos de facturación del cliente',
    type: DatosFacturacionDto
  })
  @IsNotEmpty({ message: 'Los datos de facturación son obligatorios' })
  @IsObject({ message: 'Los datos de facturación deben ser un objeto' })
  @ValidateNested({ message: 'Los datos de facturación deben ser válidos' })
  @Type(() => DatosFacturacionDto)
  datosFacturacion: DatosFacturacionDto;
}