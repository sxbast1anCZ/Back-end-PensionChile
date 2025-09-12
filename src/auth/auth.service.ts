import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

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
   * Crea un nuevo usuario con contraseña hasheada
   */
  async register(userData: {
    rut: string;
    nombreUsuario: string;
    primerApellido: string;
    segundoApellido?: string;
    telefono: string;
    correoElectronico: string;
    contrasena: string;
    tipoUsuario: number;
  }) {
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
      throw new Error('Usuario ya existe con ese email o RUT');
    }

    // Hashear la contraseña
    const hashedPassword = await this.hashPassword(userData.contrasena);

    // Crear el usuario
    const user = await this.prisma.usuario.create({
      data: {
        ...userData,
        contrasena: hashedPassword,
        estadoUsuario: 1, // Estado "Activo" por defecto
      },
      include: {
        tipoUsuarioRel: true,
        estadoUsuarioRel: true,
      },
    });

    // Excluir la contraseña del resultado
    const { contrasena, ...userWithoutPassword } = user;
    return userWithoutPassword;
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