import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PublicacionesController],
  providers: [PublicacionesService, PrismaService],
  exports: [PublicacionesService]
})
export class PublicacionesModule {}