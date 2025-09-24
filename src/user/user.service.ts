import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor( private prisma: PrismaService) {}

    async createUser(body: CreateUserDto) {
        try {
            // Validar duplicados antes de crear
            const existingUser = await this.prisma.usuario.findFirst({
                where: {
                    OR: [
                        { rut: body.rut },
                        { correoElectronico: body.correoElectronico }
                    ]
                }
            });

            if (existingUser) {
                if (existingUser.rut === body.rut) {
                    throw new InternalServerErrorException('El RUT ya se encuentra registrado en el sistema');
                }
                if (existingUser.correoElectronico === body.correoElectronico) {
                    throw new InternalServerErrorException('El correo ya se encuentra registrado en el sistema');
                }
            }

            const salts = await bcrypt.genSalt();
            const hash = await bcrypt.hash(body.contrasena, salts);
            const newUser = await this.prisma.usuario.create({ 
                data: {
                    rut: body.rut,
                    nombreUsuario: body.nombreUsuario,
                    primerApellido: body.primerApellido,
                    segundoApellido: body.segundoApellido,
                    telefono: body.telefono,
                    correoElectronico: body.correoElectronico,
                    contrasena: hash,
                    tipoUsuarioId: body.tipoUsuarioId,
                    estadoUsuarioId: body.estadoUsuarioId || 1 // Estado activo por defecto
                }
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {contrasena, ...result} = newUser;
            return result;
        } catch (error) {
            if (error instanceof Error) 
                throw new InternalServerErrorException(error.message);
        }

    }
    async findOneUser(correoElectronico: string) {
        try {
            console.log('UserService - Buscando email:', correoElectronico); // Debug
            
            const user = await this.prisma.usuario.findFirst({ 
                where: { correoElectronico },
                include: {
                    tipoUsuario: true,
                    estadoUsuario: true,
                    universitario: true,
                    propietario: true
                }
            });
            
            console.log('UserService - Usuario en DB:', user ? 'Encontrado' : 'No encontrado'); // Debug
            
            if (user) return user;
            return null;
        } catch (error) {
            console.error('Error en findOneUser:', error); // Debug
            if (error instanceof Error) 
                throw new InternalServerErrorException(error.message);
            
        }
    }

    async getUserById(id: number){
        try {
            const user = await this.prisma.usuario.findFirst({
                where: { id },
                include: {
                    tipoUsuario: true,
                    estadoUsuario: true,
                    universitario: true,
                    propietario: true
                }
            });
            if (!user) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
            
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { contrasena, ...result } = user;
            return result;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            if (error instanceof Error) throw new InternalServerErrorException(error.message);
        }
    }
}
