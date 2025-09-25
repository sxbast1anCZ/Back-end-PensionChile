import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, MaxLength, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePublicacionDto {
  @ApiProperty({
    description: 'Título del alojamiento',
    example: 'Habitación amplia cerca de la Universidad de Chile',
    maxLength: 255
  })
  @IsString()
  @MaxLength(255, { message: 'El título no puede exceder 255 caracteres' })
  titulo: string;

  @ApiProperty({
    description: 'Descripción detallada del alojamiento',
    example: 'Habitación cómoda con ventana, escritorio y closet. Ambiente tranquilo para estudiar.',
    required: false
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Precio mensual del alojamiento en CLP',
    example: 180000,
    minimum: 0
  })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número válido' })
  @Type(() => Number)
  @Min(0, { message: 'El precio debe ser mayor a 0' })
  precioMensual: number;

  @ApiProperty({
    description: 'Indica si tiene baño propio',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  tieneBanoPropio?: boolean;

  @ApiProperty({
    description: 'Indica si tiene cocina propia',
    example: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  tieneCocinaPropia?: boolean;

  @ApiProperty({
    description: 'Indica si tiene lavandería disponible',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  tieneLavanderia?: boolean;

  @ApiProperty({
    description: 'Indica si tiene accesibilidad para personas con discapacidad',
    example: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  tieneAccesibilidad?: boolean;

  @ApiProperty({
    description: 'Indica si incluye internet',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  tieneInternet?: boolean;

  @ApiProperty({
    description: 'Indica si incluye almuerzo',
    example: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  incluyeAlmuerzo?: boolean;

  @ApiProperty({
    description: 'ID del tipo de vivienda (1=Habitación, 2=Departamento, 3=Casa, etc.)',
    example: 1
  })
  @IsNumber({}, { message: 'El tipo de vivienda debe ser un número válido' })
  @Type(() => Number)
  tipoViviendaId: number;

  @ApiProperty({
    description: 'ID del sexo permitido (1=Masculino, 2=Femenino, 3=Mixto)',
    example: 3,
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'El sexo permitido debe ser un número válido' })
  @Type(() => Number)
  sexoPermitidoId?: number;

  @ApiProperty({
    description: 'ID de la ubicación donde se encuentra el alojamiento',
    example: 1
  })
  @IsNumber({}, { message: 'La ubicación debe ser un número válido' })
  @Type(() => Number)
  ubicacionId: number;
}