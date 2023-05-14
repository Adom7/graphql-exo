-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : dim. 14 mai 2023 à 21:11
-- Version du serveur : 5.7.39
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `myefrei`
--

-- --------------------------------------------------------

--
-- Structure de la table `grade`
--

CREATE TABLE `grade` (
  `idgrade` int(11) NOT NULL,
  `result` float NOT NULL,
  `lesson_idlesson` int(11) NOT NULL,
  `student_idstudent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `lesson`
--

CREATE TABLE `lesson` (
  `idlesson` int(11) NOT NULL,
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `teacher_idteacher` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

CREATE TABLE `role` (
  `idrole` int(11) NOT NULL,
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `role`
--

INSERT INTO `role` (`idrole`, `name`) VALUES
(1, 'ROLE_STUDENT'),
(2, 'ROLE_TEACHER');

-- --------------------------------------------------------

--
-- Structure de la table `student`
--

CREATE TABLE `student` (
  `idstudent` int(11) NOT NULL,
  `user_iduser` int(11) NOT NULL,
  `ine` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `student`
--

INSERT INTO `student` (`idstudent`, `user_iduser`, `ine`) VALUES
(1, 10, 'fakeINE');

-- --------------------------------------------------------

--
-- Structure de la table `teacher`
--

CREATE TABLE `teacher` (
  `idteacher` int(11) NOT NULL,
  `user_iduser` int(11) NOT NULL,
  `isAgreement` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `iduser` int(11) NOT NULL,
  `lastname` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstname` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_idrole` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`iduser`, `lastname`, `firstname`, `email`, `password`, `role_idrole`) VALUES
(1, 'Jhon', 'Doe', 'JhonDoe@gmail.fr', '$2a$10$c5eqImayHqziZZq2MO9.KOHPs4z0hilcNaSw00DM80MkX2ffcfmDW', 1),
(10, 'OULD MOHAND', 'Adlane', 'AM@efrei.net', 'password', 1);

-- --------------------------------------------------------

--
-- Structure de la table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('47bbfb96-8790-480d-a568-079ab475b565', '2a2283a942e426c455a4d2bca68bbb7be2cbf6ba48e2ff9c11292621d75ce41b', '2023-04-30 14:00:49.146', '20230430140049_change_length_password', NULL, NULL, '2023-04-30 14:00:49.113', 1),
('cfacce36-03e7-4673-82c0-c82195089822', '168412495d0cdfc8020417639dcbed0e4778aceaa1ec7fc6b12e7927ff1c96db', '2023-04-30 14:00:36.029', '20230430140431_add_role_on_user', NULL, NULL, '2023-04-30 14:00:35.699', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `grade`
--
ALTER TABLE `grade`
  ADD PRIMARY KEY (`idgrade`),
  ADD UNIQUE KEY `idgrade_UNIQUE` (`idgrade`),
  ADD KEY `fk_grade_lesson1_idx` (`lesson_idlesson`),
  ADD KEY `fk_grade_student1_idx` (`student_idstudent`);

--
-- Index pour la table `lesson`
--
ALTER TABLE `lesson`
  ADD PRIMARY KEY (`idlesson`),
  ADD UNIQUE KEY `idlesson_UNIQUE` (`idlesson`),
  ADD KEY `fk_lesson_teacher1_idx` (`teacher_idteacher`);

--
-- Index pour la table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`idrole`),
  ADD UNIQUE KEY `idrole_UNIQUE` (`idrole`);

--
-- Index pour la table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`idstudent`),
  ADD UNIQUE KEY `idstudent_UNIQUE` (`idstudent`),
  ADD KEY `fk_student_user_idx` (`user_iduser`);

--
-- Index pour la table `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`idteacher`),
  ADD UNIQUE KEY `idteacher_UNIQUE` (`idteacher`),
  ADD KEY `fk_teacher_user1_idx` (`user_iduser`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`iduser`),
  ADD UNIQUE KEY `iduser_UNIQUE` (`iduser`),
  ADD UNIQUE KEY `email_UNIQUE` (`email`),
  ADD KEY `user_role_idrole_fkey` (`role_idrole`);

--
-- Index pour la table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `grade`
--
ALTER TABLE `grade`
  MODIFY `idgrade` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `lesson`
--
ALTER TABLE `lesson`
  MODIFY `idlesson` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `role`
--
ALTER TABLE `role`
  MODIFY `idrole` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `student`
--
ALTER TABLE `student`
  MODIFY `idstudent` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `teacher`
--
ALTER TABLE `teacher`
  MODIFY `idteacher` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `iduser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `grade`
--
ALTER TABLE `grade`
  ADD CONSTRAINT `fk_grade_lesson1` FOREIGN KEY (`lesson_idlesson`) REFERENCES `lesson` (`idlesson`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_grade_student1` FOREIGN KEY (`student_idstudent`) REFERENCES `student` (`idstudent`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `lesson`
--
ALTER TABLE `lesson`
  ADD CONSTRAINT `fk_lesson_teacher1` FOREIGN KEY (`teacher_idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `fk_student_user` FOREIGN KEY (`user_iduser`) REFERENCES `user` (`iduser`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `teacher`
--
ALTER TABLE `teacher`
  ADD CONSTRAINT `fk_teacher_user1` FOREIGN KEY (`user_iduser`) REFERENCES `user` (`iduser`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_role_idrole_fkey` FOREIGN KEY (`role_idrole`) REFERENCES `role` (`idrole`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
