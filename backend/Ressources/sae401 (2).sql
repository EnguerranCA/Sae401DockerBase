-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : sae-mysql
-- Généré le : jeu. 03 avr. 2025 à 06:41
-- Version du serveur : 8.4.4
-- Version de PHP : 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `sae401`
--

-- --------------------------------------------------------

--
-- Structure de la table `doctrine_migration_versions`
--

CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) COLLATE utf8mb3_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Déchargement des données de la table `doctrine_migration_versions`
--

INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES
('DoctrineMigrations\\Version20250314124228', '2025-03-26 07:31:38', 22),
('DoctrineMigrations\\Version20250319080122', '2025-03-26 07:31:38', 21),
('DoctrineMigrations\\Version20250319080256', '2025-03-26 07:35:55', 37),
('DoctrineMigrations\\Version20250319152632', '2025-03-26 07:35:55', 27),
('DoctrineMigrations\\Version20250326073132', '2025-03-26 07:40:03', 83),
('DoctrineMigrations\\Version20250327134531', '2025-03-27 13:47:52', 115),
('DoctrineMigrations\\Version20250328102334', '2025-03-28 10:24:28', 387),
('DoctrineMigrations\\Version20250401081913', '2025-04-01 08:19:24', 65),
('DoctrineMigrations\\Version20250401133751', '2025-04-01 13:38:02', 42);

-- --------------------------------------------------------

--
-- Structure de la table `post`
--

CREATE TABLE `post` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `content` varchar(280) COLLATE utf8mb3_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Déchargement des données de la table `post`
--

INSERT INTO `post` (`id`, `user_id`, `content`, `created_at`) VALUES
(1, 1, 'est ce que ça marche les tap in sur freds ?', '2025-03-26 07:42:55'),
(2, 3, 'Qui est dispo pour parler sur télégram ?', '2025-03-26 09:23:33'),
(3, 2, 'Yo estelle t\'es dispo ?', '2025-03-26 10:23:31'),
(4, 2, 'Bonjour', '2025-03-27 13:03:35'),
(5, 2, 'J\'adore tweet', '2025-03-27 13:03:42'),
(6, 2, 'Je teste de faire des posts', '2025-03-27 13:03:47'),
(7, 2, 'a', '2025-03-27 13:03:52'),
(8, 2, 'a', '2025-03-27 13:03:53'),
(9, 2, 'z', '2025-03-27 13:03:54'),
(10, 2, 'r', '2025-03-27 13:03:55'),
(11, 2, 'fds', '2025-03-27 13:04:02'),
(12, 2, 'f', '2025-03-27 13:04:03'),
(13, 2, 'dsdfqqfdsd', '2025-03-27 13:04:04'),
(14, 2, 'Test', '2025-03-27 13:25:06'),
(15, 2, 'Test', '2025-03-27 13:26:58'),
(16, 2, 'te', '2025-03-27 13:27:00'),
(17, 2, 'd', '2025-03-27 13:28:52'),
(18, 2, 'dfzef', '2025-03-27 13:30:02'),
(19, 2, 'dfzef', '2025-03-27 13:30:02'),
(20, 2, 'Yo', '2025-03-27 13:34:40'),
(27, 4, 'Bojour', '2025-03-31 12:04:26'),
(28, 4, 'Bonjour tout le monde', '2025-03-31 13:35:54'),
(29, 9, 'Bonjour', '2025-04-01 12:10:53'),
(30, 9, 'Bonjour je suis G', '2025-04-01 12:15:11'),
(31, 4, 'Yo bonjour tout le monde !', '2025-04-01 19:47:39');

-- --------------------------------------------------------

--
-- Structure de la table `post_user`
--

