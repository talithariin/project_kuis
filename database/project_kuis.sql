-- MySQL dump 10.13  Distrib 8.3.0, for macos14.2 (arm64)
--
-- Host: localhost    Database: project_kuis
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Answers`
--

DROP TABLE IF EXISTS `Answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Answers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_answer_option` enum('a','b','c','d','e') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `question_id` int DEFAULT NULL,
  `is_correct` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `User_Answer_Questions_FK` (`question_id`),
  KEY `User_Answer_Users_FK` (`user_id`),
  CONSTRAINT `User_Answer_Questions_FK` FOREIGN KEY (`question_id`) REFERENCES `Questions` (`id`) ON DELETE CASCADE ON UPDATE SET NULL,
  CONSTRAINT `User_Answer_Users_FK` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Answers`
--

LOCK TABLES `Answers` WRITE;
/*!40000 ALTER TABLE `Answers` DISABLE KEYS */;
INSERT INTO `Answers` VALUES (8,'a',1,6,1),(9,'c',1,8,1),(10,'a',1,9,0),(11,'a',1,6,1),(12,'c',1,10,0),(13,'a',1,11,0);
/*!40000 ALTER TABLE `Answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Classrooms`
--

DROP TABLE IF EXISTS `Classrooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Classrooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `join_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `owner_id` int NOT NULL,
  `student_id` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Classrooms_UNIQUE` (`join_code`),
  KEY `Classrooms_Users_FK` (`owner_id`),
  CONSTRAINT `Classrooms_Users_FK` FOREIGN KEY (`owner_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Classrooms`
--

LOCK TABLES `Classrooms` WRITE;
/*!40000 ALTER TABLE `Classrooms` DISABLE KEYS */;
INSERT INTO `Classrooms` VALUES (2,'Pemrograman Dasar Kelas C','BF2JNZR',1,'[5, 6, 1]'),(3,'Biologi kelas C','2P1S0ZO',7,'[2]');
/*!40000 ALTER TABLE `Classrooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Questions`
--

DROP TABLE IF EXISTS `Questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_text` text COLLATE utf8mb4_general_ci NOT NULL,
  `quiz_id` int NOT NULL,
  `options` json NOT NULL,
  `answer_key` enum('a','b','c','d','e') COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Questions_Quizzez_FK` (`quiz_id`),
  CONSTRAINT `Questions_Quizzez_FK` FOREIGN KEY (`quiz_id`) REFERENCES `Quizzez` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Questions`
--

LOCK TABLES `Questions` WRITE;
/*!40000 ALTER TABLE `Questions` DISABLE KEYS */;
INSERT INTO `Questions` VALUES (6,'Siapa nama dia?',1,'{\"a\": \"Jokowi\", \"b\": \"SBY\", \"c\": \"Prabowo\", \"d\": \"Ganjar\", \"e\": \"Anies\"}','a'),(8,'Arin cantik ga',5,'{\"a\": \"Iya\", \"b\": \"Oke\", \"c\": \"Rahasia\", \"d\": \"Salah\", \"e\": \"Benar\"}','c'),(9,'Siapa presiden sekarang',5,'{\"a\": \"Jokowi\", \"b\": \"SBY\", \"c\": \"Prabowo\", \"d\": \"Ganjar\", \"e\": \"Anies\"}','c'),(10,'1 + 1 berapa?',1,'{\"a\": \"5\", \"b\": \"2\", \"c\": \"4\", \"d\": \"jendela\", \"e\": \"10\"}','b'),(11,'Apa nama hewan pemakan daging',1,'{\"a\": \"Omnivora\", \"b\": \"Herbivora\", \"c\": \"Flora\", \"d\": \"Karnivora\", \"e\": \"Fauna\"}','d'),(12,'Siapa counter hero Alpha?',10,'{\"a\": \"Arin\", \"b\": \"Change\", \"c\": \"Thamuz\", \"d\": \"Udin\", \"e\": \"Didu\"}','e'),(14,'Siapa counter hero Masha?',7,'{\"a\": \"Arin\", \"b\": \"Change\", \"c\": \"Thamuz\", \"d\": \"Udin\", \"e\": \"Didu\"}','a');
/*!40000 ALTER TABLE `Questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Quizzez`
--

DROP TABLE IF EXISTS `Quizzez`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Quizzez` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT '0',
  `classroom_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Quizzez_Classrooms_FK` (`classroom_id`),
  CONSTRAINT `Quizzez_Classrooms_FK` FOREIGN KEY (`classroom_id`) REFERENCES `Classrooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Quizzez`
--

LOCK TABLES `Quizzez` WRITE;
/*!40000 ALTER TABLE `Quizzez` DISABLE KEYS */;
INSERT INTO `Quizzez` VALUES (1,'Ujian woy',0,2),(3,'UTS SEMESTER GENAP 2024',0,3),(5,'Ujian satu',1,NULL),(7,'Testing',0,3),(10,'Quiz EXP Lane',0,3);
/*!40000 ALTER TABLE `Quizzez` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Result`
--

DROP TABLE IF EXISTS `Result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Result` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `quiz_id` int NOT NULL,
  `score` int DEFAULT NULL,
  `classroom_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Result_Users_FK` (`user_id`),
  KEY `Result_Quizzez_FK` (`quiz_id`),
  KEY `Rank_Classrooms_FK` (`classroom_id`),
  CONSTRAINT `Rank_Classrooms_FK` FOREIGN KEY (`classroom_id`) REFERENCES `Classrooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Result_Quizzez_FK` FOREIGN KEY (`quiz_id`) REFERENCES `Quizzez` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Result_Users_FK` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Result`
--

LOCK TABLES `Result` WRITE;
/*!40000 ALTER TABLE `Result` DISABLE KEYS */;
INSERT INTO `Result` VALUES (1,1,5,50,NULL),(4,1,1,66,2),(6,6,5,100,NULL),(7,6,1,33,2);
/*!40000 ALTER TABLE `Result` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('superadmin','admin','user') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'user',
  `full_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'talithariin','talithariin@student.ub.ac.id','$2b$10$IhMnzWgAPykmzM3fnAH3R.Sy4zJMLnmEAMdNdkZ3aSOQiGM4y9MFy','superadmin','Dwi Arini','Malang','2003-10-02'),(5,'DiduWoy','didukeren@student.ub.ac.id','$2b$10$5KPPwwhdoVIOziHv359MvOQq5t4yhQz3wTzSbL4tcvdQhHjmJ1mc2','admin','Didu Keren Asoy','Malang','2003-10-02'),(6,'testinguser','testinguser@gmail.com','$2b$10$48sVZk5rJspGWK5DzIeTce5LPEyACZ1VM24Vs/GvnC97/NL0JjH2K','user','Testing Role User','Lowokwaru, Malang','2003-10-02'),(7,'Didu Ganteng','diduGanteng@student.ub.ac.id','$2b$10$Ywo2WaIXLSjcG/8T3ir2/ONuea/jMv.SkWkEBSh8tCFFNEPRKV5Um','superadmin','Didu Keren Asoy','Malang','2003-10-02');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'project_kuis'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-29 22:02:56
