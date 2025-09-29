import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request, 
  ForbiddenException,
  ParseIntPipe
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiBearerAuth,
  ApiParam
} from '@nestjs/swagger';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('publicaciones')
@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Crear nueva publicación de alojamiento',
    description: 'Permite a un propietario autenticado crear una nueva publicación de alojamiento. Se requiere token JWT y el usuario debe ser de tipo propietario.'
  })
  @ApiBody({ type: CreatePublicacionDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Publicación creada exitosamente',
    example: {
      id: 2,
      propietarioId: 3,
      titulo: 'Habitación cerca Universidad de Chile',
      descripcion: 'Habitación cómoda con escritorio...',
      precioMensual: '180000',
      tieneBanoPropio: true,
      tieneInternet: true,
      tipoViviendaId: 1,
      sexoPermitidoId: 3,
      ubicacionId: 1,
      esPremium: false,
      estadoPublicacion: 1,
      fechaCreacion: '2025-09-29T02:31:40.885Z',
      fechaActualizacion: '2025-09-29T02:31:40.885Z'
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token JWT inválido o expirado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Solo los propietarios pueden crear publicaciones' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  async create(@Body() createPublicacionDto: CreatePublicacionDto, @Request() req) {
    // Verificar que el usuario es propietario (tipoUsuarioId = 2)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.tipoUsuarioId !== 2) {
      throw new ForbiddenException('Solo los propietarios pueden crear publicaciones');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.publicacionesService.create(createPublicacionDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todas las publicaciones activas',
    description: 'Obtiene todas las publicaciones de alojamiento que están activas en el sistema'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de publicaciones obtenida exitosamente',
    example: [{
      id: 1,
      titulo: 'Habitación cerca de la Universidad',
      descripcion: 'Habitación cómoda con todos los servicios',
      precioMensual: 180000,
      propietario: {
        nombreUsuario: 'Juan',
        primerApellido: 'Pérez'
      },
      ubicacion: {
        calle: 'Av. Libertador',
        comuna: {
          nombre: 'Santiago Centro'
        }
      }
    }]
  })
  async findAll() {
    return this.publicacionesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener una publicación por ID',
    description: 'Obtiene los detalles completos de una publicación específica'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la publicación',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Publicación encontrada',
    example: {
      id: 1,
      titulo: 'Habitación cerca de la Universidad',
      descripcion: 'Habitación cómoda con todos los servicios',
      precioMensual: 180000,
      propietario: {
        nombreUsuario: 'Juan',
        telefono: '+56912345678'
      },
      fotos: [],
      resenas: []
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Publicación no encontrada' 
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.publicacionesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Actualizar publicación',
    description: 'Permite al propietario actualizar su publicación. Solo el propietario de la publicación puede editarla.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la publicación a actualizar',
    example: 1
  })
  @ApiBody({ type: UpdatePublicacionDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Publicación actualizada exitosamente',
    example: {
      id: 2,
      propietarioId: 3,
      titulo: 'Habitación ACTUALIZADA - Precio rebajado',
      precioMensual: '160000',
      fechaActualizacion: '2025-09-29T02:35:00.000Z'
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token JWT inválido o expirado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'No tienes permisos para editar esta publicación' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Publicación no encontrada' 
  })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updatePublicacionDto: UpdatePublicacionDto, 
    @Request() req
  ) {
    // Verificar que el usuario es propietario
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.tipoUsuarioId !== 2) {
      throw new ForbiddenException('Solo los propietarios pueden editar publicaciones');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.publicacionesService.update(id, updatePublicacionDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Eliminar publicación',
    description: 'Permite al propietario eliminar (marcar como inactiva) su publicación. Solo el propietario de la publicación puede eliminarla.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la publicación a eliminar',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Publicación eliminada exitosamente',
    example: {
      message: 'Publicación eliminada exitosamente'
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token JWT inválido o expirado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'No tienes permisos para eliminar esta publicación' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Publicación no encontrada' 
  })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    // Verificar que el usuario es propietario
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.tipoUsuarioId !== 2) {
      throw new ForbiddenException('Solo los propietarios pueden eliminar publicaciones');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.publicacionesService.remove(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('propietario/mis-publicaciones')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener publicaciones del propietario autenticado',
    description: 'Obtiene todas las publicaciones del propietario que está autenticado'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de publicaciones del propietario obtenida exitosamente' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token JWT inválido o expirado' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Solo los propietarios pueden acceder a este endpoint' 
  })
  async findByPropietario(@Request() req) {
    // Verificar que el usuario es propietario
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.tipoUsuarioId !== 2) {
      throw new ForbiddenException('Solo los propietarios pueden acceder a este endpoint');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.publicacionesService.findByPropietario(req.user.userId);
  }
}