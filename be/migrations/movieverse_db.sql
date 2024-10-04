-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 29, 2024 at 08:58 AM
-- Server version: 8.0.30
-- PHP Version: 8.2.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `movieverse_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `actor`
--

CREATE TABLE `actor` (
  `id` int NOT NULL,
  `name` text NOT NULL,
  `birthdate` timestamp NOT NULL,
  `countryId` text NOT NULL,
  `biography` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `award`
--

CREATE TABLE `award` (
  `id` int NOT NULL,
  `name` text NOT NULL,
  `year` int NOT NULL,
  `countryId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `award`
--

INSERT INTO `award` (`id`, `name`, `year`, `countryId`) VALUES
(1, 'award 1', 2023, 2);

-- --------------------------------------------------------

--
-- Table structure for table `country`
--

CREATE TABLE `country` (
  `countryId` int NOT NULL,
  `name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `country`
--

INSERT INTO `country` (`countryId`, `name`) VALUES
(2, 'bwi');

-- --------------------------------------------------------

--
-- Table structure for table `director`
--

CREATE TABLE `director` (
  `id` int NOT NULL,
  `name` text NOT NULL,
  `birthdate` timestamp NOT NULL,
  `countryId` text NOT NULL,
  `biography` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `episode`
--

CREATE TABLE `episode` (
  `id` int NOT NULL,
  `seasonId` int NOT NULL,
  `episode_number` int NOT NULL,
  `title` text NOT NULL,
  `synopsis` text NOT NULL,
  `release_date` timestamp NOT NULL,
  `poster_url` text NOT NULL,
  `trailer_url` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `genre`
--

CREATE TABLE `genre` (
  `id` int NOT NULL,
  `name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `movie`
--

CREATE TABLE `movie` (
  `id` int NOT NULL,
  `title` text NOT NULL,
  `rating` double NOT NULL,
  `directorId` int NOT NULL,
  `approval_status` tinyint(1) NOT NULL,
  `countryId` text NOT NULL,
  `release_date` timestamp NOT NULL,
  `synopsis` text NOT NULL,
  `poster_url` text NOT NULL,
  `trailer_url` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `moviereview`
--

CREATE TABLE `moviereview` (
  `id` int NOT NULL,
  `content` text NOT NULL,
  `rating` int NOT NULL,
  `movieId` int NOT NULL,
  `userId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `season`
--

CREATE TABLE `season` (
  `id` int NOT NULL,
  `seriesId` int NOT NULL,
  `season_number` int NOT NULL,
  `synopsis` text NOT NULL,
  `poster_url` text NOT NULL,
  `trailer_url` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `series`
--

CREATE TABLE `series` (
  `id` int NOT NULL,
  `title` text NOT NULL,
  `rating` double NOT NULL,
  `directorId` int NOT NULL,
  `approval_status` tinyint(1) NOT NULL,
  `countryId` text NOT NULL,
  `release_date` timestamp NOT NULL,
  `synopsis` text NOT NULL,
  `seasons` int NOT NULL,
  `episodes` int NOT NULL,
  `poster_url` text NOT NULL,
  `trailer_url` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seriesreview`
--

CREATE TABLE `seriesreview` (
  `id` int NOT NULL,
  `content` text NOT NULL,
  `rating` int NOT NULL,
  `seriesId` int NOT NULL,
  `userId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` bigint UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `username` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `role` text NOT NULL,
  `avatar_path` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `username`, `email`, `password`, `role`, `avatar_path`, `created_at`) VALUES
(1, 'zam', 'zam', 'zam@gmail.com', '$2b$10$Rz/GzTPK3iOrYJUyafqGfualtVucw6cZAw1wwDKxxlri/EjYO.Wly', 'admin', NULL, '2024-09-29 07:43:13');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_awardactors`
--

CREATE TABLE `_awardactors` (
  `A` int NOT NULL,
  `B` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_awarddirectors`
--

CREATE TABLE `_awarddirectors` (
  `A` int NOT NULL,
  `B` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_movieactors`
--

CREATE TABLE `_movieactors` (
  `A` int NOT NULL,
  `B` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_movieawards`
--

CREATE TABLE `_movieawards` (
  `A` int NOT NULL,
  `B` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_moviegenres`
--

CREATE TABLE `_moviegenres` (
  `A` int NOT NULL,
  `B` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_seriesactors`
--

CREATE TABLE `_seriesactors` (
  `A` int NOT NULL,
  `B` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_seriesawards`
--

CREATE TABLE `_seriesawards` (
  `A` int NOT NULL,
  `B` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_seriesgenres`
--

CREATE TABLE `_seriesgenres` (
  `A` int NOT NULL,
  `B` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `actor`
--
ALTER TABLE `actor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `award`
--
ALTER TABLE `award`
  ADD PRIMARY KEY (`id`),
  ADD KEY `countryId` (`countryId`);

--
-- Indexes for table `country`
--
ALTER TABLE `country`
  ADD PRIMARY KEY (`countryId`);

--
-- Indexes for table `director`
--
ALTER TABLE `director`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `episode`
--
ALTER TABLE `episode`
  ADD PRIMARY KEY (`id`),
  ADD KEY `seasonId` (`seasonId`);

--
-- Indexes for table `genre`
--
ALTER TABLE `genre`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `movie`
--
ALTER TABLE `movie`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `moviereview`
--
ALTER TABLE `moviereview`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `season`
--
ALTER TABLE `season`
  ADD PRIMARY KEY (`id`),
  ADD KEY `seriesId` (`seriesId`);

--
-- Indexes for table `series`
--
ALTER TABLE `series`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `seriesreview`
--
ALTER TABLE `seriesreview`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `_awardactors`
--
ALTER TABLE `_awardactors`
  ADD UNIQUE KEY `A` (`A`,`B`),
  ADD KEY `B` (`B`);

--
-- Indexes for table `_awarddirectors`
--
ALTER TABLE `_awarddirectors`
  ADD UNIQUE KEY `A` (`A`,`B`),
  ADD KEY `B` (`B`);

--
-- Indexes for table `_movieactors`
--
ALTER TABLE `_movieactors`
  ADD UNIQUE KEY `A` (`A`,`B`),
  ADD KEY `_MovieActors_B_index` (`B`);

--
-- Indexes for table `_movieawards`
--
ALTER TABLE `_movieawards`
  ADD UNIQUE KEY `A` (`A`,`B`),
  ADD KEY `B` (`B`);

--
-- Indexes for table `_moviegenres`
--
ALTER TABLE `_moviegenres`
  ADD UNIQUE KEY `A` (`A`,`B`),
  ADD KEY `_MovieGenres_B_index` (`B`);

--
-- Indexes for table `_seriesactors`
--
ALTER TABLE `_seriesactors`
  ADD UNIQUE KEY `A` (`A`,`B`),
  ADD KEY `_SeriesActors_B_index` (`B`);

--
-- Indexes for table `_seriesawards`
--
ALTER TABLE `_seriesawards`
  ADD UNIQUE KEY `A` (`A`,`B`),
  ADD KEY `B` (`B`);

--
-- Indexes for table `_seriesgenres`
--
ALTER TABLE `_seriesgenres`
  ADD UNIQUE KEY `A` (`A`,`B`),
  ADD KEY `_SeriesGenres_B_index` (`B`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `actor`
--
ALTER TABLE `actor`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `award`
--
ALTER TABLE `award`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `country`
--
ALTER TABLE `country`
  MODIFY `countryId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `director`
--
ALTER TABLE `director`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `episode`
--
ALTER TABLE `episode`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `genre`
--
ALTER TABLE `genre`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `movie`
--
ALTER TABLE `movie`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `moviereview`
--
ALTER TABLE `moviereview`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `season`
--
ALTER TABLE `season`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `series`
--
ALTER TABLE `series`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `seriesreview`
--
ALTER TABLE `seriesreview`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `award`
--
ALTER TABLE `award`
  ADD CONSTRAINT `award_ibfk_1` FOREIGN KEY (`countryId`) REFERENCES `country` (`countryId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `episode`
--
ALTER TABLE `episode`
  ADD CONSTRAINT `episode_ibfk_1` FOREIGN KEY (`seasonId`) REFERENCES `season` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `season`
--
ALTER TABLE `season`
  ADD CONSTRAINT `season_ibfk_1` FOREIGN KEY (`seriesId`) REFERENCES `series` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `_awardactors`
--
ALTER TABLE `_awardactors`
  ADD CONSTRAINT `_awardactors_ibfk_1` FOREIGN KEY (`A`) REFERENCES `award` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `_awardactors_ibfk_2` FOREIGN KEY (`B`) REFERENCES `actor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `_awarddirectors`
--
ALTER TABLE `_awarddirectors`
  ADD CONSTRAINT `_awarddirectors_ibfk_1` FOREIGN KEY (`A`) REFERENCES `award` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `_awarddirectors_ibfk_2` FOREIGN KEY (`B`) REFERENCES `director` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `_movieactors`
--
ALTER TABLE `_movieactors`
  ADD CONSTRAINT `_movieactors_ibfk_1` FOREIGN KEY (`A`) REFERENCES `actor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `_movieactors_ibfk_2` FOREIGN KEY (`B`) REFERENCES `movie` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `_movieawards`
--
ALTER TABLE `_movieawards`
  ADD CONSTRAINT `_movieawards_ibfk_1` FOREIGN KEY (`A`) REFERENCES `award` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `_movieawards_ibfk_2` FOREIGN KEY (`B`) REFERENCES `movie` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `_moviegenres`
--
ALTER TABLE `_moviegenres`
  ADD CONSTRAINT `_moviegenres_ibfk_1` FOREIGN KEY (`A`) REFERENCES `genre` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `_moviegenres_ibfk_2` FOREIGN KEY (`B`) REFERENCES `movie` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `_seriesactors`
--
ALTER TABLE `_seriesactors`
  ADD CONSTRAINT `_seriesactors_ibfk_1` FOREIGN KEY (`A`) REFERENCES `actor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `_seriesactors_ibfk_2` FOREIGN KEY (`B`) REFERENCES `series` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `_seriesawards`
--
ALTER TABLE `_seriesawards`
  ADD CONSTRAINT `_seriesawards_ibfk_1` FOREIGN KEY (`A`) REFERENCES `award` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `_seriesawards_ibfk_2` FOREIGN KEY (`B`) REFERENCES `series` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `_seriesgenres`
--
ALTER TABLE `_seriesgenres`
  ADD CONSTRAINT `_seriesgenres_ibfk_1` FOREIGN KEY (`A`) REFERENCES `genre` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `_seriesgenres_ibfk_2` FOREIGN KEY (`B`) REFERENCES `series` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
