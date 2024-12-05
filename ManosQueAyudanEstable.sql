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
-- Table structure for table `actividad`
--

DROP TABLE IF EXISTS `actividad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actividad` (
  `NumeroActividad` int unsigned NOT NULL,
  `Nombre` longtext,
  `Descripcion` longtext,
  `Estado` tinyint(1) DEFAULT NULL,
  `ProyectoID` int unsigned NOT NULL,
  PRIMARY KEY (`NumeroActividad`,`ProyectoID`),
  KEY `fk_actividad_proyecto` (`ProyectoID`),
  CONSTRAINT `fk_actividad_proyecto` FOREIGN KEY (`ProyectoID`) REFERENCES `proyecto` (`IdProyecto`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividad`
--

LOCK TABLES `actividad` WRITE;
/*!40000 ALTER TABLE `actividad` DISABLE KEYS */;
INSERT INTO `actividad` VALUES (1,'Limpieza de Salon','Limpiar el Salon para la actividad con los abuelos',0,13),(1,'Reparar Bancos','Cambiar o colocar maderas nuevas enlos bancos que esten rotos o muy danados.',2,14),(1,'Barrer El frente','Barrido del frente de la escuela',2,15),(1,'Buscar la Hidrolavadora','Algún integrante tiene que conseguir una hidrolavadora',2,16),(2,'Decoración del Salon','Decorar el salón para recibir a nuestros invitados',0,13),(2,'Pintar Bancos','Pintar los bancos de la plaza con esmalte sintético',1,14),(2,'Limpieza de la frachada','Limpiar la fachada, primero en seco. Despues con agua y por último con removedores de pintura para sacar los grafittis.',2,15),(2,'Conseguir permiso para acceso al agua','Algún integrante tiene que conseguir un permiso del placero para tener acceso a una llave de agua',1,16),(3,'Preparar la merienda','En la cocina, cortar y distribuir los alimentos en bandejas. Preparar el té, café y el maté para los abuelos',0,13),(3,'Pintar Rejas','Lijar y pintar las rejas de la plaza.',1,14),(3,'Pintar Fachada','Pintar de color Blanco la fachada de la escuela, para que quede como estaba originalmente.',2,15),(3,'Limpiar Grafitis','Usar la hidrolavadora para limpiar los grafitis',0,16),(4,'Limpiar y ordenar el Salón','Una vez terminada la actividad, limpiar el salón, lavar las cosas que se hayan utilizado y dejar todo limpio y ordenado',0,13),(4,'Mejorar el verde del parque','Arrancar los yuyos. Cortar el pasto y recortar los arbustos.',0,14),(5,'Plantar arboles','Hacer una pequeña excavación para plantar los 10 arboles que fueron donados',0,14);
/*!40000 ALTER TABLE `actividad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `denuncia`
--

DROP TABLE IF EXISTS `denuncia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `denuncia` (
  `IdDenuncia` int unsigned NOT NULL AUTO_INCREMENT,
  `Fecha` datetime(3) DEFAULT NULL,
  `Descripcion` text NOT NULL,
  `Habilitado` tinyint(1) NOT NULL DEFAULT '1',
  `IdUsuario` int unsigned DEFAULT NULL,
  `Estado` enum('Pendiente','En Revisión','Resuelta','Desestimada') NOT NULL DEFAULT 'Pendiente',
  `TipoDenuncia` enum('Usuario','Proyecto') NOT NULL,
  PRIMARY KEY (`IdDenuncia`),
  KEY `fk_Denuncia_Usuario` (`IdUsuario`),
  CONSTRAINT `fk_Denuncia_Usuario` FOREIGN KEY (`IdUsuario`) REFERENCES `usuario` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `denuncia`
--

LOCK TABLES `denuncia` WRITE;
/*!40000 ALTER TABLE `denuncia` DISABLE KEYS */;
INSERT INTO `denuncia` VALUES (6,'2024-12-04 23:33:57.182','No es adecuado el titulo\n',1,15,'Pendiente','Usuario');
/*!40000 ALTER TABLE `denuncia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `denuncia_proyecto`
--

DROP TABLE IF EXISTS `denuncia_proyecto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `denuncia_proyecto` (
  `IdDenuncia` int unsigned NOT NULL,
  `ProyectoDenunciado` int unsigned NOT NULL,
  PRIMARY KEY (`IdDenuncia`,`ProyectoDenunciado`),
  KEY `fk_Denuncia_Proyecto_Proyecto` (`ProyectoDenunciado`),
  CONSTRAINT `fk_Denuncia_Proyecto_Denuncia` FOREIGN KEY (`IdDenuncia`) REFERENCES `denuncia` (`IdDenuncia`),
  CONSTRAINT `fk_Denuncia_Proyecto_Proyecto` FOREIGN KEY (`ProyectoDenunciado`) REFERENCES `proyecto` (`IdProyecto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `denuncia_proyecto`
--

LOCK TABLES `denuncia_proyecto` WRITE;
/*!40000 ALTER TABLE `denuncia_proyecto` DISABLE KEYS */;
INSERT INTO `denuncia_proyecto` VALUES (6,14);
/*!40000 ALTER TABLE `denuncia_proyecto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `denuncia_usuario`
--

DROP TABLE IF EXISTS `denuncia_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `denuncia_usuario` (
  `IdDenuncia` int unsigned NOT NULL,
  `UsuarioDenunciado` int unsigned NOT NULL,
  PRIMARY KEY (`IdDenuncia`,`UsuarioDenunciado`),
  KEY `fk_Denuncia_Usuario_Usuario` (`UsuarioDenunciado`),
  CONSTRAINT `fk_Denuncia_Usuario_Denuncia` FOREIGN KEY (`IdDenuncia`) REFERENCES `denuncia` (`IdDenuncia`),
  CONSTRAINT `fk_Denuncia_Usuario_Usuario` FOREIGN KEY (`UsuarioDenunciado`) REFERENCES `usuario` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `denuncia_usuario`
--

LOCK TABLES `denuncia_usuario` WRITE;
/*!40000 ALTER TABLE `denuncia_usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `denuncia_usuario` ENABLE KEYS */;
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
  CONSTRAINT `fk_denuncia_usuarios_denuncia` FOREIGN KEY (`id_denuncia`) REFERENCES `denuncia` (`IdDenuncia`),
  CONSTRAINT `fk_denuncia_usuarios_usuario` FOREIGN KEY (`usuario_denunciado`) REFERENCES `usuario` (`Id`)
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
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
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
  CONSTRAINT `fk_Feedback_Autor` FOREIGN KEY (`IdAutor`) REFERENCES `usuario` (`Id`),
  CONSTRAINT `fk_Feedback_Destinatario` FOREIGN KEY (`IdDestinatario`) REFERENCES `usuario` (`Id`),
  CONSTRAINT `fk_Feedback_Proyecto` FOREIGN KEY (`IdProyecto`) REFERENCES `proyecto` (`IdProyecto`),
  CONSTRAINT `fk_Feedback_RolAutor` FOREIGN KEY (`RolAutor`) REFERENCES `rol_proyecto` (`IdRol`),
  CONSTRAINT `fk_Feedback_RolDestinatario` FOREIGN KEY (`RolDestinatario`) REFERENCES `rol_proyecto` (`IdRol`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (5,15,17,16,'2024-12-04 21:31:57',5,'Muy buena  Predisposición, Siempre con una sonrisa.',2,1,1),(6,15,17,15,'2024-12-04 21:32:24',4,'Medio distante, pero muy colaborador. Muy atento  a que a nadie le falte nada para hacer su tarea.',2,2,1),(7,15,15,17,'2024-12-04 21:32:59',5,'Un lujo',2,2,1),(8,15,15,16,'2024-12-04 21:33:54',4,'No se organizaba bien para las tareas, pero las realizaba',2,1,1),(9,15,16,15,'2024-12-04 21:34:34',5,'Excelente\n',1,2,1),(10,15,16,17,'2024-12-04 21:34:38',5,'Excelente',1,2,1);
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habilidad`
--

DROP TABLE IF EXISTS `habilidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habilidad` (
  `IdHabilidades` int unsigned NOT NULL AUTO_INCREMENT,
  `Nombre` longtext,
  `Descripcion` longtext,
  PRIMARY KEY (`IdHabilidades`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habilidad`
--

LOCK TABLES `habilidad` WRITE;
/*!40000 ALTER TABLE `habilidad` DISABLE KEYS */;
INSERT INTO `habilidad` VALUES (1,'Cocinar','cocinar'),(2,'Pintar Paredes','Pintar'),(3,'Limpiar','Limpiar'),(4,'Barrer','Barrer'),(5,'Carpinteria','Carpinteria'),(6,'Pintura Artistica',NULL),(7,'Animacion Chicos',NULL),(8,'Dibujar',NULL),(9,'Coser',NULL),(10,'Animación Adultos',NULL),(11,'Enseñar primaria',NULL),(12,'Enseñar Secundadria',NULL),(13,'Títeres',NULL),(14,'Soldadura',NULL);
/*!40000 ALTER TABLE `habilidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habilidades`
--

DROP TABLE IF EXISTS `habilidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habilidades` (
  `IdHabilidades` int unsigned NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) NOT NULL,
  `Descripcion` text,
  PRIMARY KEY (`IdHabilidades`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habilidades`
--

LOCK TABLES `habilidades` WRITE;
/*!40000 ALTER TABLE `habilidades` DISABLE KEYS */;
/*!40000 ALTER TABLE `habilidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kickedusers`
--

DROP TABLE IF EXISTS `kickedusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kickedusers` (
  `IdProyecto` int unsigned NOT NULL,
  `IdUsuario` int unsigned NOT NULL,
  `KickedBy` int unsigned NOT NULL,
  `KickDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Reason` text,
  PRIMARY KEY (`IdProyecto`,`IdUsuario`),
  KEY `fk_kicked_users_user` (`IdUsuario`),
  KEY `fk_kicked_users_admin` (`KickedBy`),
  CONSTRAINT `fk_kicked_users_admin` FOREIGN KEY (`KickedBy`) REFERENCES `usuario` (`Id`),
  CONSTRAINT `fk_kicked_users_project` FOREIGN KEY (`IdProyecto`) REFERENCES `proyecto` (`IdProyecto`),
  CONSTRAINT `fk_kicked_users_user` FOREIGN KEY (`IdUsuario`) REFERENCES `usuario` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kickedusers`
--

LOCK TABLES `kickedusers` WRITE;
/*!40000 ALTER TABLE `kickedusers` DISABLE KEYS */;
/*!40000 ALTER TABLE `kickedusers` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
INSERT INTO `notificacion` VALUES (3,'2024-12-04 23:18:58',15,'Hay un nuevo proyecto que podría interesarte. <a href=\"./projects/view/13\" >Ir al Proyecto </a>','2024-12-04 23:39:29'),(4,'2024-12-04 23:18:58',16,'Hay un nuevo proyecto que podría interesarte. <a href=\"./projects/view/13\" >Ir al Proyecto </a>','2024-12-04 23:29:55'),(5,'2024-12-04 23:18:58',17,'Hay un nuevo proyecto que podría interesarte. <a href=\"./projects/view/13\" >Ir al Proyecto </a>',NULL),(6,'2024-12-05 00:08:54',15,'Hay un nuevo proyecto que podría interesarte. <a href=\"./projects/view/14\" >Ir al Proyecto </a>',NULL),(7,'2024-12-05 00:08:54',16,'Hay un nuevo proyecto que podría interesarte. <a href=\"./projects/view/14\" >Ir al Proyecto </a>',NULL),(8,'2024-12-05 00:08:54',17,'Hay un nuevo proyecto que podría interesarte. <a href=\"./projects/view/14\" >Ir al Proyecto </a>',NULL),(9,'2024-12-05 00:18:04',15,'Hay un nuevo proyecto que podría interesarte. <a href=\"./projects/view/15\" >Ir al Proyecto </a>',NULL),(10,'2024-12-05 00:18:04',16,'Hay un nuevo proyecto que podría interesarte. <a href=\"./projects/view/15\" >Ir al Proyecto </a>',NULL),(11,'2024-12-05 00:18:04',17,'Hay un nuevo proyecto que podría interesarte. <a href=\"./projects/view/15\" >Ir al Proyecto </a>',NULL),(12,'2024-12-05 02:30:12',15,'Hay un nuevo proyecto que podría interesarte. <a href=\"./projects/view/16\" >Ir al Proyecto </a>',NULL),(13,'2024-12-05 02:30:12',16,'Hay un nuevo proyecto que podría interesarte. <a href=\"./projects/view/16\" >Ir al Proyecto </a>',NULL),(14,'2024-12-05 02:30:12',17,'Hay un nuevo proyecto que podría interesarte. <a href=\"./projects/view/16\" >Ir al Proyecto </a>',NULL);
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proyecto`
--

DROP TABLE IF EXISTS `proyecto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proyecto` (
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proyecto`
--

LOCK TABLES `proyecto` WRITE;
/*!40000 ALTER TABLE `proyecto` DISABLE KEYS */;
INSERT INTO `proyecto` VALUES (13,'2024-12-16 00:00:00.000','600, Boulogne Sur Mer, Once, Balvanera, Buenos Aires, Comuna 3, Ciudad Autónoma de Buenos Aires, C1190AAA, Argentina',-34.60325701,-58.40636462,'2024-12-16 00:00:00.000',20,'Te con los Abuelos','La idea de esta actividad es ir a pasar una tarde con los abuelos del asilo \"Hogar San Agustín\". Pasar con ellos una tarde divertidad y acompañarlos','2024-12-16 14:00:00.000','2024-12-16 19:00:00.000',1,0),(14,'2024-11-28 00:00:00.000','Bulnes, Almagro, Buenos Aires, Comuna 5, Ciudad Autónoma de Buenos Aires, C1176ABF, Argentina',-34.60584810,-58.41886640,'2024-12-05 00:00:00.000',25,'Limpieza de Plaza Almagro ','Queremos hacerle un lavado de cara a la Plaza, reparar y pintar los bancos. Mejorar los jardines, pintar las rejas y los juegos.   ','2024-11-28 09:00:00.000','2024-11-28 18:00:00.000',1,0),(15,'2024-11-08 00:00:00.000','1448, Paraguay, Recoleta, Buenos Aires, Comuna 2, Ciudad Autónoma de Buenos Aires, C1055AAE, Argentina',-34.59833803,-58.38755697,'2024-11-08 00:00:00.000',10,'Limpiar Fachada Escuela N 7','Nos juntamos para limpiar la fachada de la escuela que esta bastante maltratada. Queremos hacer una limpieza y mejorarla para los alumnos  que asisten al establecimiento.','2024-11-08 10:00:00.000','2024-11-08 20:00:00.000',0,0),(16,'2024-12-02 00:00:00.000','Virrey Cevallos, Monserrat, Buenos Aires, Comuna 1, Autonomous City of Buenos Aires, C1033AAG, Argentina',-34.60952565,-58.38904362,'2025-01-05 00:00:00.000',1,'Limpiar Grafitis plaza del congreso','Nos juntaremos todos para limpiar los grafitis de vándalos ','2024-12-02 14:29:00.000','2024-12-02 17:34:00.000',1,0);
/*!40000 ALTER TABLE `proyecto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proyectos_usuarios`
--

DROP TABLE IF EXISTS `proyectos_usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proyectos_usuarios` (
  `IdProyecto` int unsigned NOT NULL,
  `IdUsuario` int unsigned NOT NULL,
  `IdRol` int unsigned NOT NULL,
  `FechaInicio` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `FechaFin` datetime DEFAULT NULL,
  PRIMARY KEY (`IdProyecto`,`IdUsuario`,`IdRol`,`FechaInicio`),
  KEY `fk_Proyectos_Usuarios_Usuario` (`IdUsuario`),
  KEY `fk_Proyectos_Usuarios_Rol_proyecto` (`IdRol`),
  CONSTRAINT `fk_Proyectos_Usuarios_Proyecto` FOREIGN KEY (`IdProyecto`) REFERENCES `proyecto` (`IdProyecto`),
  CONSTRAINT `fk_Proyectos_Usuarios_Rol_proyecto` FOREIGN KEY (`IdRol`) REFERENCES `rol_proyecto` (`IdRol`),
  CONSTRAINT `fk_Proyectos_Usuarios_Usuario` FOREIGN KEY (`IdUsuario`) REFERENCES `usuario` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proyectos_usuarios`
--

LOCK TABLES `proyectos_usuarios` WRITE;
/*!40000 ALTER TABLE `proyectos_usuarios` DISABLE KEYS */;
INSERT INTO `proyectos_usuarios` VALUES (13,15,1,'2024-12-04 20:18:58',NULL),(13,16,2,'2024-12-04 20:36:21',NULL),(13,17,2,'2024-12-04 21:23:25',NULL),(14,15,2,'2024-12-04 21:23:35','2024-12-04 23:33:34'),(14,16,1,'2024-12-04 21:08:54',NULL),(14,17,2,'2024-12-04 21:23:44',NULL),(15,15,2,'2024-12-04 21:24:21',NULL),(15,16,1,'2024-12-04 21:18:04',NULL),(15,17,2,'2024-12-04 21:24:00',NULL),(16,15,1,'2024-12-04 23:30:12',NULL);
/*!40000 ALTER TABLE `proyectos_usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol_proyecto`
--

DROP TABLE IF EXISTS `rol_proyecto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol_proyecto` (
  `IdRol` int unsigned NOT NULL AUTO_INCREMENT,
  `Nombre` longtext,
  `Descripcion` longtext,
  `FechaInicioRol` datetime(3) DEFAULT NULL,
  `FechaFinRol` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`IdRol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol_proyecto`
--

LOCK TABLES `rol_proyecto` WRITE;
/*!40000 ALTER TABLE `rol_proyecto` DISABLE KEYS */;
INSERT INTO `rol_proyecto` VALUES (1,'Administrador','Administrador del proyecto con todos los permisos',NULL,NULL),(2,'Participante','Participante regular del proyecto',NULL,NULL);
/*!40000 ALTER TABLE `rol_proyecto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol_sistema`
--

DROP TABLE IF EXISTS `rol_sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol_sistema` (
  `IdRol` int unsigned NOT NULL AUTO_INCREMENT,
  `Descripcion` varchar(255) NOT NULL,
  `Titulo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`IdRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol_sistema`
--

LOCK TABLES `rol_sistema` WRITE;
/*!40000 ALTER TABLE `rol_sistema` DISABLE KEYS */;
/*!40000 ALTER TABLE `rol_sistema` ENABLE KEYS */;
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
/*!40000 ALTER TABLE `schema_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (15,'Juanma','Nagel','juan@gmail.com','$2a$10$DJ52qGQIA9DYb1OCdEl8Qepf8T3KqVn44T0WoK49Ural4KKLEqPZS',0,'1938Em/6Upt0GWG8A4Z9o3Lq+p9WJC+h1jPXBl9FKzkGbLitdm2xpxNI1MT7obev40UZNky2GFx7zlSf7gChl3Nhd/bVZ8MY2GAZSH4pXbaEknkb8iJuXDz75IpW8LPO6im9gCAyb5enPeu1+O8338L4zlB5hl+He4BniIMny+pFqpHSxWfTt9UEj8qv+0CfyU6H9w==',15,'2024-12-04 20:02:39.515','2024-12-04 20:02:59.469',NULL,'2024-12-04 20:02:39.515','2024-12-04 20:02:59.469',NULL,'SvTmYx1UtRAdGi/vT6D71K1UYZmYguVwy2DwCZM9BFEQ6nN4XMoUSSqv','MeNL9TBwEZRmWzGAvtCqiIKDjpTF29Yo/GrSJfc+jX1GEr3Ad3YX87Le','AR',NULL,NULL,0),(16,'Percy','Alvarez','praa.nqn@hotmail.com','$2a$10$cHa75TM5CzCuLJtj8oUX3uP8DOBsxW6Gt5AUmT2kAfJDJUDznuP06',0,'94vSaDnwJaaaP1qSwMghcI8kFQk3d5bW/RQybA==',10,'2024-12-04 20:03:39.544','2024-12-04 20:04:01.484',NULL,'2024-12-04 20:03:39.544','2024-12-04 20:04:01.484',NULL,'VNxsMa2isUMNb8G08qoCEsazpOXyeZtwq9A5iaejwbh0diqQdKKMxVh/','Lxax7cl2QlXjdSJ9Ab5GN9VLEV8M/h5lCcFGnTx8qcP+EQ1N36ArCUf3','AR',NULL,NULL,0),(17,'Tester','De Prueba','tester@test.com','$2a$10$RIl31dF38xfFIe.1sx8gWukyUxUEKYiFD8d9RvQv9hfN.6BVyAmOm',0,'qJiD4ZB+0k5y/ih5w5+yI8hDvjQAz+ZKZZWB4glzJG4PH8QpmfnOuXSBgHlnJ0rjaiTGXWL9QWXJJ7G4r/drKskC1WbeqnWRfxuQAQZPoo8bY/0IMqQT0t+xtWu3E/+lD7zH1NHsxhfeOt3dqwyZKXiZPRheZ9KN/L4=',20,'2024-12-04 20:04:31.495','2024-12-04 20:04:50.756',NULL,'2024-12-04 20:04:31.494','2024-12-04 20:04:50.755',NULL,'Em2zaZX1XxZNTQCjD4/jFbfpSSpWBwy8y1eWjaeu1lm5u5olPYvMvghX','nB6hjhGwizYmJzyw7/dc+3ZPvs3wnGGrr5OsTKI/6Apbf4F+rjYTrPG4','AR',NULL,NULL,0),(18,'Gustavo','Nagel','Gustavo@hotmail.com','$2a$10$L5GRoYoLcO9xWh2yhhePrOTlRpxOmsXAsI/.HEKg8aEwKhOpA0wHG',0,'',0,'2024-12-04 23:49:33.723','2024-12-04 23:49:33.723',NULL,'2024-12-04 23:49:33.723','2024-12-04 23:49:33.723',NULL,'','','',NULL,NULL,0);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `usuario_habilidades`
--

LOCK TABLES `usuario_habilidades` WRITE;
/*!40000 ALTER TABLE `usuario_habilidades` DISABLE KEYS */;
INSERT INTO `usuario_habilidades` VALUES (2,15),(3,15),(4,15),(5,15),(11,15),(12,15),(2,16),(4,16),(5,16),(6,16),(1,17),(2,17),(3,17),(12,17),(13,17),(14,17);
/*!40000 ALTER TABLE `usuario_habilidades` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-04 23:52:17