CREATE TABLE `post_user` (
  `post_id` int NOT NULL,
  `user_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Déchargement des données de la table `post_user`
--

INSERT INTO `post_user` (`post_id`, `user_id`) VALUES
(1, 1),
(1, 4),
(7, 2),
(8, 1),
(8, 3),
(17, 4),
(17, 9),
(18, 4),
(19, 4),
(19, 9),
(20, 4),
(27, 4),
(28, 9),
(29, 4),
(30, 4),
(30, 9);

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `email` varchar(180) COLLATE utf8mb3_unicode_ci NOT NULL,
  `roles` json NOT NULL,
  `password` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `avatar` varchar(128) COLLATE utf8mb3_unicode_ci NOT NULL,
  `username` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `api_token` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `verification_code` varchar(6) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL,
  `website` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `banner` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `bio` varchar(500) COLLATE utf8mb3_unicode_ci NOT NULL,
  `is_blocked` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `email`, `roles`, `password`, `avatar`, `username`, `name`, `api_token`, `verification_code`, `is_verified`, `website`, `location`, `banner`, `bio`, `is_blocked`) VALUES
(1, 'newemail@example.com', '[\"ROLE_USER\"]', '$2y$13$FwzNLw.1/yePsU3TXYWhIe1mxU4QjCiLHmZAZwEZ3v.THfKCDAIJa', '67ebdf05a81bb.jpg', 'gilian', 'New Name', 'f03c01fd91eca4acf51a5c0a499d27e8877c4d8f4b4c7b8c12b51ce281622766b2b2ed3009fbe9fa03d6f2ed455b2a3307f7225c24ad4a7e6c2ae709', NULL, 1, 'site.com', 'Chateauroux', '67ebe980b6ad7.jpg', 'Euh bonjour euh c\'est gilian euh', 0),
(2, 'admin@gmail.com', '[\"ROLE_ADMIN\"]', '$2y$13$ak7qspQy4Cgf5mgrmIJDoOmXAdfGhWcCtwNZ5156LGBLGDogSE7ia', 'default.jpg', 'admin', 'admin', '0507cbd82fa012531bf7bd283398cdc6edb7b8b65477906ead8ad4768264bcd961ccb6db35310ecdb72b3106c2f04614f0ca0a3ab9229a5cf62f9b98', NULL, 1, 'a', 'a', 'a', 'a', 0),
(3, 'estelle.guitard@gmail.com', '[\"ROLE_USER\"]', '$2y$13$1DfnJLEBqQQH.sbZX2Dl4uSonp2dWy08rGwZFsWoZQUCeguiVtxsq', 'default.jpg', 'estelle', 'Estelle', 'd12e96794ecd4a0ad2a5d834f6695393932ce87021f51ad4f519fba65e93e33f4f84bb17c5552cb2b4a6dd923d8ecae388417ed386a4953508b31a49', NULL, 1, '', '', '', '', NULL),
(4, 'a@a.a', '[\"ROLE_USER\"]', '$2y$13$FwzNLw.1/yePsU3TXYWhIe1mxU4QjCiLHmZAZwEZ3v.THfKCDAIJa', '67ec4349aff6e.jpg', 'a', 'a', '86238b934cec6f896275219d2800a787cb76c16bc5e14c49c1cd01678636c01c486c97259bd30ac8f443cf96e7098dce09bd4526d95c3b080c199062', NULL, 1, '', '', '67ec434e42e90.jpg', '', NULL),
(5, 'b@b.b', '[\"ROLE_USER\"]', '$2y$13$vG7MFwsCTFiUFpPyqe3UtOKBBEdjX/cT4XzA5WZ/OSPu/PKe4rw8e', 'default.jpg', 'b', 'b', '2daf83539d9c2bc1b5474624f81685bfe408647ddb911b7c44359466ce0cae986f58a7486efe0e2e19791255ce70f9f97140c3e270712884a3c7326b', NULL, 1, '', '', '', '', NULL),
(6, 'c@c.c', '[\"ROLE_USER\"]', '$2y$13$GHjKC..OwO28CxqflazqGuPPxefurdHGOA9xQOPNqIfcY18bZUbzS', 'default.jpg', 'c', 'c', '7eb4cf97c64f5725e0d0ae45f7ece7086419bf15ffaa67a74580228e7242eab68cae5949a3f43d467bdd402aacd7a8508e3bc21d22b4bc0a5ecb13da', '283357', 0, '', '', '', '', NULL),
(7, 'd@d.d', '[\"ROLE_USER\"]', '$2y$13$xg0Iyh5z2pQGXJ/.ooPqIue9nwfemA92BkxWGJ4zAfb1oaalAr4li', 'default.jpg', 'd', 'd', 'b630b7cac4106a7c5df6011286fd782754dfd8f2903ff07b7f0b2cab00f46284e29dc60585be1507047e22117837bfdd2ff7f12d66b3dcce80f55ca8', '213277', 0, '', '', '', '', NULL),
(8, 'e@e.e', '[\"ROLE_USER\"]', '$2y$13$Db4pH.YAZfBYxWTLi8RNpubCaqbxE2rrn.2sjoJ7bmzv5xRH7OhWW', 'default.jpg', 'e', 'e', '3303dce58c0fab681314f1165acf8b37e2c85d2087a616d7d71ad64da51eab939f1fe5fe711892861ad8db0898848bd3dfeb54547a1a1ceb0360b56a', '760153', 0, '', '', '', '', NULL),
(9, 'g@g.g', '[\"ROLE_USER\"]', '$2y$13$7zGQ.RUSWortFSAnsdSOgecSykeGpdlNVpKq.ZdHDZvNj1DCSM7Aa', '67ee2d5c27e30.jpg', 'g', 'g', 'e229ea4fd22b255985cd5199efba176b6d9f6f90012c199ebff4db2cb9d84a3c473413733e37bff041f192adb60a09cdc03b66fbe6ab8ce95f24993a', NULL, 1, '', '', '67ebeb8c9b7be.jpg', '', 0);

-- --------------------------------------------------------

--
-- Structure de la table `user_blocked`
--

CREATE TABLE `user_blocked` (
  `user_source` int NOT NULL,
  `user_target` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_followed`
--

CREATE TABLE `user_followed` (
  `user_source` int NOT NULL,
  `user_target` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Déchargement des données de la table `user_followed`
--

INSERT INTO `user_followed` (`user_source`, `user_target`) VALUES
(1, 4),
(4, 2),
(9, 9);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `doctrine_migration_versions`
--
ALTER TABLE `doctrine_migration_versions`
  ADD PRIMARY KEY (`version`);

--
-- Index pour la table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_5A8A6C8DA76ED395` (`user_id`);

--
-- Index pour la table `post_user`
--
ALTER TABLE `post_user`
  ADD PRIMARY KEY (`post_id`,`user_id`),
  ADD KEY `IDX_44C6B1424B89032C` (`post_id`),
  ADD KEY `IDX_44C6B142A76ED395` (`user_id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_IDENTIFIER_EMAIL` (`email`);

--
-- Index pour la table `user_blocked`
--
ALTER TABLE `user_blocked`
  ADD PRIMARY KEY (`user_source`,`user_target`),
  ADD KEY `IDX_8258F58A3AD8644E` (`user_source`),
  ADD KEY `IDX_8258F58A233D34C1` (`user_target`);

--
-- Index pour la table `user_followed`
--
ALTER TABLE `user_followed`
  ADD PRIMARY KEY (`user_source`,`user_target`),
  ADD KEY `IDX_AD8F58173AD8644E` (`user_source`),
  ADD KEY `IDX_AD8F5817233D34C1` (`user_target`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `post`
--
ALTER TABLE `post`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `FK_5A8A6C8DA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `post_user`
--
ALTER TABLE `post_user`
  ADD CONSTRAINT `FK_44C6B1424B89032C` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_44C6B142A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_blocked`
--
ALTER TABLE `user_blocked`
  ADD CONSTRAINT `FK_8258F58A233D34C1` FOREIGN KEY (`user_target`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_8258F58A3AD8644E` FOREIGN KEY (`user_source`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_followed`
--
ALTER TABLE `user_followed`
  ADD CONSTRAINT `FK_AD8F5817233D34C1` FOREIGN KEY (`user_target`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_AD8F58173AD8644E` FOREIGN KEY (`user_source`) REFERENCES `user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


-- Ajout de nouveaux posts
INSERT INTO `post` (`id`, `user_id`, `content`, `created_at`) VALUES
(32, 1, 'Hello world!', '2025-04-02 08:00:00'),
(33, 2, 'SQL is fun!', '2025-04-02 09:00:00'),
(34, 3, 'Learning new things every day.', '2025-04-02 10:00:00'),
(35, 4, 'Bonjour tout le monde!', '2025-04-02 11:00:00'),
(36, 5, 'This is a test post.', '2025-04-02 12:00:00');

-- Ajout de nouveaux follows
INSERT INTO `user_followed` (`user_source`, `user_target`) VALUES
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 1);

-- Ajout de nouveaux likes (simulés via la table `post_user`)
INSERT INTO `post_user` (`post_id`, `user_id`) VALUES
(32, 2),
(32, 3),
(33, 1),
(33, 4),
(34, 5),
(35, 1),
(35, 2),
(36, 3),
(36, 4);