-- MySQL dump 10.13  Distrib 8.0.33, for macos13 (arm64)
--
-- Host: localhost    Database: manosqueayudan
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Actividad`
--

DROP TABLE IF EXISTS `Actividad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Actividad` (
  `NumeroActividad` int unsigned NOT NULL,
  `Nombre` longtext,
  `Descripcion` longtext,
  `Estado` tinyint(1) DEFAULT NULL,
  `ProyectoID` int unsigned NOT NULL,
  PRIMARY KEY (`NumeroActividad`,`ProyectoID`),
  KEY `fk_actividad_proyecto` (`ProyectoID`),
  CONSTRAINT `fk_actividad_proyecto` FOREIGN KEY (`ProyectoID`) REFERENCES `Proyecto` (`IdProyecto`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Denuncia`
--

DROP TABLE IF EXISTS `Denuncia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Denuncia` (
  `IdDenuncia` int unsigned NOT NULL AUTO_INCREMENT,
  `Fecha` datetime(3) DEFAULT NULL,
  `Descripcion` text NOT NULL,
  `Habilitado` tinyint(1) NOT NULL DEFAULT '1',
  `IdUsuario` int unsigned DEFAULT NULL,
  `Estado` enum('Pendiente','En Revisión','Resuelta','Desestimada') NOT NULL DEFAULT 'Pendiente',
  `TipoDenuncia` enum('Usuario','Proyecto') NOT NULL,
  PRIMARY KEY (`IdDenuncia`),
  KEY `fk_Denuncia_Usuario` (`IdUsuario`),
  CONSTRAINT `fk_Denuncia_Usuario` FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Denuncia_Proyecto`
--

DROP TABLE IF EXISTS `Denuncia_Proyecto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Denuncia_Proyecto` (
  `IdDenuncia` int unsigned NOT NULL,
  `ProyectoDenunciado` int unsigned NOT NULL,
  PRIMARY KEY (`IdDenuncia`,`ProyectoDenunciado`),
  KEY `fk_Denuncia_Proyecto_Proyecto` (`ProyectoDenunciado`),
  CONSTRAINT `fk_Denuncia_Proyecto_Denuncia` FOREIGN KEY (`IdDenuncia`) REFERENCES `Denuncia` (`IdDenuncia`),
  CONSTRAINT `fk_Denuncia_Proyecto_Proyecto` FOREIGN KEY (`ProyectoDenunciado`) REFERENCES `Proyecto` (`IdProyecto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Denuncia_Usuario`
--

DROP TABLE IF EXISTS `Denuncia_Usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Denuncia_Usuario` (
  `IdDenuncia` int unsigned NOT NULL,
  `UsuarioDenunciado` int unsigned NOT NULL,
  PRIMARY KEY (`IdDenuncia`,`UsuarioDenunciado`),
  KEY `fk_Denuncia_Usuario_Usuario` (`UsuarioDenunciado`),
  CONSTRAINT `fk_Denuncia_Usuario_Denuncia` FOREIGN KEY (`IdDenuncia`) REFERENCES `Denuncia` (`IdDenuncia`),
  CONSTRAINT `fk_Denuncia_Usuario_Usuario` FOREIGN KEY (`UsuarioDenunciado`) REFERENCES `Usuario` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `denuncia_usuarios`
--

DROP TABLE IF EXISTS `denuncia_usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `denuncia_usuarios` (
  `id_denuncia` int unsigned NOT NULL,
  `usuario_denunciado` int unsigned NOT NULL,
  PRIMARY KEY (`id_denuncia`,`usuario_denunciado`),
  KEY `fk_denuncia_usuarios_usuario` (`usuario_denunciado`),
  CONSTRAINT `fk_denuncia_usuarios_denuncia` FOREIGN KEY (`id_denuncia`) REFERENCES `Denuncia` (`IdDenuncia`),
  CONSTRAINT `fk_denuncia_usuarios_usuario` FOREIGN KEY (`usuario_denunciado`) REFERENCES `Usuario` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Feedback`
--

DROP TABLE IF EXISTS `Feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Feedback` (
  `IdFeedback` int unsigned NOT NULL AUTO_INCREMENT,
  `IdProyecto` int unsigned NOT NULL,
  `IdAutor` int unsigned NOT NULL,
  `IdDestinatario` int unsigned NOT NULL,
  `Fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `Puntuacion` int NOT NULL,
  `Descripcion` text,
  `RolAutor` int unsigned NOT NULL,
  `RolDestinatario` int unsigned NOT NULL,
  `Habilitado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdFeedback`),
  KEY `fk_Feedback_Proyecto` (`IdProyecto`),
  KEY `fk_Feedback_Autor` (`IdAutor`),
  KEY `fk_Feedback_Destinatario` (`IdDestinatario`),
  KEY `fk_Feedback_RolAutor` (`RolAutor`),
  KEY `fk_Feedback_RolDestinatario` (`RolDestinatario`),
  CONSTRAINT `fk_Feedback_Autor` FOREIGN KEY (`IdAutor`) REFERENCES `Usuario` (`Id`),
  CONSTRAINT `fk_Feedback_Destinatario` FOREIGN KEY (`IdDestinatario`) REFERENCES `Usuario` (`Id`),
  CONSTRAINT `fk_Feedback_Proyecto` FOREIGN KEY (`IdProyecto`) REFERENCES `Proyecto` (`IdProyecto`),
  CONSTRAINT `fk_Feedback_RolAutor` FOREIGN KEY (`RolAutor`) REFERENCES `Rol_Proyecto` (`IdRol`),
  CONSTRAINT `fk_Feedback_RolDestinatario` FOREIGN KEY (`RolDestinatario`) REFERENCES `Rol_Proyecto` (`IdRol`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Habilidad`
--

DROP TABLE IF EXISTS `Habilidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Habilidad` (
  `IdHabilidades` int unsigned NOT NULL AUTO_INCREMENT,
  `Nombre` longtext,
  `Descripcion` longtext,
  PRIMARY KEY (`IdHabilidades`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


-- ----------------------------
-- Records of habilidad
-- ----------------------------
INSERT INTO `habilidad` VALUES (1, 'Cocinar', 'cocinar');
INSERT INTO `habilidad` VALUES (2, 'Pintar', 'Pintar');
INSERT INTO `habilidad` VALUES (3, 'Limpiar', 'Limpiar');
INSERT INTO `habilidad` VALUES (4, 'Barrer', 'Barrer');
INSERT INTO `habilidad` VALUES (5, 'Carpinteria', 'Carpinteria');
INSERT INTO `habilidad` VALUES (6, 'Pintar', NULL);
INSERT INTO `habilidad` VALUES (7, 'Animacion Chicos', NULL);
INSERT INTO `habilidad` VALUES (8, 'Dibujar', NULL);
INSERT INTO `habilidad` VALUES (9, 'Coser', NULL);
INSERT INTO `habilidad` VALUES (10, 'Animación Adultos', NULL);
INSERT INTO `habilidad` VALUES (11, 'Enseñar primaria', NULL);
INSERT INTO `habilidad` VALUES (12, 'Enseñar Secundadria', NULL);
INSERT INTO `habilidad` VALUES (13, 'Títeres', NULL);
INSERT INTO `habilidad` VALUES (14, 'Soldadura', NULL);

--
-- Table structure for table `Habilidades`
--

DROP TABLE IF EXISTS `Habilidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Habilidades` (
  `IdHabilidades` int unsigned NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) NOT NULL,
  `Descripcion` text,
  PRIMARY KEY (`IdHabilidades`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `KickedUsers`
--

DROP TABLE IF EXISTS `KickedUsers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KickedUsers` (
  `IdProyecto` int unsigned NOT NULL,
  `IdUsuario` int unsigned NOT NULL,
  `KickedBy` int unsigned NOT NULL,
  `KickDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Reason` text,
  PRIMARY KEY (`IdProyecto`,`IdUsuario`),
  KEY `fk_kicked_users_user` (`IdUsuario`),
  KEY `fk_kicked_users_admin` (`KickedBy`),
  CONSTRAINT `fk_kicked_users_admin` FOREIGN KEY (`KickedBy`) REFERENCES `Usuario` (`Id`),
  CONSTRAINT `fk_kicked_users_project` FOREIGN KEY (`IdProyecto`) REFERENCES `Proyecto` (`IdProyecto`),
  CONSTRAINT `fk_kicked_users_user` FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacion` (
  `idNotificacion` int unsigned NOT NULL AUTO_INCREMENT,
  `Fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UsuarioNotificado` int unsigned DEFAULT NULL,
  `Descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `FechaLeido` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idNotificacion`) USING BTREE,
  KEY `fk_Notificacion_Usuario` (`UsuarioNotificado`) USING BTREE,
  CONSTRAINT `fk_Notificacion_Usuario` FOREIGN KEY (`UsuarioNotificado`) REFERENCES `usuario` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Proyecto`
--

DROP TABLE IF EXISTS `Proyecto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Proyecto` (
  `IdProyecto` int unsigned NOT NULL AUTO_INCREMENT,
  `FechaInicio` datetime(3) DEFAULT NULL,
  `Localizacion` longtext,
  `Latitud` decimal(10,8) DEFAULT NULL,
  `Longitud` decimal(11,8) DEFAULT NULL,
  `FechaFinalizacion` datetime(3) DEFAULT NULL,
  `CantidadParticipantes` bigint DEFAULT NULL,
  `Nombre` longtext,
  `Descripcion` longtext,
  `HorarioInicio` datetime(3) DEFAULT NULL,
  `HorarioFinal` datetime(3) DEFAULT NULL,
  `Habilitado` tinyint(1) NOT NULL,
  `Eliminado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`IdProyecto`),
  KEY `idx_proyecto_location` (`Latitud`,`Longitud`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Proyectos_Usuarios`
--

DROP TABLE IF EXISTS `Proyectos_Usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Proyectos_Usuarios` (
  `IdProyecto` int unsigned NOT NULL,
  `IdUsuario` int unsigned NOT NULL,
  `IdRol` int unsigned NOT NULL,
  `FechaInicio` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `FechaFin` datetime DEFAULT NULL,
  PRIMARY KEY (`IdProyecto`,`IdUsuario`,`IdRol`,`FechaInicio`),
  KEY `fk_Proyectos_Usuarios_Usuario` (`IdUsuario`),
  KEY `fk_Proyectos_Usuarios_Rol_proyecto` (`IdRol`),
  CONSTRAINT `fk_Proyectos_Usuarios_Proyecto` FOREIGN KEY (`IdProyecto`) REFERENCES `Proyecto` (`IdProyecto`),
  CONSTRAINT `fk_Proyectos_Usuarios_Rol_proyecto` FOREIGN KEY (`IdRol`) REFERENCES `Rol_proyecto` (`IdRol`),
  CONSTRAINT `fk_Proyectos_Usuarios_Usuario` FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Rol_Proyecto`
--

DROP TABLE IF EXISTS `Rol_Proyecto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Rol_Proyecto` (
  `IdRol` int unsigned NOT NULL AUTO_INCREMENT,
  `Nombre` longtext,
  `Descripcion` longtext,
  `FechaInicioRol` datetime(3) DEFAULT NULL,
  `FechaFinRol` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`IdRol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- ----------------------------
-- Records of rol_proyecto
-- ----------------------------
INSERT INTO `rol_proyecto` VALUES (1, 'Administrador', 'Administrador del proyecto con todos los permisos', NULL, NULL);
INSERT INTO `rol_proyecto` VALUES (2, 'Participante', 'Participante regular del proyecto', NULL, NULL);

--
-- Table structure for table `Rol_Sistema`
--

DROP TABLE IF EXISTS `Rol_Sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Rol_Sistema` (
  `IdRol` int unsigned NOT NULL AUTO_INCREMENT,
  `Descripcion` varchar(255) NOT NULL,
  `Titulo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`IdRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `schema_migrations`
--

DROP TABLE IF EXISTS `schema_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schema_migrations` (
  `version` bigint NOT NULL,
  `dirty` tinyint(1) NOT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Usuario`
--

DROP TABLE IF EXISTS `Usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuario` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `Nombre` longtext,
  `Apellido` longtext,
  `Email` longtext,
  `Password` longtext,
  `Activo` tinyint(1) DEFAULT NULL,
  `EncryptedLocalizacion` text,
  `RadioTrabajo` bigint DEFAULT NULL,
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `deleted_at` datetime(3) DEFAULT NULL,
  `CreatedAt` datetime(3) DEFAULT NULL,
  `UpdatedAt` datetime(3) DEFAULT NULL,
  `DeletedAt` datetime(3) DEFAULT NULL,
  `EncryptedLatitud` text,
  `EncryptedLongitud` text,
  `Pais` text,
  `HorarioInicio` datetime(3) DEFAULT NULL,
  `HorarioFinal` datetime(3) DEFAULT NULL,
  `Eliminado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `idx_Usuario_deleted_at` (`DeletedAt`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuario_habilidades`
--

DROP TABLE IF EXISTS `usuario_habilidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_habilidades` (
  `habilidad_id` int unsigned NOT NULL,
  `usuario_id` int unsigned NOT NULL,
  PRIMARY KEY (`habilidad_id`,`usuario_id`) USING BTREE,
  KEY `fk_usuario_habilidades_usuario` (`usuario_id`) USING BTREE,
  CONSTRAINT `fk_usuario_habilidades_habilidad` FOREIGN KEY (`habilidad_id`) REFERENCES `habilidad` (`IdHabilidades`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_usuario_habilidades_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `UsuarioHabilidades`
--

DROP TABLE IF EXISTS `UsuarioHabilidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UsuarioHabilidades` (
  `IdUsuario` int unsigned NOT NULL,
  `IdHabilidad` int unsigned NOT NULL,
  PRIMARY KEY (`IdUsuario`,`IdHabilidad`),
  KEY `fk_UsuarioHabilidades_Habilidades` (`IdHabilidad`),
  CONSTRAINT `fk_UsuarioHabilidades_Habilidades` FOREIGN KEY (`IdHabilidad`) REFERENCES `Habilidades` (`IdHabilidades`),
  CONSTRAINT `fk_UsuarioHabilidades_Usuario` FOREIGN KEY (`IdUsuario`) REFERENCES `Usuario` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-04 19:18:26
