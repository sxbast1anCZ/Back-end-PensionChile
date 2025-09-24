-- CreateEnum
CREATE TYPE "public"."estado_pago" AS ENUM ('PENDIENTE', 'PAGADO', 'FALLIDO', 'CANCELADO', 'EXPIRADO', 'REEMBOLSADO');

-- CreateEnum
CREATE TYPE "public"."metodo_pago" AS ENUM ('TARJETA_CREDITO', 'TARJETA_DEBITO', 'TRANSFERENCIA', 'WEBPAY', 'TRANSBANK');

-- CreateEnum
CREATE TYPE "public"."estado_reporte" AS ENUM ('PENDIENTE', 'EN_REVISION', 'RESUELTO', 'RECHAZADO');

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "rut" VARCHAR(12) NOT NULL,
    "nombre_usuario" VARCHAR(100) NOT NULL,
    "primer_apellido" VARCHAR(100) NOT NULL,
    "segundo_apellido" VARCHAR(100),
    "telefono" VARCHAR(15) NOT NULL,
    "correo_electronico" VARCHAR(320) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "tipo_usuario_id" INTEGER NOT NULL,
    "estado_usuario_id" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "public"."tipos_usuario" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tipos_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."estados_usuario" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estados_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."universitarios" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,
    "region" VARCHAR(100) NOT NULL,
    "universidad_estudio" VARCHAR(255) NOT NULL,
    "universidad_id" INTEGER,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "universitarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."propietarios" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "biografia" TEXT,
    "cantidad_publicaciones" INTEGER NOT NULL DEFAULT 0,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "propietarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."regiones" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(5) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."provincias" (
    "id" SERIAL NOT NULL,
    "region_id" INTEGER NOT NULL,
    "codigo" VARCHAR(10) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provincias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comunas" (
    "id" SERIAL NOT NULL,
    "provincia_id" INTEGER NOT NULL,
    "region_id" INTEGER NOT NULL,
    "codigo" VARCHAR(10) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comunas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ubicaciones" (
    "id" SERIAL NOT NULL,
    "region_id" INTEGER NOT NULL,
    "provincia_id" INTEGER NOT NULL,
    "comuna_id" INTEGER NOT NULL,
    "calle" VARCHAR(255) NOT NULL,
    "numero" VARCHAR(20),
    "referencias" TEXT,
    "latitud" DECIMAL(10,8),
    "longitud" DECIMAL(11,8),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ubicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."listado_universidades" (
    "id" SERIAL NOT NULL,
    "nombre_universidad" VARCHAR(255) NOT NULL,
    "ubicacion_id" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listado_universidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."publicaciones" (
    "id" SERIAL NOT NULL,
    "propietario_id" INTEGER NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "precio_mensual" DECIMAL(10,2) NOT NULL,
    "tiene_bano_propio" BOOLEAN,
    "tiene_cocina_propia" BOOLEAN,
    "tiene_lavanderia" BOOLEAN,
    "tiene_accesibilidad" BOOLEAN,
    "tiene_internet" BOOLEAN,
    "incluye_almuerzo" BOOLEAN,
    "tipo_vivienda_id" INTEGER NOT NULL,
    "sexo_permitido_id" INTEGER,
    "ubicacion_id" INTEGER NOT NULL,
    "es_premium" BOOLEAN NOT NULL DEFAULT false,
    "estado_publicacion" INTEGER NOT NULL DEFAULT 1,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,
    "fecha_expiracion" TIMESTAMP(3),

    CONSTRAINT "publicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fotos_publicaciones" (
    "id" SERIAL NOT NULL,
    "publicacion_id" INTEGER NOT NULL,
    "url_supabase" VARCHAR(500) NOT NULL,
    "nombre_archivo" VARCHAR(255) NOT NULL,
    "es_portada" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "fecha_subida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fotos_publicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resenas" (
    "id" SERIAL NOT NULL,
    "publicacion_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "texto_resena" TEXT NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resenas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tipos_vivienda" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tipos_vivienda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sexos_permitidos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sexos_permitidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."favoritos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "publicacion_id" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reportes" (
    "id" SERIAL NOT NULL,
    "publicacion_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "motivo" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "estado" "public"."estado_reporte" NOT NULL DEFAULT 'PENDIENTE',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_resolucion" TIMESTAMP(3),

    CONSTRAINT "reportes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contactos" (
    "id" SERIAL NOT NULL,
    "publicacion_id" INTEGER NOT NULL,
    "universitario_id" INTEGER NOT NULL,
    "propietario_id" INTEGER NOT NULL,
    "nombre_completo" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "correo" VARCHAR(320) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "respondido" BOOLEAN NOT NULL DEFAULT false,
    "fecha_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_lectura" TIMESTAMP(3),
    "fecha_respuesta" TIMESTAMP(3),

    CONSTRAINT "contactos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."planes_premium" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "duracion_dias" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "destacar_publicacion" BOOLEAN NOT NULL DEFAULT true,
    "aparecer_primero" BOOLEAN NOT NULL DEFAULT true,
    "insignia_especial" BOOLEAN NOT NULL DEFAULT false,
    "multiplicador_visitas" INTEGER NOT NULL DEFAULT 1,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planes_premium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ordenes_pago" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "publicacion_id" INTEGER,
    "plan_premium_id" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "moneda" VARCHAR(3) NOT NULL DEFAULT 'CLP',
    "concepto" VARCHAR(500) NOT NULL,
    "transaction_id" VARCHAR(100),
    "buy_order" VARCHAR(50) NOT NULL,
    "session_id" VARCHAR(100),
    "estado_pago" "public"."estado_pago" NOT NULL DEFAULT 'PENDIENTE',
    "metodo_pago" "public"."metodo_pago",
    "codigo_autorizacion" VARCHAR(50),
    "tipo_tarjeta" VARCHAR(20),
    "ultimos_4_digitos" VARCHAR(4),
    "ip_cliente" VARCHAR(45),
    "user_agent" VARCHAR(1000),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_pago" TIMESTAMP(3),
    "fecha_expiracion" TIMESTAMP(3),
    "fecha_vencimiento_orden" TIMESTAMP(3),
    "intentos_fallidos" INTEGER NOT NULL DEFAULT 0,
    "bloqueado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ordenes_pago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_rut_key" ON "public"."usuarios"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_electronico_key" ON "public"."usuarios"("correo_electronico");

-- CreateIndex
CREATE INDEX "idx_usuario_email" ON "public"."usuarios"("correo_electronico");

-- CreateIndex
CREATE INDEX "idx_usuario_rut" ON "public"."usuarios"("rut");

-- CreateIndex
CREATE INDEX "idx_usuario_tipo" ON "public"."usuarios"("tipo_usuario_id");

-- CreateIndex
CREATE INDEX "idx_usuario_estado" ON "public"."usuarios"("estado_usuario_id");

-- CreateIndex
CREATE INDEX "idx_usuario_fecha_creacion" ON "public"."usuarios"("fecha_creacion");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_usuario_nombre_key" ON "public"."tipos_usuario"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "estados_usuario_nombre_key" ON "public"."estados_usuario"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "universitarios_usuario_id_key" ON "public"."universitarios"("usuario_id");

-- CreateIndex
CREATE INDEX "idx_universitario_universidad" ON "public"."universitarios"("universidad_id");

-- CreateIndex
CREATE INDEX "idx_universitario_ciudad" ON "public"."universitarios"("ciudad");

-- CreateIndex
CREATE UNIQUE INDEX "propietarios_usuario_id_key" ON "public"."propietarios"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "regiones_codigo_key" ON "public"."regiones"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "regiones_nombre_key" ON "public"."regiones"("nombre");

-- CreateIndex
CREATE INDEX "idx_region_activo" ON "public"."regiones"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "provincias_codigo_key" ON "public"."provincias"("codigo");

-- CreateIndex
CREATE INDEX "idx_provincia_region" ON "public"."provincias"("region_id");

-- CreateIndex
CREATE INDEX "idx_provincia_activo" ON "public"."provincias"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "provincias_region_id_nombre_key" ON "public"."provincias"("region_id", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "comunas_codigo_key" ON "public"."comunas"("codigo");

-- CreateIndex
CREATE INDEX "idx_comuna_provincia" ON "public"."comunas"("provincia_id");

-- CreateIndex
CREATE INDEX "idx_comuna_region" ON "public"."comunas"("region_id");

-- CreateIndex
CREATE INDEX "idx_comuna_activo" ON "public"."comunas"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "comunas_provincia_id_nombre_key" ON "public"."comunas"("provincia_id", "nombre");

-- CreateIndex
CREATE INDEX "idx_ubicacion_region" ON "public"."ubicaciones"("region_id");

-- CreateIndex
CREATE INDEX "idx_ubicacion_provincia" ON "public"."ubicaciones"("provincia_id");

-- CreateIndex
CREATE INDEX "idx_ubicacion_comuna" ON "public"."ubicaciones"("comuna_id");

-- CreateIndex
CREATE INDEX "idx_ubicacion_coordenadas" ON "public"."ubicaciones"("latitud", "longitud");

-- CreateIndex
CREATE INDEX "idx_universidad_activo" ON "public"."listado_universidades"("activo");

-- CreateIndex
CREATE INDEX "idx_universidad_nombre" ON "public"."listado_universidades"("nombre_universidad");

-- CreateIndex
CREATE UNIQUE INDEX "listado_universidades_nombre_universidad_ubicacion_id_key" ON "public"."listado_universidades"("nombre_universidad", "ubicacion_id");

-- CreateIndex
CREATE INDEX "idx_publicacion_propietario" ON "public"."publicaciones"("propietario_id");

-- CreateIndex
CREATE INDEX "idx_publicacion_ubicacion" ON "public"."publicaciones"("ubicacion_id");

-- CreateIndex
CREATE INDEX "idx_publicacion_tipo_vivienda" ON "public"."publicaciones"("tipo_vivienda_id");

-- CreateIndex
CREATE INDEX "idx_publicacion_premium_estado" ON "public"."publicaciones"("es_premium", "estado_publicacion");

-- CreateIndex
CREATE INDEX "idx_publicacion_precio" ON "public"."publicaciones"("precio_mensual");

-- CreateIndex
CREATE INDEX "idx_publicacion_fecha_creacion" ON "public"."publicaciones"("fecha_creacion");

-- CreateIndex
CREATE INDEX "idx_foto_publicacion_orden" ON "public"."fotos_publicaciones"("publicacion_id", "orden");

-- CreateIndex
CREATE INDEX "idx_foto_portada" ON "public"."fotos_publicaciones"("es_portada");

-- CreateIndex
CREATE INDEX "idx_resena_calificacion" ON "public"."resenas"("calificacion");

-- CreateIndex
CREATE INDEX "idx_resena_fecha" ON "public"."resenas"("fecha_creacion");

-- CreateIndex
CREATE UNIQUE INDEX "resenas_publicacion_id_usuario_id_key" ON "public"."resenas"("publicacion_id", "usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_vivienda_nombre_key" ON "public"."tipos_vivienda"("nombre");

-- CreateIndex
CREATE INDEX "idx_tipo_vivienda_activo" ON "public"."tipos_vivienda"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "sexos_permitidos_nombre_key" ON "public"."sexos_permitidos"("nombre");

-- CreateIndex
CREATE INDEX "idx_sexo_permitido_activo" ON "public"."sexos_permitidos"("activo");

-- CreateIndex
CREATE INDEX "idx_favorito_usuario" ON "public"."favoritos"("usuario_id");

-- CreateIndex
CREATE INDEX "idx_favorito_fecha" ON "public"."favoritos"("fecha_creacion");

-- CreateIndex
CREATE UNIQUE INDEX "favoritos_usuario_id_publicacion_id_key" ON "public"."favoritos"("usuario_id", "publicacion_id");

-- CreateIndex
CREATE INDEX "idx_reporte_estado" ON "public"."reportes"("estado");

-- CreateIndex
CREATE INDEX "idx_reporte_fecha" ON "public"."reportes"("fecha_creacion");

-- CreateIndex
CREATE UNIQUE INDEX "reportes_publicacion_id_usuario_id_key" ON "public"."reportes"("publicacion_id", "usuario_id");

-- CreateIndex
CREATE INDEX "idx_contacto_propietario_fecha" ON "public"."contactos"("propietario_id", "fecha_envio");

-- CreateIndex
CREATE INDEX "idx_contacto_universitario_fecha" ON "public"."contactos"("universitario_id", "fecha_envio");

-- CreateIndex
CREATE INDEX "idx_contacto_publicacion" ON "public"."contactos"("publicacion_id");

-- CreateIndex
CREATE INDEX "idx_contacto_estado" ON "public"."contactos"("leido", "respondido");

-- CreateIndex
CREATE INDEX "idx_plan_activo_precio" ON "public"."planes_premium"("activo", "precio");

-- CreateIndex
CREATE INDEX "idx_plan_duracion" ON "public"."planes_premium"("duracion_dias");

-- CreateIndex
CREATE UNIQUE INDEX "ordenes_pago_transaction_id_key" ON "public"."ordenes_pago"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "ordenes_pago_buy_order_key" ON "public"."ordenes_pago"("buy_order");

-- CreateIndex
CREATE INDEX "idx_orden_usuario_fecha" ON "public"."ordenes_pago"("usuario_id", "fecha_creacion");

-- CreateIndex
CREATE INDEX "idx_orden_estado_fecha" ON "public"."ordenes_pago"("estado_pago", "fecha_creacion");

-- CreateIndex
CREATE INDEX "idx_orden_buy_order" ON "public"."ordenes_pago"("buy_order");

-- CreateIndex
CREATE INDEX "idx_orden_transaction" ON "public"."ordenes_pago"("transaction_id");

-- CreateIndex
CREATE INDEX "idx_orden_ip_fecha" ON "public"."ordenes_pago"("ip_cliente", "fecha_creacion");

-- CreateIndex
CREATE INDEX "idx_orden_seguridad" ON "public"."ordenes_pago"("intentos_fallidos", "bloqueado");

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_tipo_usuario_id_fkey" FOREIGN KEY ("tipo_usuario_id") REFERENCES "public"."tipos_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_estado_usuario_id_fkey" FOREIGN KEY ("estado_usuario_id") REFERENCES "public"."estados_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."universitarios" ADD CONSTRAINT "universitarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."universitarios" ADD CONSTRAINT "universitarios_universidad_id_fkey" FOREIGN KEY ("universidad_id") REFERENCES "public"."listado_universidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."propietarios" ADD CONSTRAINT "propietarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."provincias" ADD CONSTRAINT "provincias_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "public"."regiones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comunas" ADD CONSTRAINT "comunas_provincia_id_fkey" FOREIGN KEY ("provincia_id") REFERENCES "public"."provincias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comunas" ADD CONSTRAINT "comunas_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "public"."regiones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ubicaciones" ADD CONSTRAINT "ubicaciones_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "public"."regiones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ubicaciones" ADD CONSTRAINT "ubicaciones_provincia_id_fkey" FOREIGN KEY ("provincia_id") REFERENCES "public"."provincias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ubicaciones" ADD CONSTRAINT "ubicaciones_comuna_id_fkey" FOREIGN KEY ("comuna_id") REFERENCES "public"."comunas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."listado_universidades" ADD CONSTRAINT "listado_universidades_ubicacion_id_fkey" FOREIGN KEY ("ubicacion_id") REFERENCES "public"."ubicaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."publicaciones" ADD CONSTRAINT "publicaciones_propietario_id_fkey" FOREIGN KEY ("propietario_id") REFERENCES "public"."usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."publicaciones" ADD CONSTRAINT "publicaciones_tipo_vivienda_id_fkey" FOREIGN KEY ("tipo_vivienda_id") REFERENCES "public"."tipos_vivienda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."publicaciones" ADD CONSTRAINT "publicaciones_sexo_permitido_id_fkey" FOREIGN KEY ("sexo_permitido_id") REFERENCES "public"."sexos_permitidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."publicaciones" ADD CONSTRAINT "publicaciones_ubicacion_id_fkey" FOREIGN KEY ("ubicacion_id") REFERENCES "public"."ubicaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fotos_publicaciones" ADD CONSTRAINT "fotos_publicaciones_publicacion_id_fkey" FOREIGN KEY ("publicacion_id") REFERENCES "public"."publicaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resenas" ADD CONSTRAINT "resenas_publicacion_id_fkey" FOREIGN KEY ("publicacion_id") REFERENCES "public"."publicaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resenas" ADD CONSTRAINT "resenas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favoritos" ADD CONSTRAINT "favoritos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favoritos" ADD CONSTRAINT "favoritos_publicacion_id_fkey" FOREIGN KEY ("publicacion_id") REFERENCES "public"."publicaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reportes" ADD CONSTRAINT "reportes_publicacion_id_fkey" FOREIGN KEY ("publicacion_id") REFERENCES "public"."publicaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reportes" ADD CONSTRAINT "reportes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contactos" ADD CONSTRAINT "contactos_publicacion_id_fkey" FOREIGN KEY ("publicacion_id") REFERENCES "public"."publicaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contactos" ADD CONSTRAINT "contactos_universitario_id_fkey" FOREIGN KEY ("universitario_id") REFERENCES "public"."usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contactos" ADD CONSTRAINT "contactos_propietario_id_fkey" FOREIGN KEY ("propietario_id") REFERENCES "public"."usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ordenes_pago" ADD CONSTRAINT "ordenes_pago_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ordenes_pago" ADD CONSTRAINT "ordenes_pago_publicacion_id_fkey" FOREIGN KEY ("publicacion_id") REFERENCES "public"."publicaciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ordenes_pago" ADD CONSTRAINT "ordenes_pago_plan_premium_id_fkey" FOREIGN KEY ("plan_premium_id") REFERENCES "public"."planes_premium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
