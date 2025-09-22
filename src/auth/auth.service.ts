import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUniversitarioDto } from './dto/register-universitario.dto';
import { RegisterPropietarioDto } from './dto/register-propietario.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Hashea una contraseña usando bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12; // Más seguro que el default de 10
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verifica si una contraseña coincide con el hash
   */
  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Valida las credenciales del usuario
   */
  async validateUser(correoElectronico: string, password: string): Promise<any> {
    const user = await this.prisma.usuario.findUnique({
      where: { correoElectronico },
      include: {
        tipoUsuarioRel: true,
        estadoUsuarioRel: true,
        universitario: true,
        propietario: true,
      },
    });

    if (!user) {
      return null;
    }

    // Verificar que el usuario esté activo
    if (user.estadoUsuarioRel.nombre !== 'Activo') {
      throw new Error('Usuario inactivo o suspendido, contáctese con el administrador.');
    }

    const isPasswordValid = await this.comparePasswords(password, user.contrasena);
    
    if (isPasswordValid) {
      // Excluir la contraseña del objeto retornado
      const { contrasena, ...result } = user;
      return result;
    }

    return null;
  }

  /**
   * Genera un JWT token para el usuario
   */
  async login(user: any) {
    const payload = { 
      sub: user.idUsuario, 
      email: user.correoElectronico,
      tipoUsuario: user.tipoUsuario,
      rut: user.rut 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        idUsuario: user.idUsuario,
        nombreUsuario: user.nombreUsuario,
        correoElectronico: user.correoElectronico,
        rut: user.rut,
        tipoUsuario: user.tipoUsuarioRel.nombre,
        estadoUsuario: user.estadoUsuarioRel.nombre,
      },
    };
  }

  /**
   * Valida que el RUT chileno sea válido
   */
  private validarRutChileno(rut: string): boolean {
    // Limpiar el RUT
    const rutLimpio = rut.replace(/\./g, '').toUpperCase();
    const cuerpo = rutLimpio.slice(0, -2);
    const dv = rutLimpio.slice(-1);

    // Verificar formato
    if (!/^[0-9]+[-][0-9kK]{1}$/.test(rutLimpio)) {
      return false;
    }

    // Calcular dígito verificador
    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i)) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const dvCalculado = 11 - (suma % 11);
    const dvFinal = dvCalculado === 11 ? '0' : dvCalculado === 10 ? 'K' : dvCalculado.toString();

    return dv === dvFinal;
  }

  /**
   * Registro específico para universitarios
   */
  async registerUniversitario(userData: RegisterUniversitarioDto) {
    // Validar RUT chileno
    if (!this.validarRutChileno(userData.rut)) {
      throw new BadRequestException('RUT chileno inválido');
    }

    // Verificar que el usuario no exista
    const existingUser = await this.prisma.usuario.findFirst({
      where: {
        OR: [
          { correoElectronico: userData.correoElectronico },
          { rut: userData.rut },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con ese email o RUT');
    }

    // Buscar la universidad en el catálogo
    const universidad = await this.prisma.listadoUniversidades.findFirst({
      where: {
        nombreUniversidad: {
          contains: userData.nombreUniversidadEstudiante,
          mode: 'insensitive'
        },
        activo: true
      }
    });

    if (!universidad) {
      throw new BadRequestException(`No se encontró la universidad "${userData.nombreUniversidadEstudiante}" en nuestro catálogo`);
    }

    // Obtener el estado "Activo" por defecto
    const estadoActivo = await this.prisma.estadoUsuario.findFirst({
      where: { nombre: 'Activo', activo: true }
    });

    if (!estadoActivo) {
      throw new BadRequestException('Error del sistema: No se pudo obtener el estado de usuario');
    }

    // Hashear la contraseña
    const hashedPassword = await this.hashPassword(userData.contrasena);

    try {
      // Crear el usuario y el registro de universitario en una transacción
      const result = await this.prisma.$transaction(async (prisma) => {
        // Crear usuario base
        const user = await prisma.usuario.create({
          data: {
            rut: userData.rut,
            nombreUsuario: userData.nombreUsuario,
            primerApellido: userData.primerApellido,
            segundoApellido: userData.segundoApellido,
            telefono: userData.telefono,
            correoElectronico: userData.correoElectronico,
            contrasena: hashedPassword,
            tipoUsuario: 1, // Universitario
            estadoUsuario: estadoActivo.id,
          },
          include: {
            tipoUsuarioRel: true,
            estadoUsuarioRel: true,
          },
        });

        // Crear registro específico de universitario
        await prisma.universitario.create({
          data: {
            idUsuario: user.idUsuario,
            ciudad: userData.ciudad,
            region: userData.region,
            universidadEstudio: userData.nombreUniversidadEstudiante,
            universidadId: universidad.id,
          },
        });

        return user;
      });

      // Excluir la contraseña del resultado
      const { contrasena, ...userWithoutPassword } = result;
      return {
        ...userWithoutPassword,
        universidad: universidad.nombreUniversidad
      };

    } catch (error) {
      throw new BadRequestException('Error al crear el usuario universitario: ' + error.message);
    }
  }

  /**
   * Registro específico para propietarios
   */
  async registerPropietario(userData: RegisterPropietarioDto) {
    // Validar RUT chileno
    if (!this.validarRutChileno(userData.rut)) {
      throw new BadRequestException('RUT chileno inválido');
    }

    // Verificar que el usuario no exista
    const existingUser = await this.prisma.usuario.findFirst({
      where: {
        OR: [
          { correoElectronico: userData.correoElectronico },
          { rut: userData.rut },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con ese email o RUT');
    }

    // Obtener el estado "Activo" por defecto
    const estadoActivo = await this.prisma.estadoUsuario.findFirst({
      where: { nombre: 'Activo', activo: true }
    });

    if (!estadoActivo) {
      throw new BadRequestException('Error del sistema: No se pudo obtener el estado de usuario');
    }

    // Hashear la contraseña
    const hashedPassword = await this.hashPassword(userData.contrasena);

    try {
      // Crear el usuario y el registro de propietario en una transacción
      const result = await this.prisma.$transaction(async (prisma) => {
        // Crear usuario base
        const user = await prisma.usuario.create({
          data: {
            rut: userData.rut,
            nombreUsuario: userData.nombreUsuario,
            primerApellido: userData.primerApellido,
            segundoApellido: userData.segundoApellido,
            telefono: userData.telefono,
            correoElectronico: userData.correoElectronico,
            contrasena: hashedPassword,
            tipoUsuario: 2, // Propietario
            estadoUsuario: estadoActivo.id,
          },
          include: {
            tipoUsuarioRel: true,
            estadoUsuarioRel: true,
          },
        });

        // Crear registro específico de propietario
        await prisma.propietario.create({
          data: {
            idUsuario: user.idUsuario,
            biografiaUsuario: userData.biografiaUsuario || null,
            cantidadPublicaciones: 0, // Iniciar con 0 publicaciones
          },
        });

        return user;
      });

      // Excluir la contraseña del resultado
      const { contrasena, ...userWithoutPassword } = result;
      return userWithoutPassword;

    } catch (error) {
      throw new BadRequestException('Error al crear el usuario propietario: ' + error.message);
    }
  }

  /**
   * Obtiene las universidades disponibles para formularios
   */
  async getUniversidades() {
    return this.prisma.listadoUniversidades.findMany({
      where: { activo: true },
      select: {
        id: true,
        nombreUniversidad: true,
        ubicacion: {
          select: {
            region: { select: { nombre: true } },
            provincia: { select: { nombre: true } },
            comuna: { select: { nombre: true } }
          }
        }
      },
      orderBy: { nombreUniversidad: 'asc' }
    });
  }

  /**
   * Obtiene los tipos de usuario activos para formularios
   */
  async getTiposUsuario() {
    return this.prisma.tipoUsuario.findMany({
      where: { activo: true },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
      },
      orderBy: { nombre: 'asc' }
    });
  }

  /**
   * Obtiene los estados de usuario activos para formularios
   */
  async getEstadosUsuario() {
    return this.prisma.estadoUsuario.findMany({
      where: { activo: true },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
      },
      orderBy: { nombre: 'asc' }
    });
  }
}