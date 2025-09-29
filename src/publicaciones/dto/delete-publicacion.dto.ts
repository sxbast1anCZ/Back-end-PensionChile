import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class DeletePublicacionDto {
  @ApiProperty({
    description: 'ID de la publicación a eliminar',
    example: 1,
    type: 'integer'
  })
  @IsNotEmpty({ message: 'El ID de la publicación es requerido' })
  @IsInt({ message: 'Por favor ingrese una publicación que exista' })
  @Type(() => Number)
  id: number;
}