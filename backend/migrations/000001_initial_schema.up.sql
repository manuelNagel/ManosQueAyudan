-- 000001_initial_schema.up.sql

-- Create Proyecto table
CREATE TABLE IF NOT EXISTS `Proyecto` (
    `IdProyecto` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `FechaInicio` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `Localizacion` VARCHAR(255),
    `FechaFinalizacion` DATETIME,
    `CantidadParticipantes` INTEGER,
    `Nombre` VARCHAR(255),
    `Descripcion` TEXT,
    `Horario` TIME,
    `Habilitaddo` BOOLEAN NOT NULL,
    PRIMARY KEY (`IdProyecto`)
);

-- Create Usuario table
CREATE TABLE IF NOT EXISTS `Usuario` (
    `IdUsuario` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(255),
    `Apellido` VARCHAR(255),
    `Email` VARCHAR(255),
    `Password` VARCHAR(255),
    `Activo` BOOLEAN,
    `Ciudad` VARCHAR(255),
    `RadioTrabajo` INTEGER,
    PRIMARY KEY (`IdUsuario`)
);

-- Create Denuncia table
CREATE TABLE IF NOT EXISTS `Denuncia` (
    `IdDenuncia` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `Fecha` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `Descripcion` VARCHAR(255) NOT NULL,
    `Habilitado` BOOLEAN NOT NULL,
    `IdUsuario` INTEGER,
    `Estado` VARCHAR(255),
    PRIMARY KEY (`IdDenuncia`)
);

-- Create Habilidades table
CREATE TABLE IF NOT EXISTS `Habilidades` (
    `IdHabilidades` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(255) NOT NULL,
    `Descripcion` TEXT,
    PRIMARY KEY (`IdHabilidades`)
);

-- Create Actividad table
CREATE TABLE IF NOT EXISTS `Actividad` (
    `NumeroActividad` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(255),
    `Descripcion` VARCHAR(255),
    `Estado` BOOLEAN,
    PRIMARY KEY (`NumeroActividad`)
);

-- Create Feedback table
CREATE TABLE IF NOT EXISTS `Feedback` (
    `IdFeedback` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `Fecha` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `Puntuacion` INTEGER NOT NULL,
    `Descripcion` VARCHAR(255) NOT NULL,
    `RolAutor` BOOLEAN NOT NULL,
    `RolDestinatario` BOOLEAN NOT NULL,
    `Habilitado` BOOLEAN NOT NULL,
    `Respuesta` VARCHAR(255),
    PRIMARY KEY (`IdFeedback`)
);

-- Create Rol_proyecto table
CREATE TABLE IF NOT EXISTS `Rol_proyecto` (
    `IdRol` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(255) NOT NULL,
    `Descripcion` VARCHAR(255),
    `FechaInicioRol` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `FechaFinRol` DATETIME,
    PRIMARY KEY (`IdRol`)
);

-- Create Rol_Sistema table
CREATE TABLE IF NOT EXISTS `Rol_Sistema` (
    `IdRol` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `Descripcion` TEXT NOT NULL,
    `Titulo` VARCHAR(255),
    PRIMARY KEY (`IdRol`)
);

-- Create Proyectos_Usuarios table
CREATE TABLE IF NOT EXISTS `Proyectos_Usuarios` (
    `IdProyecto` INTEGER UNSIGNED NOT NULL,
    `IdUsuario` INTEGER NOT NULL,
    `IdRol` INTEGER NOT NULL,
    `FechaInicio` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `FechaFin` DATETIME,
    PRIMARY KEY (`IdProyecto`, `IdUsuario`, `IdRol`),
    FOREIGN KEY (`IdProyecto`) REFERENCES `Proyecto` (`IdProyecto`),
    FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`IdUsuario`),
    FOREIGN KEY (`IdRol`) REFERENCES `Rol_proyecto` (`IdRol`)
);

-- Create Denuncia_Usuario table
CREATE TABLE IF NOT EXISTS `Denuncia_Usuario` (
    `UsuarioDeunciado` INTEGER NOT NULL,
    FOREIGN KEY (`UsuarioDeunciado`) REFERENCES `Usuario` (`IdUsuario`)
);

-- Create UsuarioHabilidades table
CREATE TABLE IF NOT EXISTS `UsuarioHabilidades` (
    `IdUsuario` INTEGER NOT NULL,
    `IdHabilidad` INTEGER NOT NULL,
    PRIMARY KEY (`IdUsuario`, `IdHabilidad`),
    FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`IdUsuario`),
    FOREIGN KEY (`IdHabilidad`) REFERENCES `Habilidades` (`IdHabilidades`)
);

-- Create Notificacion table
CREATE TABLE IF NOT EXISTS `Notificacion` (
    `idNotificacion` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `UsuarioNotificado` INTEGER,
    `Descripcion` TEXT,
    PRIMARY KEY (`idNotificacion`)
);

-- Create Denuncia_Proyecto table
CREATE TABLE IF NOT EXISTS `Denuncia_Proyecto` (
    `ProyectoDenunciado` INTEGER NOT NULL,
    FOREIGN KEY (`ProyectoDenunciado`) REFERENCES `Proyecto` (`IdProyecto`)
);

-- Create Inscripcion table
CREATE TABLE IF NOT EXISTS `Inscripcion` (
    `IdInscripcion` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `FechaInscripcion` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `FechaFinalizacion` DATETIME,
    PRIMARY KEY (`IdInscripcion`)
);