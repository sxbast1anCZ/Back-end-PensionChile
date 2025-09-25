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

  // Crear datos básicos de ubicación (Región Metropolitana, Santiago Centro)
  const regionRM = await prisma.region.upsert({
    where: { codigo: 'RM' },
    update: {},
    create: {
      codigo: 'RM',
      nombre: 'Región Metropolitana de Santiago',
      activo: true,
    },
  });

  const provinciaSantiago = await prisma.provincia.upsert({
    where: { codigo: 'SANTIAGO' },
    update: {},
    create: {
      regionId: regionRM.id,
      codigo: 'SANTIAGO',
      nombre: 'Santiago',
      activo: true,
    },
  });

  const comunaSantiago = await prisma.comuna.upsert({
    where: { codigo: 'SANTIAGO' },
    update: {},
    create: {
      provinciaId: provinciaSantiago.id,
      regionId: regionRM.id,
      codigo: 'SANTIAGO',
      nombre: 'Santiago Centro',
      activo: true,
    },
  });

  await prisma.ubicacion.upsert({
    where: { id: 1 },
    update: {},
    create: {
      regionId: regionRM.id,
      provinciaId: provinciaSantiago.id,
      comunaId: comunaSantiago.id,
      calle: 'Avenida Libertador Bernardo O\'Higgins',
      numero: '1234',
      referencias: 'Cerca del Metro Universidad de Chile',
      latitud: -33.4489,
      longitud: -70.6693,
    },
  });

  // Crear tipos de vivienda
  await prisma.tipoVivienda.upsert({
    where: { nombre: 'Pieza / Habitación' },
    update: {},
    create: {
      nombre: 'Pieza / Habitación',
      descripcion: 'Habitación individual en casa o departamento compartido',
      activo: true,
    },
  });

  await prisma.tipoVivienda.upsert({
    where: { nombre: 'Departamento Monoambiente' },
    update: {},
    create: {
      nombre: 'Departamento Monoambiente',
      descripcion: 'Departamento de un solo ambiente con baño y cocina',
      activo: true,
    },
  });

  await prisma.tipoVivienda.upsert({
    where: { nombre: 'Departamento' },
    update: {},
    create: {
      nombre: 'Departamento',
      descripcion: 'Departamento completo con múltiples habitaciones',
      activo: true,
    },
  });

  // Crear sexos permitidos
  await prisma.sexoPermitido.upsert({
    where: { nombre: 'Masculino' },
    update: {},
    create: {
      nombre: 'Masculino',
      descripcion: 'Solo hombres',
      activo: true,
    },
  });

  await prisma.sexoPermitido.upsert({
    where: { nombre: 'Femenino' },
    update: {},
    create: {
      nombre: 'Femenino',
      descripcion: 'Solo mujeres',
      activo: true,
    },
  });

  await prisma.sexoPermitido.upsert({
    where: { nombre: 'Mixto' },
    update: {},
    create: {
      nombre: 'Mixto',
      descripcion: 'Hombres y mujeres',
      activo: true,
    },
  });

  console.log('✅ Seeding completado');
  
  // Mostrar los datos creados
  const tiposUsuario = await prisma.tipoUsuario.findMany();
  const estadosUsuario = await prisma.estadoUsuario.findMany();
  const tiposVivienda = await prisma.tipoVivienda.findMany();
  const sexosPermitidos = await prisma.sexoPermitido.findMany();
  
  console.log('📊 Tipos de Usuario creados:');
  tiposUsuario.forEach(tipo => {
    console.log(`  - ID: ${tipo.id}, Nombre: ${tipo.nombre}`);
  });
  
  console.log('📊 Estados de Usuario creados:');
  estadosUsuario.forEach(estado => {
    console.log(`  - ID: ${estado.id}, Nombre: ${estado.nombre}`);
  });

  console.log('📊 Tipos de Vivienda creados:');
  tiposVivienda.forEach(tipo => {
    console.log(`  - ID: ${tipo.id}, Nombre: ${tipo.nombre}`);
  });

  console.log('📊 Sexos Permitidos creados:');
  sexosPermitidos.forEach(sexo => {
    console.log(`  - ID: ${sexo.id}, Nombre: ${sexo.nombre}`);
  });

  const ubicaciones = await prisma.ubicacion.findMany({
    include: {
      comuna: {
        include: {
          region: true
        }
      }
    }
  });
  
  console.log('📊 Ubicaciones creadas:');
  ubicaciones.forEach(ubicacion => {
    console.log(`  - ID: ${ubicacion.id}, ${ubicacion.calle} ${ubicacion.numero}, ${ubicacion.comuna.nombre}, ${ubicacion.comuna.region.nombre}`);
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