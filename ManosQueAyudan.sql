CREATE TABLE `Proyecto` (
`IdProyecto` integer UNSIGNED NOT NULL AUTO_INCREMENT,
`FechaInicio` datetime(255) NULL DEFAULT now() ON UPDATE CURRENT_TIMESTAMP(255),
`Localizacion` varchar(255) NULL,
`FechaFinalizacion` datetime NULL ON UPDATE CURRENT_TIMESTAMP,
`CantidadParticipantes` integer(10) NULL,
`Nombre` varchar(0) NULL,
`Descripcion` varchar(0) NULL,
`Horario` time NULL,
`Habilitaddo` boolean NOT NULL,
PRIMARY KEY (`IdProyecto`) 
);
CREATE TABLE `Usuario` (
`IdUsuario` integer(255) UNSIGNED NOT NULL AUTO_INCREMENT,
`Nombre` varchar(255) NULL,
`Apellido` varchar(255) NULL,
`Email` varchar(255) NULL,
`Password` varchar(255) NULL,
`Activo` boolean NULL,
`Ciudad` varchar(255) NULL,
`RadioTrabajo` integer NULL,
PRIMARY KEY (`IdUsuario`) 
);
CREATE TABLE `Denuncia` (
`IdDenuncia` integer(255) UNSIGNED NOT NULL AUTO_INCREMENT,
`Fecha` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
`Descripción` varchar(255) NOT NULL,
`Habilitado` boolean NOT NULL,
`IdUsuario` integer NULL,
`Estado` varchar(0) NULL,
PRIMARY KEY (`IdDenuncia`) 
);
CREATE TABLE `denuncia_Proyecto` (
);
CREATE TABLE `denuncia_usuario` (
);
CREATE TABLE `Habilidades` (
`IdHabilidades` integer(255) UNSIGNED NOT NULL AUTO_INCREMENT,
`Nombre` varchar(255) NOT NULL,
`Descripción` varchar(0) NULL,
PRIMARY KEY (`IdHabilidades`) 
);
CREATE TABLE `Actividad` (
`NumeroActividad` integer(10) UNSIGNED NOT NULL AUTO_INCREMENT,
`Nombre` varchar(255) NULL,
`Descripcion` varchar(255) NULL,
`Estado` boolean NULL
);
CREATE TABLE `Feedback` (
`IdFeedback` integer(255) UNSIGNED NOT NULL AUTO_INCREMENT,
`Fecha` datetime(255) NOT NULL ON UPDATE CURRENT_TIMESTAMP(255),
`Puntuacion` integer(2) NOT NULL,
`Descripcion` varchar(255) NOT NULL,
`RolAutor` boolean NOT NULL,
`RolDestinatario` boolean NOT NULL,
`Habilitado` boolean NOT NULL,
`Respuesta` varchar(255) NULL,
PRIMARY KEY (`IdFeedback`) 
);
CREATE TABLE `Rol_proyecto` (
`IdRol` integer UNSIGNED NOT NULL AUTO_INCREMENT,
`Nombre` varchar(255) NOT NULL,
`Descripcion` varchar(255) NULL,
`FechaInicioRol` datetime(255) NOT NULL ON UPDATE CURRENT_TIMESTAMP(255),
`FechaFinRol` datetime(255) NULL ON UPDATE CURRENT_TIMESTAMP(255),
PRIMARY KEY (`IdRol`) 
);
CREATE TABLE `Rol_Sistema` (
`IdRol` integer UNSIGNED NOT NULL AUTO_INCREMENT,
`Descripcion` varchar(0) NOT NULL,
`Titulo` varchar(0) NULL,
PRIMARY KEY (`IdRol`) 
);
CREATE TABLE `Proyectos_Usuarios` (
`IdProyecto` integer UNSIGNED NOT NULL AUTO_INCREMENT,
`IdUsuario` integer(255) NOT NULL,
`IdRol` integer(255) NOT NULL,
`FechaInicio` datetime(255) NOT NULL ON UPDATE CURRENT_TIMESTAMP(255),
`FechaFin` datetime(255) NULL ON UPDATE CURRENT_TIMESTAMP(255)
);
CREATE TABLE `Denuncia_Usuario` (
`UsuarioDeunciado` integer NOT NULL
);
CREATE TABLE `UsuarioHabilidaddes` (
`IdUsuario` integer(255) NOT NULL,
`IdHabilidad` integer(255) NOT NULL
);
CREATE TABLE `Log` (
);
CREATE TABLE `Menu` (
);
CREATE TABLE `Notificacion` (
`idNotificacion` integer UNSIGNED NOT NULL AUTO_INCREMENT,
`fecha` timestamp NOT NULL DEFAULT now() ON UPDATE CURRENT_TIMESTAMP,
`UsuarioNotificado` integer NULL,
`Descripcion` varchar(0) NULL,
PRIMARY KEY (`idNotificacion`) 
);
CREATE TABLE `Denuncia_Proyecto` (
`ProyectoDenunciado` integer NOT NULL
);
CREATE TABLE `Inscripcion` (
`IdInscripcion` int UNSIGNED NOT NULL AUTO_INCREMENT,
`FechaInscripcion` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
`FechaFinalizacion` datetime NULL ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`IdInscripcion`) 
);

ALTER TABLE `Proyectos_Usuarios` ADD CONSTRAINT `fk_Proyectos_Usuarios_Proyecto_1` FOREIGN KEY (`IdProyecto`) REFERENCES `Proyecto` (`IdProyecto`);
ALTER TABLE `Proyectos_Usuarios` ADD CONSTRAINT `fk_Proyectos_Usuarios_Usuario_1` FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`IdUsuario`);
ALTER TABLE `Proyectos_Usuarios` ADD CONSTRAINT `fk_Proyectos_Usuarios_Rol_proyecto_1` FOREIGN KEY (`IdRol`) REFERENCES `Rol_proyecto` (`IdRol`);
ALTER TABLE `Denuncia_Usuario` ADD CONSTRAINT `fk_Denuncia_Usuario_Usuario_1` FOREIGN KEY (`UsuarioDeunciado`) REFERENCES `Usuario` (`IdUsuario`);
ALTER TABLE `Habilidades` ADD CONSTRAINT `fk_Habilidades_UsuarioHabilidaddes_1` FOREIGN KEY (`IdHabilidades`) REFERENCES `UsuarioHabilidaddes` (`IdHabilidad`);
ALTER TABLE `UsuarioHabilidaddes` ADD CONSTRAINT `fk_UsuarioHabilidaddes_Usuario_1` FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`IdUsuario`);
ALTER TABLE `Actividad` ADD CONSTRAINT `fk_Actividad_Proyecto_1` FOREIGN KEY (`Descripcion`) REFERENCES `Proyecto` (`IdProyecto`);
ALTER TABLE `Denuncia` ADD CONSTRAINT `fk_Denuncia_Usuario_1` FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`IdUsuario`);

