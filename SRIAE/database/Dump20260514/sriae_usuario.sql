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
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `contrasena` varchar(255) NOT NULL,
  `nombre_completo` varchar(255) NOT NULL,
  `apellido_completo` varchar(255) NOT NULL,
  `correo_electronico` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo_usuario` varchar(255) NOT NULL,
  `foto_ruta` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo_electronico` (`correo_electronico`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'$2a$10$xyz','Admin','Sistema','maestro@escuela.com',NULL,'2026-05-11 06:24:49','MAESTRO',NULL),(2,'$2a$10$xyz','Juan','Pérez','padre@correo.com',NULL,'2026-05-11 06:24:49','TUTOR',NULL),(3,'password123','María','González','maria.enfermeria@escuela.com','5551234567','2026-05-11 06:39:12','ADMIN',NULL),(5,'$2a$10$LkHNEc/eSEi4d8MNYUVisuQLwQK4QfIvAd1Zp3ysNvEaFltylI9u.','Admin','','admin@escuela.com',NULL,'2026-05-12 05:51:25','ADMIN',NULL),(6,'$2a$10$W1KsGq7VB.DZWIH0IsTPveQFXto6F2SZ0kppfLnQU.kU9wj2rA9vG','Dan','Rosales','eliezer.yo19@gmail.com','8332369801','2026-05-12 10:06:33','TUTOR',NULL),(7,'$2a$10$r5pykg4MZJzYP.eSEwEqsuyCWUm.F2/QbgTdhHPbkOF59f9fvCOcW','Juan','','enf@escuela.com',NULL,'2026-05-12 10:41:02','MEDICO',NULL),(8,'$2a$10$9oExwyFfUvUulteA.6.If.FifUGlnobKG7a2s0gtdGbxui1qwHPqm','Sergio','Reyes','sergio@gmail.com',NULL,'2026-05-12 17:15:18','TUTOR',NULL),(9,'$2a$10$KusYgQs9y.OYkiY06SUqPOIUrPfwO8iY7ZSDqaN4FLAA9MiWl4FBW','Dionisio','Dios','dioni@gmail','833 1234567','2026-05-12 18:41:05','ADMIN',NULL),(10,'$2a$10$YxRbsgEUE04m2jj7YqwgK.IWM23rW05sUnuakaePAjrjI4wU/5wqC','Dionisio','Cruz','dionisio@gmail.com','8331233333','2026-05-12 18:43:25','DIRECTOR',NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-14  3:25:12
