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
-- Dumping data for table `Actividad`
--

LOCK TABLES `Actividad` WRITE;
/*!40000 ALTER TABLE `Actividad` DISABLE KEYS */;
INSERT INTO `Actividad` VALUES (1,'fdasfadsdfa','',0,5),(1,'ewqeqw','',1,6),(1,'wqeqw','',0,9);
/*!40000 ALTER TABLE `Actividad` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Denuncia`
--

LOCK TABLES `Denuncia` WRITE;
/*!40000 ALTER TABLE `Denuncia` DISABLE KEYS */;
INSERT INTO `Denuncia` VALUES (1,'2024-11-25 16:56:01.043','algo',1,6,'Pendiente','Usuario'),(2,'2024-11-25 16:56:13.690','algo2',1,6,'Pendiente','Usuario'),(3,'2024-11-25 17:04:32.720','una denuncia',1,6,'Pendiente','Usuario'),(4,'2024-11-25 17:04:40.467','otra denuncia',1,6,'Pendiente','Usuario');
/*!40000 ALTER TABLE `Denuncia` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `Denuncia_Proyecto`
--

LOCK TABLES `Denuncia_Proyecto` WRITE;
/*!40000 ALTER TABLE `Denuncia_Proyecto` DISABLE KEYS */;
INSERT INTO `Denuncia_Proyecto` VALUES (4,5),(3,6);
/*!40000 ALTER TABLE `Denuncia_Proyecto` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `Denuncia_Usuario`
--

LOCK TABLES `Denuncia_Usuario` WRITE;
/*!40000 ALTER TABLE `Denuncia_Usuario` DISABLE KEYS */;
INSERT INTO `Denuncia_Usuario` VALUES (1,13),(2,13);
/*!40000 ALTER TABLE `Denuncia_Usuario` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `denuncia_usuarios`
--

LOCK TABLES `denuncia_usuarios` WRITE;
/*!40000 ALTER TABLE `denuncia_usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `denuncia_usuarios` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Feedback`
--

LOCK TABLES `Feedback` WRITE;
/*!40000 ALTER TABLE `Feedback` DISABLE KEYS */;
INSERT INTO `Feedback` VALUES (1,5,13,6,'2024-11-25 14:29:45',5,'fadsf',2,1,1),(2,6,6,13,'2024-12-01 19:41:05',5,'es un crack!',2,1,1),(3,6,13,6,'2024-12-01 19:41:41',5,'es otro crack!',1,2,1);
/*!40000 ALTER TABLE `Feedback` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Habilidad`
--

LOCK TABLES `Habilidad` WRITE;
/*!40000 ALTER TABLE `Habilidad` DISABLE KEYS */;
/*!40000 ALTER TABLE `Habilidad` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `Habilidades`
--

LOCK TABLES `Habilidades` WRITE;
/*!40000 ALTER TABLE `Habilidades` DISABLE KEYS */;
/*!40000 ALTER TABLE `Habilidades` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `KickedUsers`
--

LOCK TABLES `KickedUsers` WRITE;
/*!40000 ALTER TABLE `KickedUsers` DISABLE KEYS */;
INSERT INTO `KickedUsers` VALUES (5,13,6,'2024-11-25 20:14:39','sdfs');
/*!40000 ALTER TABLE `KickedUsers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacion` (
  `idNotificacion` int unsigned NOT NULL AUTO_INCREMENT,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UsuarioNotificado` int unsigned DEFAULT NULL,
  `Descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `FechaLeido` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idNotificacion`) USING BTREE,
  KEY `fk_Notificacion_Usuario` (`UsuarioNotificado`) USING BTREE,
  CONSTRAINT `fk_Notificacion_Usuario` FOREIGN KEY (`UsuarioNotificado`) REFERENCES `usuario` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
INSERT INTO `notificacion` VALUES (1,'2024-11-10 03:00:00',6,'Notif1','2024-11-26 23:25:14'),(2,'2024-11-20 03:00:00',12,'Notif2',NULL);
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Proyecto`
--

LOCK TABLES `Proyecto` WRITE;
/*!40000 ALTER TABLE `Proyecto` DISABLE KEYS */;
INSERT INTO `Proyecto` VALUES (3,'2024-10-24 00:00:00.000','Neuquen',0.00000000,0.00000000,'2024-12-09 00:00:00.000',1,'Un Proyecto','asdfsdfa','2024-10-24 17:44:00.000','2024-10-24 20:53:00.000',1,0),(4,'2024-10-20 21:00:00.000','Neuquen',NULL,NULL,'2024-10-21 21:00:00.000',1,'Toma de la facultad','toma vigilia actica','1970-01-01 13:16:00.000',NULL,1,0),(5,'2024-11-08 00:00:00.000','Avenida Corrientes, Microcentro, San Nicolás, Buenos Aires, Comuna 1, Autonomous City of Buenos Aires, C1010, Argentina',-34.60382392,-58.38186264,'2025-12-08 00:00:00.000',1,'otro proyecto','fdasfd','2024-11-08 18:06:00.000','2024-11-08 20:08:00.000',1,0),(6,'2024-11-23 00:00:00.000','997, Tucumán, Microcentro, San Nicolás, Buenos Aires, Comuna 1, Autonomous City of Buenos Aires, C1043AAA, Argentina',-34.60128058,-58.38091850,'2024-11-27 00:00:00.000',1,'un proyecto cualquiera','esta bueno el proyecto','2024-11-23 17:57:00.000','2024-11-23 19:57:00.000',1,0),(7,'2024-11-24 00:00:00.000','1101, Avenida Corrientes, Microcentro, San Nicolás, Buenos Aires, Comuna 1, Autonomous City of Buenos Aires, C1043AAL, Argentina',-34.60368262,-58.38237762,'2025-11-24 00:00:00.000',1,'el mejor proyecto','una descripción acorde','2024-11-24 16:17:00.000','2024-11-24 19:18:00.000',1,0),(8,'2024-12-01 00:00:00.000','784, Adolfo Alsina, Monserrat, Buenos Aires, Comuna 1, Autonomous City of Buenos Aires, C1069AAE, Argentina',-34.61053217,-58.37734199,'2025-02-10 00:00:00.000',1,'un proyecto','adfdsa','2024-12-01 20:32:00.000','2024-12-01 12:31:00.000',1,0),(9,'2024-12-08 00:00:00.000','Obelisco Center Suites, Avenida Presidente Roque Sáenz Peña, Microcentro, San Nicolás, Buenos Aires, Comuna 1, Autonomous City of Buenos Aires, 1035, Argentina',-34.60400691,-58.38054658,'2024-12-17 00:00:00.000',1,'gfsdgfd','gfsdgsfd','2024-12-08 22:37:00.000','2024-12-08 12:40:00.000',0,0);
/*!40000 ALTER TABLE `Proyecto` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `Proyectos_Usuarios`
--

LOCK TABLES `Proyectos_Usuarios` WRITE;
/*!40000 ALTER TABLE `Proyectos_Usuarios` DISABLE KEYS */;
INSERT INTO `Proyectos_Usuarios` VALUES (5,6,1,'2024-11-11 19:46:53',NULL),(5,13,2,'2024-11-11 20:42:50','2024-11-25 20:14:08'),(5,13,2,'2024-11-25 20:14:15','2024-11-25 20:14:39'),(5,14,2,'2024-11-26 18:22:37','2024-11-26 19:18:19'),(5,14,2,'2024-11-26 19:18:23',NULL),(6,6,2,'2024-11-26 16:17:12','2024-11-26 17:31:24'),(6,6,2,'2024-11-26 17:31:28',NULL),(6,13,1,'2024-11-25 16:57:59',NULL),(7,6,1,'2024-11-26 16:18:14',NULL),(8,6,1,'2024-12-01 20:32:17',NULL),(9,6,1,'2024-12-01 20:38:08',NULL);
/*!40000 ALTER TABLE `Proyectos_Usuarios` ENABLE KEYS */;
UNLOCK TABLES;

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

