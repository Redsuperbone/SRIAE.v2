-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: sriae
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacion` (
  `id_notificacion` int NOT NULL AUTO_INCREMENT,
  `fecha_creacion` datetime(6) DEFAULT NULL,
  `leida` bit(1) NOT NULL,
  `mensaje` varchar(255) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `id_incidente` int DEFAULT NULL,
  `id_usuario_destino` int NOT NULL,
  PRIMARY KEY (`id_notificacion`),
  KEY `FKeu6l07yaje4uj1dcuf9cc1te` (`id_incidente`),
  KEY `FKnusx12rr54u3hkwbdiy0lue3c` (`id_usuario_destino`),
  CONSTRAINT `FKeu6l07yaje4uj1dcuf9cc1te` FOREIGN KEY (`id_incidente`) REFERENCES `incidente` (`id_incidente`),
  CONSTRAINT `FKnusx12rr54u3hkwbdiy0lue3c` FOREIGN KEY (`id_usuario_destino`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
INSERT INTO `notificacion` VALUES (1,'2026-05-12 12:24:36.538200',_binary '','Se registro una incidencia Hemorragia severa con alerta GRAVE','Incidencia relevante registrada',5,3),(2,'2026-05-12 12:24:36.554883',_binary '','Se registro una incidencia Hemorragia severa con alerta GRAVE','Incidencia relevante registrada',5,5),(3,'2026-05-12 12:24:36.568521',_binary '','Se registro una incidencia Hemorragia severa con alerta GRAVE','Incidencia relevante registrada',5,2),(4,'2026-05-12 12:24:36.574369',_binary '','Se registro una incidencia Hemorragia severa con alerta GRAVE','Incidencia relevante registrada',5,6),(5,'2026-05-12 12:59:12.991811',_binary '','Se registro una incidencia Fractura con alerta GRAVE','Incidencia relevante registrada',6,5),(6,'2026-05-12 12:59:13.007410',_binary '','Se registro una incidencia Fractura con alerta GRAVE','Incidencia relevante registrada',6,3),(7,'2026-05-12 12:59:13.023436',_binary '','Se registro una incidencia Fractura con alerta GRAVE','Incidencia relevante registrada',6,9),(8,'2026-05-12 12:59:13.027087',_binary '','Se registro una incidencia Fractura con alerta GRAVE','Incidencia relevante registrada',6,10),(9,'2026-05-14 01:00:25.638733',_binary '\0','Se registro una incidencia Pérdida del conocimiento con alerta GRAVE','Incidencia relevante registrada',7,3),(10,'2026-05-14 01:00:25.642870',_binary '\0','Se registro una incidencia Pérdida del conocimiento con alerta GRAVE','Incidencia relevante registrada',7,9),(11,'2026-05-14 01:00:25.646617',_binary '\0','Se registro una incidencia Pérdida del conocimiento con alerta GRAVE','Incidencia relevante registrada',7,2),(12,'2026-05-14 01:00:25.651173',_binary '\0','Se registro una incidencia Pérdida del conocimiento con alerta GRAVE','Incidencia relevante registrada',7,10),(13,'2026-05-14 01:00:25.655819',_binary '','Se registro una incidencia Pérdida del conocimiento con alerta GRAVE','Incidencia relevante registrada',7,5),(14,'2026-05-14 01:43:45.175960',_binary '\0','Se registro una incidencia Atragantamiento / Asfixia con alerta GRAVE','Incidencia relevante registrada',9,6),(15,'2026-05-14 01:43:45.182957',_binary '\0','Se registro una incidencia Atragantamiento / Asfixia con alerta GRAVE','Incidencia relevante registrada',9,3),(16,'2026-05-14 01:43:45.189952',_binary '\0','Se registro una incidencia Atragantamiento / Asfixia con alerta GRAVE','Incidencia relevante registrada',9,9),(17,'2026-05-14 01:43:45.195439',_binary '\0','Se registro una incidencia Atragantamiento / Asfixia con alerta GRAVE','Incidencia relevante registrada',9,10),(18,'2026-05-14 01:43:45.200438',_binary '','Se registro una incidencia Atragantamiento / Asfixia con alerta GRAVE','Incidencia relevante registrada',9,5),(19,'2026-05-14 01:43:45.204924',_binary '\0','Se registro una incidencia Atragantamiento / Asfixia con alerta GRAVE','Incidencia relevante registrada',9,2),(20,'2026-05-14 02:03:16.663270',_binary '\0','Se registro una incidencia Quemadura con alerta GRAVE','Incidencia relevante registrada',10,3),(21,'2026-05-14 02:03:16.672273',_binary '\0','Se registro una incidencia Quemadura con alerta GRAVE','Incidencia relevante registrada',10,9),(22,'2026-05-14 02:03:16.676398',_binary '\0','Se registro una incidencia Quemadura con alerta GRAVE','Incidencia relevante registrada',10,6),(23,'2026-05-14 02:03:16.683354',_binary '','Se registro una incidencia Quemadura con alerta GRAVE','Incidencia relevante registrada',10,5),(24,'2026-05-14 02:03:16.688720',_binary '\0','Se registro una incidencia Quemadura con alerta GRAVE','Incidencia relevante registrada',10,2),(25,'2026-05-14 02:03:16.694052',_binary '\0','Se registro una incidencia Quemadura con alerta GRAVE','Incidencia relevante registrada',10,10),(26,'2026-05-14 02:03:23.424962',_binary '\0','Se registro una incidencia Quemadura con alerta GRAVE','Incidencia relevante registrada',11,3),(27,'2026-05-14 02:03:23.428786',_binary '\0','Se registro una incidencia Quemadura con alerta GRAVE','Incidencia relevante registrada',11,2),(28,'2026-05-14 02:03:23.433454',_binary '\0','Se registro una incidencia Quemadura con alerta GRAVE','Incidencia relevante registrada',11,9),(29,'2026-05-14 02:03:23.438453',_binary '\0','Se registro una incidencia Quemadura con alerta GRAVE','Incidencia relevante registrada',11,6),(30,'2026-05-14 02:03:23.443457',_binary '','Se registro una incidencia Quemadura con alerta GRAVE','Incidencia relevante registrada',11,5),(31,'2026-05-14 02:03:23.448458',_binary '\0','Se registro una incidencia Quemadura con alerta GRAVE','Incidencia relevante registrada',11,10),(32,'2026-05-14 02:08:51.333773',_binary '\0','Se registro una incidencia Dificultad respiratoria con alerta GRAVE','Incidencia relevante registrada',12,9),(33,'2026-05-14 02:08:51.338771',_binary '\0','Se registro una incidencia Dificultad respiratoria con alerta GRAVE','Incidencia relevante registrada',12,2),(34,'2026-05-14 02:08:51.342508',_binary '','Se registro una incidencia Dificultad respiratoria con alerta GRAVE','Incidencia relevante registrada',12,5),(35,'2026-05-14 02:08:51.347511',_binary '\0','Se registro una incidencia Dificultad respiratoria con alerta GRAVE','Incidencia relevante registrada',12,10),(36,'2026-05-14 02:08:51.351350',_binary '\0','Se registro una incidencia Dificultad respiratoria con alerta GRAVE','Incidencia relevante registrada',12,6),(37,'2026-05-14 02:08:51.356008',_binary '\0','Se registro una incidencia Dificultad respiratoria con alerta GRAVE','Incidencia relevante registrada',12,3),(38,'2026-05-14 02:11:49.128842',_binary '\0','Se registro una incidencia Crisis convulsiva con alerta GRAVE','Incidencia relevante registrada',13,10),(39,'2026-05-14 02:11:49.133701',_binary '\0','Se registro una incidencia Crisis convulsiva con alerta GRAVE','Incidencia relevante registrada',13,6),(40,'2026-05-14 02:11:49.137705',_binary '','Se registro una incidencia Crisis convulsiva con alerta GRAVE','Incidencia relevante registrada',13,5),(41,'2026-05-14 02:11:49.141706',_binary '\0','Se registro una incidencia Crisis convulsiva con alerta GRAVE','Incidencia relevante registrada',13,2),(42,'2026-05-14 02:11:49.147710',_binary '\0','Se registro una incidencia Crisis convulsiva con alerta GRAVE','Incidencia relevante registrada',13,9),(43,'2026-05-14 02:11:49.152712',_binary '\0','Se registro una incidencia Crisis convulsiva con alerta GRAVE','Incidencia relevante registrada',13,3),(44,'2026-05-14 02:16:00.041264',_binary '\0','Se registro una incidencia Hemorragia severa con alerta GRAVE','Incidencia relevante registrada',14,3),(45,'2026-05-14 02:16:00.046603',_binary '\0','Se registro una incidencia Hemorragia severa con alerta GRAVE','Incidencia relevante registrada',14,10),(46,'2026-05-14 02:16:00.051603',_binary '\0','Se registro una incidencia Hemorragia severa con alerta GRAVE','Incidencia relevante registrada',14,2),(47,'2026-05-14 02:16:00.054989',_binary '','Se registro una incidencia Hemorragia severa con alerta GRAVE','Incidencia relevante registrada',14,5),(48,'2026-05-14 02:16:00.059987',_binary '\0','Se registro una incidencia Hemorragia severa con alerta GRAVE','Incidencia relevante registrada',14,6),(49,'2026-05-14 02:16:00.065382',_binary '\0','Se registro una incidencia Hemorragia severa con alerta GRAVE','Incidencia relevante registrada',14,9);
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-14  3:25:11
