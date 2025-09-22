/*
  Warnings:

  - A unique constraint covering the columns `[rut]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rut` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."EstadoPago" AS ENUM ('PENDIENTE', 'PAGADO', 'FALLIDO', 'CANCELADO', 'EXPIRADO', 'REEMBOLSADO');

-- CreateEnum
CREATE TYPE "public"."MetodoPago" AS ENUM ('TARJETA_CREDITO', 'TARJETA_DEBITO', 'TRANSFERENCIA', 'WEBPAY', 'TRANSBANK');

-- AlterTable
ALTER TABLE "public"."universitarios" ADD COLUMN     "universidadId" INTEGER;

-- AlterTable
ALTER TABLE "public"."usuarios" ADD COLUMN     "rut" VARCHAR(12) NOT NULL;

-- CreateTable
CREATE TABLE "public"."publicaciones" (
    "id" SERIAL NOT NULL,
    "propietarioId" INTEGER NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "precioMensual" DECIMAL(10,2) NOT NULL,
    "tieneBañoPropio" BOOLEAN,
    "tieneCocinaPropia" BOOLEAN,
    "tieneLavanderia" BOOLEAN,
    "tieneAccesibilidad" BOOLEAN,
    "tipoVivienda" INTEGER NOT NULL,
    "sexosPermitidos" INTEGER,
    "ubicacionId" INTEGER NOT NULL,
    "esPremium" BOOLEAN NOT NULL DEFAULT false,
    "estadoPublicacion" INTEGER NOT NULL DEFAULT 1,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,
    "fechaExpiracion" TIMESTAMP(3),

    CONSTRAINT "publicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fotos_publicaciones" (
    "id" SERIAL NOT NULL,
    "publicacionId" INTEGER NOT NULL,
    "urlSupabase" VARCHAR(500) NOT NULL,
    "nombreArchivo" VARCHAR(255) NOT NULL,
    "esPortada" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "fechaSubida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fotos_publicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tipos_vivienda" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tipos_vivienda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sexos_permitidos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "sexos_permitidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resenas" (
    "id" SERIAL NOT NULL,
    "publicacionId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "textoResena" TEXT NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resenas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."regiones" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(5) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "regiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."provincias" (
    "id" SERIAL NOT NULL,
    "regionId" INTEGER NOT NULL,
    "codigo" VARCHAR(10) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "provincias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comunas" (
    "id" SERIAL NOT NULL,
    "provinciaId" INTEGER NOT NULL,
    "regionId" INTEGER NOT NULL,
    "codigo" VARCHAR(10) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "comunas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ubicaciones" (
    "id" SERIAL NOT NULL,
    "regionId" INTEGER NOT NULL,
    "provinciaId" INTEGER NOT NULL,
    "comunaId" INTEGER NOT NULL,
    "calle" VARCHAR(255) NOT NULL,
    "numero" VARCHAR(20),
    "referencias" TEXT,
    "latitud" DECIMAL(10,8),
    "longitud" DECIMAL(11,8),
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ubicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."listado_universidades" (
    "id" SERIAL NOT NULL,
    "nombreUniversidad" VARCHAR(255) NOT NULL,
    "ubicacionId" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listado_universidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."planes_premium" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "duracionDias" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "destacarPublicacion" BOOLEAN NOT NULL DEFAULT true,
    "aparecerPrimero" BOOLEAN NOT NULL DEFAULT true,
    "insigniaEspecial" BOOLEAN NOT NULL DEFAULT false,
    "multiplicadorVisitas" INTEGER NOT NULL DEFAULT 1,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planes_premium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ordenes_pago" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "publicacionId" INTEGER,
    "planPremiumId" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "moneda" VARCHAR(3) NOT NULL DEFAULT 'CLP',
    "concepto" VARCHAR(255) NOT NULL,
    "transactionId" VARCHAR(100),
    "buyOrder" VARCHAR(50) NOT NULL,
    "sessionId" VARCHAR(100),
    "estadoPago" "public"."EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "metodoPago" "public"."MetodoPago",
    "codigoAutorizacion" VARCHAR(50),
    "tipoTarjeta" VARCHAR(20),
    "ultimos4Digitos" VARCHAR(4),
    "ipCliente" VARCHAR(45),
    "userAgent" VARCHAR(500),
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaPago" TIMESTAMP(3),
    "fechaExpiracion" TIMESTAMP(3),
    "fechaVencimientoOrden" TIMESTAMP(3),
    "intentosFallidos" INTEGER NOT NULL DEFAULT 0,
    "bloqueado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ordenes_pago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tipos_vivienda_nombre_key" ON "public"."tipos_vivienda"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "sexos_permitidos_nombre_key" ON "public"."sexos_permitidos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "resenas_publicacionId_usuarioId_key" ON "public"."resenas"("publicacionId", "usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "regiones_codigo_key" ON "public"."regiones"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "regiones_nombre_key" ON "public"."regiones"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "provincias_codigo_key" ON "public"."provincias"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "provincias_regionId_nombre_key" ON "public"."provincias"("regionId", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "comunas_codigo_key" ON "public"."comunas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "comunas_provinciaId_nombre_key" ON "public"."comunas"("provinciaId", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "listado_universidades_nombreUniversidad_ubicacionId_key" ON "public"."listado_universidades"("nombreUniversidad", "ubicacionId");

-- CreateIndex
CREATE UNIQUE INDEX "ordenes_pago_transactionId_key" ON "public"."ordenes_pago"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "ordenes_pago_buyOrder_key" ON "public"."ordenes_pago"("buyOrder");

-- CreateIndex
CREATE INDEX "ordenes_pago_usuarioId_fechaCreacion_idx" ON "public"."ordenes_pago"("usuarioId", "fechaCreacion");

-- CreateIndex
CREATE INDEX "ordenes_pago_estadoPago_fechaCreacion_idx" ON "public"."ordenes_pago"("estadoPago", "fechaCreacion");

-- CreateIndex
CREATE INDEX "ordenes_pago_buyOrder_idx" ON "public"."ordenes_pago"("buyOrder");

-- CreateIndex
CREATE INDEX "ordenes_pago_ipCliente_fechaCreacion_idx" ON "public"."ordenes_pago"("ipCliente", "fechaCreacion");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_rut_key" ON "public"."usuarios"("rut");

-- AddForeignKey
ALTER TABLE "public"."universitarios" ADD CONSTRAINT "universitarios_universidadId_fkey" FOREIGN KEY ("universidadId") REFERENCES "public"."listado_universidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."publicaciones" ADD CONSTRAINT "publicaciones_propietarioId_fkey" FOREIGN KEY ("propietarioId") REFERENCES "public"."usuarios"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."publicaciones" ADD CONSTRAINT "publicaciones_tipoVivienda_fkey" FOREIGN KEY ("tipoVivienda") REFERENCES "public"."tipos_vivienda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."publicaciones" ADD CONSTRAINT "publicaciones_sexosPermitidos_fkey" FOREIGN KEY ("sexosPermitidos") REFERENCES "public"."sexos_permitidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."publicaciones" ADD CONSTRAINT "publicaciones_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "public"."ubicaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fotos_publicaciones" ADD CONSTRAINT "fotos_publicaciones_publicacionId_fkey" FOREIGN KEY ("publicacionId") REFERENCES "public"."publicaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resenas" ADD CONSTRAINT "resenas_publicacionId_fkey" FOREIGN KEY ("publicacionId") REFERENCES "public"."publicaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resenas" ADD CONSTRAINT "resenas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."provincias" ADD CONSTRAINT "provincias_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "public"."regiones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comunas" ADD CONSTRAINT "comunas_provinciaId_fkey" FOREIGN KEY ("provinciaId") REFERENCES "public"."provincias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comunas" ADD CONSTRAINT "comunas_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "public"."regiones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ubicaciones" ADD CONSTRAINT "ubicaciones_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "public"."regiones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ubicaciones" ADD CONSTRAINT "ubicaciones_provinciaId_fkey" FOREIGN KEY ("provinciaId") REFERENCES "public"."provincias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ubicaciones" ADD CONSTRAINT "ubicaciones_comunaId_fkey" FOREIGN KEY ("comunaId") REFERENCES "public"."comunas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."listado_universidades" ADD CONSTRAINT "listado_universidades_ubicacionId_fkey" FOREIGN KEY ("ubicacionId") REFERENCES "public"."ubicaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ordenes_pago" ADD CONSTRAINT "ordenes_pago_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ordenes_pago" ADD CONSTRAINT "ordenes_pago_publicacionId_fkey" FOREIGN KEY ("publicacionId") REFERENCES "public"."publicaciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ordenes_pago" ADD CONSTRAINT "ordenes_pago_planPremiumId_fkey" FOREIGN KEY ("planPremiumId") REFERENCES "public"."planes_premium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
