-- MySQL dump 10.16  Distrib 10.2.13-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: abacus
-- ------------------------------------------------------
-- Server version	10.2.13-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `achievers`
--

DROP TABLE IF EXISTS `achievers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `achievers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(45) NOT NULL,
  `enable` int(11) DEFAULT 0,
  `photo` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `achievers`
--

LOCK TABLES `achievers` WRITE;
/*!40000 ALTER TABLE `achievers` DISABLE KEYS */;
/*!40000 ALTER TABLE `achievers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `club`
--

DROP TABLE IF EXISTS `club`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `club` (
  `clubid` int(11) NOT NULL AUTO_INCREMENT,
  `clubname` varchar(20) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `photo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`clubid`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club`
--

LOCK TABLES `club` WRITE;
/*!40000 ALTER TABLE `club` DISABLE KEYS */;
INSERT INTO `club` VALUES (39,'Gloud','A cloud computing club to tell more about servers','/static/club-photos/Gloud'),(40,'CyberOnites','A club to Learn more about Cyber world','/static/club-photos/CyberOnites'),(41,'IoT','IoT is a club organized by CS Department','/static/club-photos/IoT'),(42,'A4A','Get ready to inject programming into your veins','/static/club-photos/A4A'),(43,'Abacus','Abacus is Computer Science Society organized by CS Department','/static/club-photos/Abacus');
/*!40000 ALTER TABLE `club` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event` (
  `eventid` varchar(40) NOT NULL DEFAULT '',
  `event_name` varchar(30) DEFAULT NULL,
  `venue` varchar(20) DEFAULT NULL,
  `description` varchar(5000) DEFAULT NULL,
  `abacus_price` bigint(20) DEFAULT NULL,
  `non_abacus_price` bigint(20) DEFAULT NULL,
  `start_date_time` datetime DEFAULT NULL,
  `end_date_time` datetime DEFAULT NULL,
  `id` bigint(20) unsigned NOT NULL,
  `clubid` int(11) DEFAULT NULL,
  `event_timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `approved` int(1) DEFAULT 0,
  `reviewed` int(1) DEFAULT 0,
  `event_photo` varchar(2000) DEFAULT NULL,
  `total_seats` int(5) DEFAULT NULL,
  `avilable_seats` int(5) DEFAULT NULL,
  `certificateTemplate` int(50) DEFAULT NULL,
  PRIMARY KEY (`eventid`),
  KEY `id` (`id`),
  KEY `clubid` (`clubid`),
  CONSTRAINT `event_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user` (`id`),
  CONSTRAINT `event_ibfk_2` FOREIGN KEY (`clubid`) REFERENCES `club` (`clubid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` VALUES ('5ehjdnk,_7','5ehjdnk,','gvhbjn,m','hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj hgj ',52,522,'2018-10-10 10:10:00','2018-10-10 11:11:00',846915,39,'2018-04-12 19:11:58',1,1,'/static/upload/upload_13008a624197427d321b3c0cd3b22712',36,34,1),('Android Development_1','Android Development','AB-1','This workshop is for Android development. Here you will learn basics of Android. This workshop is for B.Tech  only.',100,150,'2017-10-03 10:00:00','2017-10-03 16:00:00',846913,39,'2018-04-09 02:23:42',1,1,'/static/upload/upload_a9639142069ede102529e191ad83a132',78,77,1),('Chrome Development_5','Chrome Development','ITM Conference Hall','This workshop is for development of Google Chrome. In this workshop, you will learn development of Chrome Extensions and Tabs. You should have basic knowledge of HTML, CSS and Javascript to attend this event.',1000,1200,'2017-03-03 10:00:00','2017-04-03 10:00:00',846913,42,'2018-04-09 02:22:30',1,1,'/static/upload/upload_29b29137c1165f460e3c4c8e7f6f0e6f',150,150,1),('Ethical hacking_3','Ethical hacking','AB-1','In this workshop, You will learn the basics of hacking. Email hacking, SQL injection, BruteForce method, Phishing are included.',250,300,'2017-12-12 14:00:00','2017-12-12 18:00:00',846913,39,'2017-11-17 14:09:02',1,1,'/static/upload/upload_32d49ed4cd0a56bcccf6b2d1417739de',90,90,1),('IoT_4','IoT','AB-1','In this workshop, you will learn to work on Raspberry PI. This workshop is for only B.Tech and M.Tech students. ',500,800,'2018-01-01 09:00:00','2018-01-01 14:00:00',846913,39,'2017-09-22 08:13:29',1,1,'/static/upload/upload_ee58fab5ccc3b6404b4b031aafb3fbab',50,50,1),('Node.JS_6','Node.JS','EC conference Hall','In this workshop, you will learn web development with Node.JS. You should have basic knowledge of Javascript',500,600,'2017-03-03 10:00:00','2017-03-03 16:00:00',846913,39,'2017-09-22 08:28:08',1,1,'/static/upload/upload_be49a77231a0bf748bd842cf01376a43',58,57,1),('Python_2','Python','IBM hall','In this workshop, you will learn to make Desktop applications by using Python and its libraries Numpy, Scipy.',150,200,'2017-09-25 08:00:00','2017-09-25 18:00:00',846913,40,'2017-09-22 08:24:18',1,1,'/static/upload/upload_fad852b4a921f45ec2eccfd2086553fe',89,88,1);
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_coordinator`
--

DROP TABLE IF EXISTS `event_coordinator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_coordinator` (
  `eventid` varchar(40) DEFAULT NULL,
  `id` bigint(20) unsigned DEFAULT NULL,
  KEY `id` (`id`),
  CONSTRAINT `event_coordinator_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_coordinator`
--

LOCK TABLES `event_coordinator` WRITE;
/*!40000 ALTER TABLE `event_coordinator` DISABLE KEYS */;
INSERT INTO `event_coordinator` VALUES ('Android Development_1',846914),('Android Development_1',846913),('Python_2',846913),('Ethical hacking_3',846913),('IoT_4',846913),('Chrome Development_5',846913),('Node.JS_6',846913),('5ehjdnk,_7',846913),('5ehjdnk,_7',846915);
/*!40000 ALTER TABLE `event_coordinator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_media`
--

DROP TABLE IF EXISTS `event_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_media` (
  `eventid` varchar(40) DEFAULT NULL,
  `file` varchar(500) DEFAULT NULL,
  `media_type` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_media`
--

LOCK TABLES `event_media` WRITE;
/*!40000 ALTER TABLE `event_media` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forget_password`
--

DROP TABLE IF EXISTS `forget_password`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `forget_password` (
  `email` varchar(40) NOT NULL,
  `password` varchar(20) DEFAULT NULL,
  `verification_code` varchar(20) DEFAULT NULL,
  `user_timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forget_password`
--

LOCK TABLES `forget_password` WRITE;
/*!40000 ALTER TABLE `forget_password` DISABLE KEYS */;
INSERT INTO `forget_password` VALUES ('lekhraj.singh_cs15@gla.ac.in','123456789','edBP5','2017-08-24 12:56:15');
/*!40000 ALTER TABLE `forget_password` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `query`
--

DROP TABLE IF EXISTS `query`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `query` (
  `qid` bigint(20) NOT NULL AUTO_INCREMENT,
  `id` bigint(15) unsigned DEFAULT NULL,
  `description` varchar(1000) NOT NULL,
  `reply` varchar(2000) DEFAULT NULL,
  `is_replied` bigint(1) DEFAULT 0,
  `eventid` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`qid`),
  KEY `id` (`id`),
  CONSTRAINT `query_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `query`
--

LOCK TABLES `query` WRITE;
/*!40000 ALTER TABLE `query` DISABLE KEYS */;
INSERT INTO `query` VALUES (1,846915,'Are BCA students allowed?','sjknkw',1,'Ethical hacking_3'),(2,846915,'s','jk,m',1,'Chrome Development_5'),(3,846915,'s','ygyufhsckml.',1,'Chrome Development_5'),(4,846915,'ss','ikjhg',1,'Chrome Development_5'),(5,846915,'s','hfbgfvsdasxaz',1,'Chrome Development_5'),(6,846915,'s','ssss',1,'Chrome Development_5'),(7,846915,'w','fcgvhbjn',1,'Chrome Development_5'),(8,846915,'q',NULL,0,'Chrome Development_5'),(9,846915,'q','gdfscd',1,'Chrome Development_5'),(10,846913,'vcx',NULL,0,'5ehjdnk,_7'),(11,846915,'hgvfcdxs','jynhtbgvfrcdxsz',1,'5ehjdnk,_7'),(12,846915,'rf',NULL,0,'5ehjdnk,_7'),(13,846915,'e',NULL,0,'5ehjdnk,_7'),(14,846915,'s',NULL,0,'5ehjdnk,_7'),(15,846915,'ijyhtgrfcxsa','thgrfedwsa',1,'5ehjdnk,_7');
/*!40000 ALTER TABLE `query` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registration`
--

DROP TABLE IF EXISTS `registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `registration` (
  `reg_no` bigint(20) NOT NULL AUTO_INCREMENT,
  `id` bigint(20) unsigned DEFAULT NULL,
  `eventid` varchar(40) DEFAULT NULL,
  `reg_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `present` int(1) DEFAULT 0,
  PRIMARY KEY (`reg_no`),
  KEY `id` (`id`),
  CONSTRAINT `registration_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registration`
--

LOCK TABLES `registration` WRITE;
/*!40000 ALTER TABLE `registration` DISABLE KEYS */;
INSERT INTO `registration` VALUES (1,846913,'Node.JS_6','2017-09-22 08:24:59',1),(3,846913,'Chrome Development_5','2018-04-09 02:22:30',0),(4,846913,'Android Development_1','2018-04-09 02:23:42',0),(8,846913,'5ehjdnk,_7','2018-04-09 02:35:35',0),(12,846915,'5ehjdnk,_7','2018-04-12 19:11:58',0);
/*!40000 ALTER TABLE `registration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `role_name` varchar(20) DEFAULT NULL,
  `role_id` varchar(5) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES ('admin','r1'),('Co-ordinator','r2'),('standard user','r3');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  `password` varchar(20) NOT NULL,
  `email` varchar(40) NOT NULL,
  `mobile_no` bigint(20) NOT NULL,
  `photo` varchar(5000) DEFAULT NULL,
  `course` varchar(20) DEFAULT NULL,
  `branch` varchar(20) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `year` int(1) DEFAULT NULL,
  `gender` varchar(6) NOT NULL,
  `User_Timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isVerified` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `id_2` (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=846916 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (846913,'Prateek Agrawal','secret','prateek.agrawal1_me15@gla.ac.in',7464847884,'/static/user-photos/prateek.agrawal1_me15@gla.ac.in','B.Tech','Computer Science','1999-03-10',3,'male','2017-09-22 07:35:06','1'),(846914,'lekhraj singh','secretserey','lekhraj.singh_cs15@gla.ac.in',8456478456,'/static/images/userPhotoMale.jpg','B.Tech','Computer Science','1999-03-10',3,'male','2017-09-22 07:28:54','1'),(846915,'prateek agrawal','secret','prateek.agrawal_me15@gla.ac.in',7464847884,'/static/user-photos/prateek.agrawal_me15@gla.ac.in','B.Tech','comuter science','1999-03-10',3,'male','2018-03-21 20:17:37','1');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_role` (
  `id` bigint(20) unsigned DEFAULT NULL,
  `role_id` varchar(5) DEFAULT NULL,
  KEY `id` (`id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user` (`id`),
  CONSTRAINT `user_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (846913,'r3'),(846913,'r1'),(846914,'r3'),(846914,'r1'),(846914,'r2'),(846915,'r3'),(846915,'r1');
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-13  0:59:14
