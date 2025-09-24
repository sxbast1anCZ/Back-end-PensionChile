import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding...');

  // Crear tipos de usuario
  await prisma.tipoUsuario.upsert({
    where: { nombre: 'Universitario' },
    update: {},
    create: {
      nombre: 'Universitario',
      descripcion: 'Usuario estudiante universitario',
      activo: true,
    },
  });

  await prisma.tipoUsuario.upsert({
    where: { nombre: 'Propietario' },
    update: {},
    create: {
      nombre: 'Propietario',
      descripcion: 'Usuario propietario de inmuebles',
      activo: true,
    },
  });

  await prisma.tipoUsuario.upsert({
    where: { nombre: 'Administrador' },
    update: {},
    create: {
      nombre: 'Administrador',
      descripcion: 'Usuario administrador del sistema',
      activo: true,
    },
  });

  // Crear estados de usuario
  await prisma.estadoUsuario.upsert({
    where: { nombre: 'Activo' },
    update: {},
    create: {
      nombre: 'Activo',
      descripcion: 'Usuario activo en el sistema',
      activo: true,
    },
  });

  await prisma.estadoUsuario.upsert({
    where: { nombre: 'Inactivo' },
    update: {},
    create: {
      nombre: 'Inactivo',
      descripcion: 'Usuario inactivo temporalmente',
      activo: true,
    },
  });

  await prisma.estadoUsuario.upsert({
    where: { nombre: 'Bloqueado' },
    update: {},
    create: {
      nombre: 'Bloqueado',
      descripcion: 'Usuario bloqueado por infracciones',
      activo: true,
    },
  });

  await prisma.estadoUsuario.upsert({
    where: { nombre: 'Eliminado' },
    update: {},
    create: {
      nombre: 'Eliminado',
      descripcion: 'Usuario eliminado del sistema',
      activo: false,
    },
  });

  console.log('✅ Seeding completado');
  
  // Mostrar los datos creados
  const tiposUsuario = await prisma.tipoUsuario.findMany();
  const estadosUsuario = await prisma.estadoUsuario.findMany();
  
  console.log('📊 Tipos de Usuario creados:');
  tiposUsuario.forEach(tipo => {
    console.log(`  - ID: ${tipo.id}, Nombre: ${tipo.nombre}`);
  });
  
  console.log('📊 Estados de Usuario creados:');
  estadosUsuario.forEach(estado => {
    console.log(`  - ID: ${estado.id}, Nombre: ${estado.nombre}`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });