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
-- Table structure for table `auditoria_log`
--

DROP TABLE IF EXISTS `auditoria_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria_log` (
  `id_auditoria` int NOT NULL AUTO_INCREMENT,
  `accion` varchar(255) NOT NULL,
  `detalle` varchar(255) DEFAULT NULL,
  `fecha` datetime(6) DEFAULT NULL,
  `usuario` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_auditoria`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria_log`
--

LOCK TABLES `auditoria_log` WRITE;
/*!40000 ALTER TABLE `auditoria_log` DISABLE KEYS */;
INSERT INTO `auditoria_log` VALUES (1,'REGISTRO_USUARIO','Rol: TUTOR','2026-05-12 04:06:32.572772','eliezer.yo19@gmail.com'),(2,'INICIO_SESION','Login correcto','2026-05-12 04:06:53.533711','eliezer.yo19@gmail.com'),(3,'INICIO_SESION','Login correcto','2026-05-12 04:08:16.075736','admin@escuela.com'),(4,'CREO_INCIDENTE','Incidente: 2','2026-05-12 04:15:22.163415','admin@escuela.com'),(5,'REGISTRO_USUARIO','Rol: MEDICO','2026-05-12 04:41:02.205967','enf@escuela.com'),(6,'INICIO_SESION','Login correcto','2026-05-12 04:42:21.877065','enf@escuela.com'),(7,'INICIO_SESION','Login correcto','2026-05-12 10:43:27.349941','eliezer.yo19@gmail.com'),(8,'INICIO_SESION','Login correcto','2026-05-12 10:45:02.633837','admin@escuela.com'),(9,'CREO_INCIDENTE','Incidente: 3','2026-05-12 10:45:46.400415','admin@escuela.com'),(10,'INICIO_SESION','Login correcto','2026-05-12 10:51:02.434508','admin@escuela.com'),(11,'INICIO_SESION','Login correcto','2026-05-12 10:52:27.943076','admin@escuela.com'),(12,'CREO_ESTUDIANTE','Matricula: 3','2026-05-12 10:53:26.844787','admin@escuela.com'),(13,'CREO_INCIDENTE','Incidente: 4','2026-05-12 10:54:24.399653','admin@escuela.com'),(14,'CREO_HISTORIAL_MEDICO','Historial: 1','2026-05-12 11:05:56.798459','admin@escuela.com'),(15,'INICIO_SESION','Login correcto','2026-05-12 11:12:15.843975','admin@escuela.com'),(16,'REGISTRO_USUARIO','Rol: TUTOR','2026-05-12 11:15:18.468170','sergio@gmail.com'),(17,'INICIO_SESION','Login correcto','2026-05-12 11:15:49.740798','sergio@gmail.com'),(18,'INICIO_SESION','Login correcto','2026-05-12 11:34:28.947149','sergio@gmail.com'),(19,'INICIO_SESION','Login correcto','2026-05-12 12:04:46.162631','admin@escuela.com'),(20,'VINCULO_TUTOR','Matricula: 3, tutor: 6','2026-05-12 12:13:39.151042','admin@escuela.com'),(21,'VINCULO_TUTOR','Matricula: 3, tutor: 2','2026-05-12 12:19:42.472693','admin@escuela.com'),(22,'VINCULO_TUTOR','Matricula: 3, tutor: 6','2026-05-12 12:21:10.053091','admin@escuela.com'),(23,'INICIO_SESION','Login correcto','2026-05-12 12:21:51.805843','eliezer.yo19@gmail.com'),(24,'INICIO_SESION','Login correcto','2026-05-12 12:23:49.378413','admin@escuela.com'),(25,'CREO_INCIDENTE','Incidente: 5','2026-05-12 12:24:36.470068','admin@escuela.com'),(26,'INICIO_SESION','Login correcto','2026-05-12 12:27:10.829269','eliezer.yo19@gmail.com'),(27,'INICIO_SESION','Login correcto','2026-05-12 12:28:54.014986','admin@escuela.com'),(28,'REGISTRO_USUARIO','Rol: ADMIN','2026-05-12 12:41:05.109372','dioni@gmail'),(29,'INICIO_SESION','Login correcto','2026-05-12 12:42:15.988266','admin@escuela.com'),(30,'REGISTRO_USUARIO','Rol: DIRECTOR','2026-05-12 12:43:25.501247','dionisio@gmail.com'),(31,'INICIO_SESION','Login correcto','2026-05-12 12:44:07.664625','dionisio@gmail.com'),(32,'INICIO_SESION','Login correcto','2026-05-12 12:47:58.060353','eliezer.yo19@gmail.com'),(33,'INICIO_SESION','Login correcto','2026-05-12 12:48:53.728558','eliezer.yo19@gmail.com'),(34,'INICIO_SESION','Login correcto','2026-05-12 12:51:06.961288','eliezer.yo19@gmail.com'),(35,'INICIO_SESION','Login correcto','2026-05-12 12:56:50.536788','admin@escuela.com'),(36,'INICIO_SESION','Login correcto','2026-05-12 12:57:34.810733','enf@escuela.com'),(37,'CREO_INCIDENTE','Incidente: 6','2026-05-12 12:59:12.942298','enf@escuela.com'),(38,'INICIO_SESION','Login correcto','2026-05-14 00:29:06.648106','admin@escuela.com'),(39,'INICIO_SESION','Login correcto','2026-05-14 00:30:51.844500','eliezer.yo19@gmail.com'),(40,'INICIO_SESION','Login correcto','2026-05-14 00:37:13.904850','admin@escuela.com'),(41,'INICIO_SESION','Login correcto','2026-05-14 00:48:14.626941','admin@escuela.com'),(42,'INICIO_SESION','Login correcto','2026-05-14 00:48:24.799894','admin@escuela.com'),(43,'INICIO_SESION','Login correcto','2026-05-14 00:51:05.885138','admin@escuela.com'),(44,'INICIO_SESION','Login correcto','2026-05-14 00:53:58.906699','admin@escuela.com'),(45,'INICIO_SESION','Login correcto','2026-05-14 00:54:16.167510','admin@escuela.com'),(46,'INICIO_SESION','Login correcto','2026-05-14 00:56:33.664325','admin@escuela.com'),(47,'CREO_INCIDENTE','Incidente: 7','2026-05-14 01:00:25.621742','admin@escuela.com'),(48,'INICIO_SESION','Login correcto','2026-05-14 01:06:48.467531','admin@escuela.com'),(49,'INICIO_SESION','Login correcto','2026-05-14 01:11:33.017904','admin@escuela.com'),(50,'INICIO_SESION','Login correcto','2026-05-14 01:25:49.070256','admin@escuela.com'),(51,'CREO_INCIDENTE','Incidente: 8','2026-05-14 01:30:02.882602','admin@escuela.com'),(52,'INICIO_SESION','Login correcto','2026-05-14 01:40:41.200458','admin@escuela.com'),(53,'CREO_INCIDENTE','Incidente: 9','2026-05-14 01:43:45.157265','admin@escuela.com'),(54,'CREO_INCIDENTE','Incidente: 10','2026-05-14 02:03:16.643138','admin@escuela.com'),(55,'CREO_INCIDENTE','Incidente: 11','2026-05-14 02:03:23.413403','admin@escuela.com'),(56,'INICIO_SESION','Login correcto','2026-05-14 02:06:25.980586','admin@escuela.com'),(57,'INICIO_SESION','Login correcto','2026-05-14 02:06:42.105571','admin@escuela.com'),(58,'CREO_INCIDENTE','Incidente: 12','2026-05-14 02:08:51.323777','admin@escuela.com'),(59,'CREO_INCIDENTE','Incidente: 13','2026-05-14 02:11:49.120390','admin@escuela.com'),(60,'CREO_INCIDENTE','Incidente: 14','2026-05-14 02:16:00.018276','admin@escuela.com'),(61,'VINCULO_DOCENTE','Matricula: 1, docente: 1','2026-05-14 02:34:10.759935','admin@escuela.com'),(62,'VINCULO_TUTOR','Matricula: 1, tutor: 2','2026-05-14 02:34:12.813210','admin@escuela.com');
/*!40000 ALTER TABLE `auditoria_log` ENABLE KEYS */;
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
