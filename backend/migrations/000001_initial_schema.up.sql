-- 000001_initial_schema.up.sql

-- Create Actividad table
CREATE TABLE IF NOT EXISTS `Actividad` (
  `NumeroActividad` int unsigned NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) DEFAULT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `Estado` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`NumeroActividad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Usuario table
CREATE TABLE IF NOT EXISTS `Usuario` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) DEFAULT NULL,
  `Apellido` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Activo` tinyint(1) DEFAULT NULL,
  `Ciudad` varchar(255) DEFAULT NULL,
  `RadioTrabajo` int DEFAULT NULL,
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Denuncia table
CREATE TABLE IF NOT EXISTS `Denuncia` (
  `IdDenuncia` int unsigned NOT NULL AUTO_INCREMENT,
  `Fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Descripcion` varchar(255) NOT NULL,
  `Habilitado` tinyint(1) NOT NULL,
  `IdUsuario` int unsigned DEFAULT NULL,
  `Estado` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`IdDenuncia`),
  KEY `fk_Denuncia_Usuario` (`IdUsuario`),
  CONSTRAINT `fk_Denuncia_Usuario` FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Proyecto table
CREATE TABLE IF NOT EXISTS `Proyecto` (
  `IdProyecto` int unsigned NOT NULL AUTO_INCREMENT,
  `FechaInicio` datetime DEFAULT CURRENT_TIMESTAMP,
  `Localizacion` varchar(255) DEFAULT NULL,
  `FechaFinalizacion` datetime DEFAULT NULL,
  `CantidadParticipantes` int DEFAULT NULL,
  `Nombre` varchar(255) DEFAULT NULL,
  `Descripcion` text,
  `Horario` time DEFAULT NULL,
  `Habilitado` tinyint(1) NOT NULL,
  PRIMARY KEY (`IdProyecto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Denuncia_Proyecto table
CREATE TABLE IF NOT EXISTS `Denuncia_Proyecto` (
  `IdDenuncia` int unsigned NOT NULL,
  `ProyectoDenunciado` int unsigned NOT NULL,
  PRIMARY KEY (`IdDenuncia`,`ProyectoDenunciado`),
  KEY `fk_Denuncia_Proyecto_Proyecto` (`ProyectoDenunciado`),
  CONSTRAINT `fk_Denuncia_Proyecto_Denuncia` FOREIGN KEY (`IdDenuncia`) REFERENCES `Denuncia` (`IdDenuncia`),
  CONSTRAINT `fk_Denuncia_Proyecto_Proyecto` FOREIGN KEY (`ProyectoDenunciado`) REFERENCES `Proyecto` (`IdProyecto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Denuncia_Usuario table
CREATE TABLE IF NOT EXISTS `Denuncia_Usuario` (
  `IdDenuncia` int unsigned NOT NULL,
  `UsuarioDenunciado` int unsigned NOT NULL,
  PRIMARY KEY (`IdDenuncia`,`UsuarioDenunciado`),
  KEY `fk_Denuncia_Usuario_Usuario` (`UsuarioDenunciado`),
  CONSTRAINT `fk_Denuncia_Usuario_Denuncia` FOREIGN KEY (`IdDenuncia`) REFERENCES `Denuncia` (`IdDenuncia`),
  CONSTRAINT `fk_Denuncia_Usuario_Usuario` FOREIGN KEY (`UsuarioDenunciado`) REFERENCES `Usuario` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Feedback table
CREATE TABLE IF NOT EXISTS `Feedback` (
  `IdFeedback` int unsigned NOT NULL AUTO_INCREMENT,
  `Fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `Puntuacion` int NOT NULL,
  `Descripcion` varchar(255) NOT NULL,
  `RolAutor` tinyint(1) NOT NULL,
  `RolDestinatario` tinyint(1) NOT NULL,
  `Habilitado` tinyint(1) NOT NULL,
  `Respuesta` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`IdFeedback`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Habilidades table
CREATE TABLE IF NOT EXISTS `Habilidades` (
  `IdHabilidades` int unsigned NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) NOT NULL,
  `Descripcion` text,
  PRIMARY KEY (`IdHabilidades`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Inscripcion table
CREATE TABLE IF NOT EXISTS `Inscripcion` (
  `IdInscripcion` int unsigned NOT NULL AUTO_INCREMENT,
  `FechaInscripcion` datetime DEFAULT CURRENT_TIMESTAMP,
  `FechaFinalizacion` datetime DEFAULT NULL,
  PRIMARY KEY (`IdInscripcion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Notificacion table
CREATE TABLE IF NOT EXISTS `Notificacion` (
  `idNotificacion` int unsigned NOT NULL AUTO_INCREMENT,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UsuarioNotificado` int unsigned DEFAULT NULL,
  `Descripcion` text,
  PRIMARY KEY (`idNotificacion`),
  KEY `fk_Notificacion_Usuario` (`UsuarioNotificado`),
  CONSTRAINT `fk_Notificacion_Usuario` FOREIGN KEY (`UsuarioNotificado`) REFERENCES `Usuario` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Rol_proyecto table
CREATE TABLE IF NOT EXISTS `Rol_proyecto` (
  `IdRol` int unsigned NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `FechaInicioRol` datetime DEFAULT CURRENT_TIMESTAMP,
  `FechaFinRol` datetime DEFAULT NULL,
  PRIMARY KEY (`IdRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Proyectos_Usuarios table
CREATE TABLE IF NOT EXISTS `Proyectos_Usuarios` (
  `IdProyecto` int unsigned NOT NULL,
  `IdUsuario` int unsigned NOT NULL,
  `IdRol` int unsigned NOT NULL,
  `FechaInicio` datetime DEFAULT CURRENT_TIMESTAMP,
  `FechaFin` datetime DEFAULT NULL,
  PRIMARY KEY (`IdProyecto`,`IdUsuario`,`IdRol`),
  KEY `fk_Proyectos_Usuarios_Usuario` (`IdUsuario`),
  KEY `fk_Proyectos_Usuarios_Rol_proyecto` (`IdRol`),
  CONSTRAINT `fk_Proyectos_Usuarios_Proyecto` FOREIGN KEY (`IdProyecto`) REFERENCES `Proyecto` (`IdProyecto`),
  CONSTRAINT `fk_Proyectos_Usuarios_Rol_proyecto` FOREIGN KEY (`IdRol`) REFERENCES `Rol_proyecto` (`IdRol`),
  CONSTRAINT `fk_Proyectos_Usuarios_Usuario` FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Rol_Sistema table
CREATE TABLE IF NOT EXISTS `Rol_Sistema` (
  `IdRol` int unsigned NOT NULL AUTO_INCREMENT,
  `Descripcion` varchar(255) NOT NULL,
  `Titulo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`IdRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create UsuarioHabilidades table
CREATE TABLE IF NOT EXISTS `UsuarioHabilidades` (
  `IdUsuario` int unsigned NOT NULL,
  `IdHabilidad` int unsigned NOT NULL,
  PRIMARY KEY (`IdUsuario`,`IdHabilidad`),
  KEY `fk_UsuarioHabilidades_Habilidades` (`IdHabilidad`),
  CONSTRAINT `fk_UsuarioHabilidades_Habilidades` FOREIGN KEY (`IdHabilidad`) REFERENCES `Habilidades` (`IdHabilidades`),
  CONSTRAINT `fk_UsuarioHabilidades_Usuario` FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

