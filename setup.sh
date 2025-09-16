#!/bin/bash

# 🚀 Setup script para Back-end PensionChile
# Este script automatiza la configuración inicial del proyecto

echo "🏠 Configurando Back-end PensionChile..."
echo ""

# Verificar que Node.js esté instalado
echo "🔍 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org/"
    exit 1
fi

# Verificar que Docker esté instalado
echo "🔍 Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instálalo desde https://docker.com/"
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Verificar si existe .env
if [ ! -f .env ]; then
    echo "📝 Copiando archivo de variables de entorno..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Edita el archivo .env y genera tu propia clave JWT"
    echo "   Ejecuta: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
    echo ""
fi

# Levantar Docker
echo "🐳 Levantando base de datos con Docker..."
docker-compose up -d

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando que PostgreSQL esté listo..."
sleep 10

# Configurar Prisma
echo "🗄️  Configurando base de datos..."
npx prisma generate
npx prisma db push
npx prisma db seed

echo ""
echo "✅ ¡Configuración completada!"
echo ""
echo "🚀 Para iniciar el servidor ejecuta:"
echo "   npm run start:dev"
echo ""
echo "🌐 Para ver la base de datos ejecuta:"
echo "   npx prisma studio"
echo ""
echo "📖 Lee el README.md para más información"