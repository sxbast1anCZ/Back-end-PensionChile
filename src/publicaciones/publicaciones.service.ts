import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { PublicacionEntity } from './entities/publicacion.entity';

@Injectable()
export class PublicacionesService {
  constructor(private prisma: PrismaService) {}

  async create(createPublicacionDto: CreatePublicacionDto, propietarioId: number): Promise<PublicacionEntity> {
    try {
      // Verificar que el usuario es realmente un propietario
      const propietario = await this.prisma.propietario.findFirst({
        where: { usuarioId: propietarioId }
      });

      if (!propietario) {
        throw new ForbiddenException('Solo los propietarios pueden crear publicaciones');
      }

      // Verificar que el tipo de vivienda existe
      const tipoVivienda = await this.prisma.tipoVivienda.findFirst({
        where: { id: createPublicacionDto.tipoViviendaId, activo: true }
      });

      if (!tipoVivienda) {
        throw new BadRequestException('El tipo de vivienda seleccionado no es válido');
      }

      // Verificar que la ubicación existe
      const ubicacion = await this.prisma.ubicacion.findFirst({
        where: { id: createPublicacionDto.ubicacionId }
      });

      if (!ubicacion) {
        throw new BadRequestException('La ubicación seleccionada no es válida');
      }

      // Verificar sexo permitido si se proporciona
      if (createPublicacionDto.sexoPermitidoId) {
        const sexoPermitido = await this.prisma.sexoPermitido.findFirst({
          where: { id: createPublicacionDto.sexoPermitidoId, activo: true }
        });

        if (!sexoPermitido) {
          throw new BadRequestException('El sexo permitido seleccionado no es válido');
        }
      }

      // Validar que el precio sea válido (según requerimiento RF-003)
      if (createPublicacionDto.precioMensual <= 0) {
        throw new BadRequestException('El precio ingresado no es válido');
      }

      // Crear la publicación
      const nuevaPublicacion = await this.prisma.publicacion.create({
        data: {
          propietarioId,
          titulo: createPublicacionDto.titulo,
          descripcion: createPublicacionDto.descripcion,
          precioMensual: createPublicacionDto.precioMensual,
          tieneBanoPropio: createPublicacionDto.tieneBanoPropio,
          tieneCocinaPropia: createPublicacionDto.tieneCocinaPropia,
          tieneLavanderia: createPublicacionDto.tieneLavanderia,
          tieneAccesibilidad: createPublicacionDto.tieneAccesibilidad,
          tieneInternet: createPublicacionDto.tieneInternet,
          incluyeAlmuerzo: createPublicacionDto.incluyeAlmuerzo,
          tipoViviendaId: createPublicacionDto.tipoViviendaId,
          sexoPermitidoId: createPublicacionDto.sexoPermitidoId,
          ubicacionId: createPublicacionDto.ubicacionId,
          estadoPublicacion: 1 // Activa por defecto
        }
      });

      // Actualizar el contador de publicaciones del propietario
      await this.prisma.propietario.update({
        where: { usuarioId: propietarioId },
        data: {
          cantidadPublicaciones: {
            increment: 1
          }
        }
      });

      return nuevaPublicacion as PublicacionEntity;

    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(`Error al crear la publicación: ${error.message}`);
      }
      throw new BadRequestException('Error interno del servidor');
    }
  }

  async findAll(): Promise<PublicacionEntity[]> {
    try {
      const publicaciones = await this.prisma.publicacion.findMany({
        where: {
          estadoPublicacion: 1 // Solo publicaciones activas
        },
        include: {
          propietario: {
            select: {
              id: true,
              nombreUsuario: true,
              primerApellido: true,
              segundoApellido: true,
              correoElectronico: true,
              telefono: true
            }
          },
          tipoVivienda: true,
          sexoPermitido: true,
          ubicacion: {
            include: {
              comuna: {
                include: {
                  provincia: {
                    include: {
                      region: true
                    }
                  }
                }
              }
            }
          },
          fotos: {
            orderBy: {
              orden: 'asc'
            }
          },
          resenas: {
            include: {
              usuario: {
                select: {
                  id: true,
                  nombreUsuario: true,
                  primerApellido: true
                }
              }
            }
          }
        },
        orderBy: {
          fechaCreacion: 'desc'
        }
      });

      return publicaciones as PublicacionEntity[];

    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(`Error al obtener las publicaciones: ${error.message}`);
      }
      throw new BadRequestException('Error interno del servidor');
    }
  }

  async findOne(id: number): Promise<PublicacionEntity> {
    try {
      const publicacion = await this.prisma.publicacion.findFirst({
        where: {
          id,
          estadoPublicacion: 1 // Solo publicaciones activas
        },
        include: {
          propietario: {
            select: {
              id: true,
              nombreUsuario: true,
              primerApellido: true,
              segundoApellido: true,
              correoElectronico: true,
              telefono: true
            }
          },
          tipoVivienda: true,
          sexoPermitido: true,
          ubicacion: {
            include: {
              comuna: {
                include: {
                  provincia: {
                    include: {
                      region: true
                    }
                  }
                }
              }
            }
          },
          fotos: {
            orderBy: {
              orden: 'asc'
            }
          },
          resenas: {
            include: {
              usuario: {
                select: {
                  id: true,
                  nombreUsuario: true,
                  primerApellido: true
                }
              }
            },
            orderBy: {
              fechaCreacion: 'desc'
            }
          }
        }
      });

      if (!publicacion) {
        throw new NotFoundException('Publicación no encontrada');
      }

      return publicacion as PublicacionEntity;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(`Error al obtener la publicación: ${error.message}`);
      }
      throw new BadRequestException('Error interno del servidor');
    }
  }

  async update(id: number, updatePublicacionDto: UpdatePublicacionDto, propietarioId: number): Promise<PublicacionEntity> {
    try {
      // Verificar que la publicación existe y pertenece al propietario
      const publicacionExistente = await this.prisma.publicacion.findFirst({
        where: { id }
      });

      if (!publicacionExistente) {
        throw new NotFoundException('Publicación no encontrada');
      }

      if (publicacionExistente.propietarioId !== propietarioId) {
        throw new ForbiddenException('No tienes permisos para editar esta publicación');
      }

      // Validaciones similares a las de creación
      if (updatePublicacionDto.tipoViviendaId) {
        const tipoVivienda = await this.prisma.tipoVivienda.findFirst({
          where: { id: updatePublicacionDto.tipoViviendaId, activo: true }
        });

        if (!tipoVivienda) {
          throw new BadRequestException('El tipo de vivienda seleccionado no es válido');
        }
      }

      if (updatePublicacionDto.ubicacionId) {
        const ubicacion = await this.prisma.ubicacion.findFirst({
          where: { id: updatePublicacionDto.ubicacionId }
        });

        if (!ubicacion) {
          throw new BadRequestException('La ubicación seleccionada no es válida');
        }
      }

      if (updatePublicacionDto.sexoPermitidoId) {
        const sexoPermitido = await this.prisma.sexoPermitido.findFirst({
          where: { id: updatePublicacionDto.sexoPermitidoId, activo: true }
        });

        if (!sexoPermitido) {
          throw new BadRequestException('El sexo permitido seleccionado no es válido');
        }
      }

      if (updatePublicacionDto.precioMensual !== undefined && updatePublicacionDto.precioMensual <= 0) {
        throw new BadRequestException('El precio ingresado no es válido');
      }

      // Actualizar la publicación
      const publicacionActualizada = await this.prisma.publicacion.update({
        where: { id },
        data: updatePublicacionDto
      });

      return publicacionActualizada as PublicacionEntity;

    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException || error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(`Error al actualizar la publicación: ${error.message}`);
      }
      throw new BadRequestException('Error interno del servidor');
    }
  }

  async remove(id: number, propietarioId: number): Promise<{ message: string }> {
    try {
      // Verificar que la publicación existe y pertenece al propietario
      const publicacionExistente = await this.prisma.publicacion.findFirst({
        where: { id }
      });

      if (!publicacionExistente) {
        throw new NotFoundException('Publicación no encontrada');
      }

      if (publicacionExistente.propietarioId !== propietarioId) {
        throw new ForbiddenException('No tienes permisos para eliminar esta publicación');
      }

      // Marcar como inactiva en lugar de eliminar (según requerimiento RF-003)
      await this.prisma.publicacion.update({
        where: { id },
        data: {
          estadoPublicacion: 2 // Inactiva
        }
      });

      // Actualizar el contador de publicaciones del propietario
      await this.prisma.propietario.update({
        where: { usuarioId: propietarioId },
        data: {
          cantidadPublicaciones: {
            decrement: 1
          }
        }
      });

      return { message: 'Publicación eliminada exitosamente' };

    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(`Error al eliminar la publicación: ${error.message}`);
      }
      throw new BadRequestException('Error interno del servidor');
    }
  }

  async findByPropietario(propietarioId: number): Promise<PublicacionEntity[]> {
    try {
      const publicaciones = await this.prisma.publicacion.findMany({
        where: {
          propietarioId,
          estadoPublicacion: 1 // Solo publicaciones activas
        },
        include: {
          propietario: {
            select: {
              id: true,
              nombreUsuario: true,
              primerApellido: true,
              segundoApellido: true,
              correoElectronico: true,
              telefono: true
            }
          },
          tipoVivienda: true,
          sexoPermitido: true,
          ubicacion: {
            include: {
              comuna: {
                include: {
                  provincia: {
                    include: {
                      region: true
                    }
                  }
                }
              }
            }
          },
          fotos: {
            orderBy: {
              orden: 'asc'
            }
          },
          resenas: {
            include: {
              usuario: {
                select: {
                  id: true,
                  nombreUsuario: true,
                  primerApellido: true
                }
              }
            }
          }
        },
        orderBy: {
          fechaCreacion: 'desc'
        }
      });

      return publicaciones as PublicacionEntity[];

    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(`Error al obtener las publicaciones del propietario: ${error.message}`);
      }
      throw new BadRequestException('Error interno del servidor');
    }
  }
}