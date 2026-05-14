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
-- Table structure for table `incidente`
--

DROP TABLE IF EXISTS `incidente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incidente` (
  `id_incidente` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `fecha_incidente` datetime(6) DEFAULT NULL,
  `foto_ruta` varchar(255) DEFAULT NULL,
  `nivel_alerta` varchar(255) DEFAULT NULL,
  `titulo` varchar(255) NOT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `id_estudiante_involucrado` int DEFAULT NULL,
  `id_usuario_reporta` int NOT NULL,
  PRIMARY KEY (`id_incidente`),
  KEY `FKtcgiifkn7w5ncp3vjtvkihepa` (`id_estudiante_involucrado`),
  KEY `FKipkoid2umqqvcgbaglvfakb5a` (`id_usuario_reporta`),
  CONSTRAINT `FKipkoid2umqqvcgbaglvfakb5a` FOREIGN KEY (`id_usuario_reporta`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `FKtcgiifkn7w5ncp3vjtvkihepa` FOREIGN KEY (`id_estudiante_involucrado`) REFERENCES `estudiante` (`matricula`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incidente`
--

LOCK TABLES `incidente` WRITE;
/*!40000 ALTER TABLE `incidente` DISABLE KEYS */;
INSERT INTO `incidente` VALUES (1,'Se percibe olor a gas en la cocina escolar.','PENDIENTE','2026-05-12 00:00:02.016801',NULL,'CRITICA','Fuga de gas','Edificio de Cafetería',NULL,5),(2,'Sin descripcion','PENDIENTE','2026-05-12 04:15:22.154570',NULL,'BAJA','Dolor de cabeza','Salon',1,5),(3,'Sin descripcion','PENDIENTE','2026-05-12 10:45:46.352708',NULL,'BAJA','Dolor de cabeza','Patio',1,5),(4,'Sin descripcion','PENDIENTE','2026-05-12 10:54:24.370903',NULL,'BAJA','Dolor de estómago','Patio',3,5),(5,'Sin descripcion','PENDIENTE','2026-05-12 12:24:36.438091',NULL,'GRAVE','Hemorragia severa','Patio',3,5),(6,'Se cayó','PENDIENTE','2026-05-12 12:59:12.864543',NULL,'GRAVE','Fractura','Pasillos',2,7),(7,'Sin descripcion','PENDIENTE','2026-05-14 01:00:25.604697','cda45c67-6fe0-43c9-a246-3169afc3fef6_descarga.jpg','GRAVE','Pérdida del conocimiento','Patio',1,5),(8,'Sin descripcion','PENDIENTE','2026-05-14 01:30:02.872689',NULL,'MEDIA','Náuseas / Vómito','Baños',3,5),(9,'Sin descripcion','PENDIENTE','2026-05-14 01:43:45.145608',NULL,'GRAVE','Atragantamiento / Asfixia','Salon',3,5),(10,'Sin descripcion','PENDIENTE','2026-05-14 02:03:16.597448',NULL,'GRAVE','Quemadura','Salon',3,5),(11,'Sin descripcion','PENDIENTE','2026-05-14 02:03:23.407509',NULL,'GRAVE','Quemadura','Salon',3,5),(12,'Sin descripcion','PENDIENTE','2026-05-14 02:08:51.318659',NULL,'GRAVE','Dificultad respiratoria','Baños',3,5),(13,'Sin descripcion','PENDIENTE','2026-05-14 02:11:49.113293',NULL,'GRAVE','Crisis convulsiva','Cooperativa',3,5),(14,'Sin descripcion','PENDIENTE','2026-05-14 02:15:59.976095',NULL,'GRAVE','Hemorragia severa','Salon',3,5);
/*!40000 ALTER TABLE `incidente` ENABLE KEYS */;
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