--
-- Dumping data for table `Rol_Proyecto`
--

LOCK TABLES `Rol_Proyecto` WRITE;
/*!40000 ALTER TABLE `Rol_Proyecto` DISABLE KEYS */;
INSERT INTO `Rol_Proyecto` VALUES (1,'Administrador','Administrador del proyecto con todos los permisos',NULL,NULL),(2,'Participante','Participante regular del proyecto',NULL,NULL);
/*!40000 ALTER TABLE `Rol_Proyecto` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `Rol_Sistema`
--

LOCK TABLES `Rol_Sistema` WRITE;
/*!40000 ALTER TABLE `Rol_Sistema` DISABLE KEYS */;
/*!40000 ALTER TABLE `Rol_Sistema` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `schema_migrations`
--

LOCK TABLES `schema_migrations` WRITE;
/*!40000 ALTER TABLE `schema_migrations` DISABLE KEYS */;
INSERT INTO `schema_migrations` VALUES (1,0);
/*!40000 ALTER TABLE `schema_migrations` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `Usuario`
--

LOCK TABLES `Usuario` WRITE;
/*!40000 ALTER TABLE `Usuario` DISABLE KEYS */;
INSERT INTO `Usuario` VALUES (6,'manu','nagel','juanmanage@gmail.com','$2a$10$3u7hEx2CF8ovWjLpUwEPku4bQ3MP33x5josBPIAqGbs9L./I3.lb6',0,'F9HQ97Z3l1MpXs7UauhFyiwoLNUtlQD+OSoXri3vqYqSNwQC4bgcxxGGcIGmQO8YBXAt+WtQIv+QX5hJ2af9mU0os9WS/PfkSteqXPlapECe2DCzEPmaH4YmDtMDyoDK+D0tFTeD2jRCl9S8gzY4zyA1sxiz5jPD4lZrCmEAlq3i4IhsfvyVsE4V5anUpoep9/602PWZHVzyskw=',2,'2024-10-07 19:58:06.243','2024-11-11 19:47:17.884',NULL,'2024-10-07 19:58:06.243','2024-11-11 19:47:17.884',NULL,'j5e474k0cMFKJKlH8lk+4Lqpt0g/Ech4XihzUpD1UIP1HGxA4OiKWoPO','UruhjrZJiRir+QyM8CbgeuDuaV4tj3EF+S5jj02UnOCvVDd+glWpmkW3','AR',NULL,NULL,0),(7,'juan','nagel','manu_nael@outlook.com','$2a$10$eBOkiLAj27Q1njh/My3Fxe1C8TAL.8xEQP5uYmzm4kA/ygY7Xo6G2',0,NULL,0,'2024-10-09 15:55:26.761','2024-10-09 15:55:26.761',NULL,'2024-10-09 15:55:26.760','2024-10-09 15:55:26.760',NULL,NULL,NULL,NULL,NULL,NULL,0),(8,'juan','Nagel','juan.nagel@est.fi.uncoma.edu.ar','$2a$10$DhTpxiEv4LPBiXxujqKesuE5KIRfZvytGO0cuIgnvz4W97H8DQk6S',0,NULL,0,'2024-10-09 16:19:40.499','2024-10-09 16:19:40.499',NULL,'2024-10-09 16:19:40.495','2024-10-09 16:19:40.495',NULL,NULL,NULL,NULL,NULL,NULL,0),(9,'Daniel','Dolz','ddolz@est.fi.uncoma.edu.ar','$2a$10$mWdb8pEFow1xXOrkwUBdtOFu/MB2.Vmqsxs7wWfEytRyRlE4OCCRW',0,NULL,0,'2024-10-22 19:08:09.215','2024-10-22 19:08:09.215',NULL,'2024-10-22 19:08:09.212','2024-10-22 19:08:09.212',NULL,NULL,NULL,NULL,NULL,NULL,0),(10,'dan','dolz','dan@hotmail.com','$2a$10$IONSdFkL2w359gKmfhw63er8VdWYqrp1J4/iEEBIUUUt5hSpg6B92',0,NULL,0,'2024-10-22 19:09:21.496','2024-10-22 19:09:21.496',NULL,'2024-10-22 19:09:21.495','2024-10-22 19:09:21.495',NULL,NULL,NULL,NULL,NULL,NULL,0),(11,'percy','alvarez','perc@hotmail.com','$2a$10$vkliQ2VDhRvuIp7RQeMCEu8ZGE515xnz0mZPJZfsA7utfS3BwwJsC',0,NULL,0,'2024-10-22 19:10:46.994','2024-10-22 19:10:46.994',NULL,'2024-10-22 19:10:46.995','2024-10-22 19:10:46.995',NULL,NULL,NULL,NULL,NULL,NULL,0),(12,'manu','nagel','juanmanage@gmail.com','$2a$10$KbWbVK4YQq8Z.zQqvSvelOJIzam96x7EVPylcmO8MpHBBFP16owoq',0,'csSAO4MbHO/HsD5a0rXZ6qwuVUoBEfSYbM82JE7+T0ZyVg7uHt+GWsz7m946/p8hJJS/ptxmfNiBCuCH5aSGx1DKUqicPSRcd0qtf+34rXTvShIZUphR1KqcqT1EH7x++ZEK0KfTi/3wOy7siFqkqyPdS8IDDTf8BxNjI49mcnMVitFcsZvO+rfUVIghN3AMZki4OYHoaeYoM2ru7rekSx7HaCWcJeba',4,'2024-11-02 15:21:01.567','2024-11-02 15:21:37.103',NULL,'2024-11-02 15:21:01.567','2024-11-02 15:21:37.103',NULL,'8QJGSFn0q+MKHmCSTKz16+tSEyNAKYdSyGgjmyvnzZM+SMw1U/6i2a7g','1qBEmUJYqwpmd5VBOaFPMFUwNQ1Cwy+gme6H4uTSh1h2u+TcCfkqLtLh',NULL,NULL,NULL,0),(13,'manu','nagel','juan@gmail.com','$2a$10$5rVHAaxbRV7WG18wtBbQ6.8NxNr./Fj4xvrGXw4mo9vYly0eAwaOu',0,'8cW17rb1Y7g0hwhN3Tl3OAXnnuRdfHxJhVrvthwzbtf5BRhQdoy/OwaE4Hnq+3UFnUZ7SW0lHG2j9+nY99s2o7zCvFpFP9hNpviFL+amPgXEejf9vFN1W7ULQEIO7Q2oVydYeQZxVB9ECzR+WxfKVu/OkgrB9+BDG5Zvha2HgP7NazIkrlHTPLYy9xNJEt+UUAPJBsVE2REFHkZSQ4EsC7VjDDrFK9uDUE8=',4,'2024-11-02 15:28:15.510','2024-11-11 20:42:46.773',NULL,'2024-11-02 15:28:15.510','2024-11-11 20:42:46.774',NULL,'o6Jfp1tty6ELdU4I6HuQgkd6jP4xHbzXGjqE1SNaM6O6wTE93VI9Tm+C','X+swGaYmgoRQq29OxA2TDq6YPWvnZ2nLpjgRvcV+9VQkpOyB+lE+0xhd','AR',NULL,NULL,0),(14,'jeremias','nagel','manu@outlook.com','$2a$10$3lIRga6c4pcqDp8yXhJuzOjFgc33jGUfZ2V9pa6tVjuu4YotEyAsK',0,'HoBdG4yUcEeCJMGKZKXBs6hTyj8jS+tYMa9behiRmK3TTkEFQAWohsGMHxxg03hKElAFsIMTnXgAiS45Sm0btug2t/JXRPbbLgIISIsqzvVf9bGjOIQjJi6gPeiLVx3dQlSAwX+RhbkX49zP/A8AYL+Nx3+wGTU2QUhjTzz2AeYH7GN9avbJrwC+ZnOGk2puZZIt/XvWpUzVhZ+7npt6dSPPMUxOcEr6Cx06RW0Wr38xjp0x/14=',4,'2024-11-26 18:22:17.985','2024-11-26 18:22:30.960',NULL,'2024-11-26 18:22:17.985','2024-11-26 18:22:30.960',NULL,'WM2CU9q/NfhcTBnxfeT7vKWRwE7p8zuDxrfT3ZWePI5YoEzPGgw8FfV6','QzKMKQix5RpwahPA8pbTKyhcfvw2JzuLowVloi5vTDsHP09gf/TiVFg1','',NULL,NULL,0);
/*!40000 ALTER TABLE `Usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_habilidades`
--

DROP TABLE IF EXISTS `usuario_habilidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_habilidades` (
  `habilidad_id_habilidades` int unsigned NOT NULL,
  `usuario_id` int unsigned NOT NULL,
  PRIMARY KEY (`habilidad_id_habilidades`,`usuario_id`),
  KEY `fk_usuario_habilidades_usuario` (`usuario_id`),
  CONSTRAINT `fk_usuario_habilidades_habilidad` FOREIGN KEY (`habilidad_id_habilidades`) REFERENCES `Habilidad` (`IdHabilidades`),
  CONSTRAINT `fk_usuario_habilidades_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_habilidades`
--

LOCK TABLES `usuario_habilidades` WRITE;
/*!40000 ALTER TABLE `usuario_habilidades` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_habilidades` ENABLE KEYS */;
UNLOCK TABLES;

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

--
-- Dumping data for table `UsuarioHabilidades`
--

LOCK TABLES `UsuarioHabilidades` WRITE;
/*!40000 ALTER TABLE `UsuarioHabilidades` DISABLE KEYS */;
/*!40000 ALTER TABLE `UsuarioHabilidades` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-02 10:52:07
