# Manos Que Ayudan

Manos Que Ayudan es una plataforma web que facilita la organización y participación en proyectos de ayuda comunitaria. Permite a los usuarios crear, unirse y gestionar proyectos sociales en su área geográfica.

## Características Principales

- 🌐 Sistema de geolocalización para proyectos
- 👥 Gestión de participantes y roles
- 📊 Estadísticas de proyecto
- 🔒 Sistema de autenticación y autorización
- 📝 Gestión de actividades por proyecto
- 📍 Radio de trabajo personalizable
- 🚫 Sistema de reportes y moderación

## Tecnologías

### Backend
- Go (Golang)
- Echo Framework
- GORM (ORM)
- MySQL
- Gorilla Sessions

### Frontend
- React.js
- React Router
- React Bootstrap
- Leaflet (mapas)
- Axios
- Recharts (gráficos)

## Requisitos Previos

- Go 1.19 o superior
- Node.js 16 o superior
- MySQL 8.0 o superior
- npm o yarn

## Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/manuelNagel/ManosQueAyudan.git
cd manos-que-ayudan
```

2. **Configurar el Backend**
```bash
cd backend

# Crear archivo .env basado en el ejemplo
cp .env.example .env

# Instalar dependencias
go mod download


3. **Configurar el Frontend**
```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar la aplicación ( una vez posicionado en frontend)
npm start 


4. **Configurar la Base de Datos**
busque el archivo de base de datos para importar la misma, puede tener una vacia con el esquema o una de ejemplo con datos también


## Funcionalidades Principales

### Gestión de Proyectos
- Creación y edición de proyectos
- Gestión de actividades
- Sistema de ubicación geográfica
- Control de participantes

### Sistema de Usuarios
- Registro y autenticación
- Perfiles de usuario
- Roles y permisos
- Radio de trabajo personalizable

### Reportes y Estadísticas
- Estadísticas de participación
- Histórico de actividades
- Sistema de reportes
- Feedback de usuarios

## Configuración

### Variables de Entorno Backend (.env)
```env
PORT=8080
DB_DSN="usuario:contraseña@tcp(localhost:3306)/manosqueayudan"
ENCRYPTION_KEY="tu-clave-de-encriptación"
SESSION_KEY="tu-clave-de-sesión"
CUENTA_MAIL="correo@ejemplo.com"
MAIL_KEY="clave-correo"
```

### Variables de Entorno Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8080
```

## Contribución

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE).

Proyecto Link: [https://github.com/TusUsuarios/manos-que-ayudan]