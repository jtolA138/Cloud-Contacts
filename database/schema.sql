-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: COP4331
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.24.04.1

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
-- Table structure for table `Colors`
--

DROP TABLE IF EXISTS `Colors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Colors` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL DEFAULT '',
  `UserID` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Colors`
--

LOCK TABLES `Colors` WRITE;
/*!40000 ALTER TABLE `Colors` DISABLE KEYS */;
INSERT INTO `Colors` VALUES (1,'Blue',1),(2,'White',1),(3,'Black',1),(4,'gray',1),(5,'Magenta',1),(6,'Yellow',1),(7,'Cyan',1),(8,'Salmon',1),(9,'Chartreuse',1),(10,'Lime',1),(11,'Light Blue',1),(12,'Light Gray',1),(13,'Light Red',1),(14,'Light Green',1),(15,'Chiffon',1),(16,'Fuscia',1),(17,'Brown',1),(18,'Beige',1),(19,'Blue',3),(20,'White',3),(21,'Black',3),(22,'gray',3),(23,'Magenta',3),(24,'Yellow',3),(25,'Cyan',3),(26,'Salmon',3),(27,'Chartreuse',3),(28,'Lime',3),(29,'Light Blue',3),(30,'Light Gray',3),(31,'Light Red',3),(32,'Light Green',3),(33,'Chiffon',3),(34,'Fuscia',3),(35,'Brown',3),(36,'Beige',3),(37,'Teal',1),(38,'Gold',1),(39,'Red',1),(40,'Purple',1);
/*!40000 ALTER TABLE `Colors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Contacts`
--

DROP TABLE IF EXISTS `Contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Contacts` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) NOT NULL DEFAULT '',
  `LastName` varchar(50) NOT NULL DEFAULT '',
  `Email` varchar(50) NOT NULL DEFAULT '',
  `PhoneNumber` varchar(50) NOT NULL DEFAULT '',
  `UserID` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Contacts`
--

LOCK TABLES `Contacts` WRITE;
/*!40000 ALTER TABLE `Contacts` DISABLE KEYS */;
INSERT INTO `Contacts` VALUES (1,'Yukari','Takeba','takeba@sees.edu','321-445-1995',7),(3,'Rise','Kujikawa','riseidol@iteam.com','411-911-3434',7),(4,'Junpei','Iori','iori@sees.com','818-125-1995',7),(5,'Mitsuru','Kirijo','kirijo@sees.com','545-937-1994',7),(6,'Kat','Burnell','dspkat@snort.com','407-407-4074',7),(7,'Shinji','Tori','shinji@sees.com','404-669-9021',7),(8,'Michael','Bacon','mbacon@outlook.com','505-278-9964',7),(11,'Travis','Meade','hellokitty@ucf.edu','911-911-9111',1),(12,'Tanvir','Ahmed','ahmed@ucf.edu','292-854-1432',1),(14,'Example','Person','person1@people.com','101-101-1111',7),(15,'Allison','Wasinger','alli@gmail.com','767-407-4459',7),(16,'Angela','Bacon','abacon@live.com','434-967-0021',7),(17,'Zeke','Milton','millerzeke335@cox.net','308-305-8000',7),(18,'Accidental','Contact','whoops@mistake.com','562-042-7591',7);
/*!40000 ALTER TABLE `Contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) NOT NULL DEFAULT '',
  `LastName` varchar(50) NOT NULL DEFAULT '',
  `Login` varchar(50) NOT NULL DEFAULT '',
  `Password` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'Rick','Leinecker','RickL','COP4331'),(2,'Sam','Hill','SamH','Test'),(3,'Rick','Leinecker','RickL','5832a71366768098cceb7095efb774f2'),(5,'Rick','Leinecker','RickL','5832a71366768098cceb7095efb774f2'),(6,'Sam','Hill','SamH','0cbc6611f5540bd0809a388dc95a615b'),(7,'Jorge','Toledo','JT','COP4331'),(8,'Yukari','Takeba','YT1','Yukari1'),(9,'Mike','Rowe','MR1','Test1234'),(10,'Tim','Kowalski','TK','Password'),(11,'John','Doe','JD1','password'),(12,'Allison','Toledo','AT','COP4331'),(13,'Michael','Bacon','MB','COP4331'),(15,'Mike','Hawk','MH','password'),(16,'Rick','Leinecker','RickL','COP4331');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-30 17:26:27
