-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 24, 2026 at 09:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `diu_hall_2`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `action` varchar(255) NOT NULL,
  `subject_type` varchar(255) DEFAULT NULL,
  `subject_id` bigint(20) UNSIGNED DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `subject_type`, `subject_id`, `old_values`, `new_values`, `ip_address`, `created_at`, `updated_at`) VALUES
(1, 4, 'logged in', 'user', 4, NULL, NULL, '127.0.0.1', '2026-07-22 06:37:06', '2026-07-22 06:37:06'),
(2, 3, 'logged in', 'user', 3, NULL, NULL, '127.0.0.1', '2026-07-22 06:37:55', '2026-07-22 06:37:55'),
(3, 3, 'recorded advance payment of 700 for Student User', 'payment', NULL, NULL, '{\"student_id\":\"1\",\"amount\":700,\"payment_method\":\"mobile_bkash\",\"paid_at\":\"2026-07-22\",\"notes\":\"Noted\"}', '127.0.0.1', '2026-07-22 06:38:38', '2026-07-22 06:38:38'),
(4, 3, 'recorded advance payment of 500 for Md. Ariful Islam', 'payment', NULL, NULL, '{\"student_id\":\"2\",\"amount\":500,\"payment_method\":\"cash\",\"paid_at\":\"2026-07-22\",\"notes\":\"none\"}', '127.0.0.1', '2026-07-22 06:59:47', '2026-07-22 06:59:47'),
(5, 3, 'recorded advance payment of 1600 for Jannatul Ferdous', 'payment', NULL, NULL, '{\"student_id\":\"11\",\"amount\":1600,\"payment_method\":\"cash\",\"paid_at\":\"2026-07-22\",\"notes\":\"Test Taka\"}', '127.0.0.1', '2026-07-22 07:06:15', '2026-07-22 07:06:15'),
(6, 5, 'logged in', 'user', 5, NULL, NULL, '127.0.0.1', '2026-07-22 07:50:53', '2026-07-22 07:50:53'),
(7, 7, 'logged in', 'user', 7, NULL, NULL, '127.0.0.1', '2026-07-22 07:51:25', '2026-07-22 07:51:25'),
(8, 6, 'logged in', 'user', 6, NULL, NULL, '127.0.0.1', '2026-07-22 07:52:09', '2026-07-22 07:52:09'),
(9, 3, 'published notice: Today Fix meal', 'notice', 2, NULL, '{\"title\":\"Today Fix meal\",\"content\":\"100 taka kore dite hobe\",\"target_role\":\"student\",\"published_by\":3}', '127.0.0.1', '2026-07-22 10:03:24', '2026-07-22 10:03:24'),
(10, 3, 'turned on lunch for Student User', 'meal_attendance', 654, NULL, '{\"student_id\":1,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 14:15:11', '2026-07-22 14:15:11'),
(11, 3, 'turned on dinner for Student User', 'meal_attendance', 655, NULL, '{\"student_id\":1,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 14:15:12', '2026-07-22 14:15:12'),
(12, 3, 'turned on lunch for Sadia Akter', 'meal_attendance', 656, NULL, '{\"student_id\":3,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 14:15:41', '2026-07-22 14:15:41'),
(13, 3, 'turned on lunch for Md. Hasan Ali', 'meal_attendance', 657, NULL, '{\"student_id\":4,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 17:23:04', '2026-07-22 17:23:04'),
(14, 3, 'turned on lunch for Rakib Hossain', 'meal_attendance', 628, NULL, '{\"student_id\":6,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 17:23:06', '2026-07-22 17:23:06'),
(15, 3, 'turned on lunch for Shahinur Rahman', 'meal_attendance', 635, NULL, '{\"student_id\":10,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 17:23:08', '2026-07-22 17:23:08'),
(16, 3, 'turned on dinner for Farzana Yeasmin', 'meal_attendance', 658, NULL, '{\"student_id\":9,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 17:23:11', '2026-07-22 17:23:11'),
(17, 3, 'turned off dinner for Farzana Yeasmin', 'meal_attendance', 658, NULL, '{\"student_id\":9,\"meal_type\":\"dinner\",\"action\":\"off\"}', '127.0.0.1', '2026-07-22 17:23:12', '2026-07-22 17:23:12'),
(18, 3, 'turned on dinner for Farzana Yeasmin', 'meal_attendance', 658, NULL, '{\"student_id\":9,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 17:23:13', '2026-07-22 17:23:13'),
(19, 3, 'turned on dinner for Jannatul Ferdous', 'meal_attendance', 659, NULL, '{\"student_id\":11,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 17:23:15', '2026-07-22 17:23:15'),
(20, 3, 'turned on dinner for Md. Sohel Rana', 'meal_attendance', 660, NULL, '{\"student_id\":12,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 17:23:17', '2026-07-22 17:23:17'),
(21, 3, 'turned on lunch for Khalid Hasan', 'meal_attendance', 661, NULL, '{\"student_id\":22,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 17:23:20', '2026-07-22 17:23:20'),
(22, 3, 'turned on lunch for Student User', 'meal_attendance', 662, NULL, '{\"student_id\":1,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:03:50', '2026-07-22 20:03:50'),
(23, 3, 'turned on dinner for Student User', 'meal_attendance', 663, NULL, '{\"student_id\":1,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:03:52', '2026-07-22 20:03:52'),
(24, 3, 'turned on lunch for Md. Ariful Islam', 'meal_attendance', 664, NULL, '{\"student_id\":2,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:03:53', '2026-07-22 20:03:53'),
(25, 3, 'turned on lunch for Nusrat Jahan', 'meal_attendance', 665, NULL, '{\"student_id\":5,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:03:54', '2026-07-22 20:03:54'),
(26, 3, 'turned on dinner for Nusrat Jahan', 'meal_attendance', 666, NULL, '{\"student_id\":5,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:03:56', '2026-07-22 20:03:56'),
(27, 3, 'turned on lunch for Rakib Hossain', 'meal_attendance', 667, NULL, '{\"student_id\":6,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:03:57', '2026-07-22 20:03:57'),
(28, 3, 'turned on lunch for Sadia Akter', 'meal_attendance', 668, NULL, '{\"student_id\":3,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:03:58', '2026-07-22 20:03:58'),
(29, 3, 'turned on dinner for Md. Kamrul Hasan', 'meal_attendance', 669, NULL, '{\"student_id\":8,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:03:59', '2026-07-22 20:03:59'),
(30, 3, 'turned on lunch for Farzana Yeasmin', 'meal_attendance', 670, NULL, '{\"student_id\":9,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:01', '2026-07-22 20:04:01'),
(31, 3, 'turned on lunch for Taslima Begum', 'meal_attendance', 671, NULL, '{\"student_id\":7,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:01', '2026-07-22 20:04:01'),
(32, 3, 'turned on lunch for Md. Sohel Rana', 'meal_attendance', 672, NULL, '{\"student_id\":12,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:03', '2026-07-22 20:04:03'),
(33, 3, 'turned on dinner for Jannatul Ferdous', 'meal_attendance', 673, NULL, '{\"student_id\":11,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:04', '2026-07-22 20:04:04'),
(34, 3, 'turned on lunch for Jannatul Ferdous', 'meal_attendance', 674, NULL, '{\"student_id\":11,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:05', '2026-07-22 20:04:05'),
(35, 3, 'turned on lunch for Tanvir Ahmed', 'meal_attendance', 675, NULL, '{\"student_id\":14,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:07', '2026-07-22 20:04:07'),
(36, 3, 'turned on dinner for Tanvir Ahmed', 'meal_attendance', 676, NULL, '{\"student_id\":14,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:07', '2026-07-22 20:04:07'),
(37, 3, 'turned on dinner for Mst. Sumaiya Khatun', 'meal_attendance', 677, NULL, '{\"student_id\":13,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:09', '2026-07-22 20:04:09'),
(38, 3, 'turned on dinner for Md. Jubayer Ali', 'meal_attendance', 678, NULL, '{\"student_id\":16,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:11', '2026-07-22 20:04:11'),
(39, 3, 'turned on lunch for Popy Rani Das', 'meal_attendance', 679, NULL, '{\"student_id\":17,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:12', '2026-07-22 20:04:12'),
(40, 3, 'turned on lunch for Md. Mehedi Hasan', 'meal_attendance', 680, NULL, '{\"student_id\":18,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:13', '2026-07-22 20:04:13'),
(41, 3, 'turned on lunch for Abu Sayeed', 'meal_attendance', 681, NULL, '{\"student_id\":20,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:14', '2026-07-22 20:04:14'),
(42, 3, 'turned on dinner for Khadiza Akter', 'meal_attendance', 682, NULL, '{\"student_id\":19,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:15', '2026-07-22 20:04:15'),
(43, 3, 'turned on lunch for Khadiza Akter', 'meal_attendance', 683, NULL, '{\"student_id\":19,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:16', '2026-07-22 20:04:16'),
(44, 3, 'turned on lunch for Mim Khatun', 'meal_attendance', 684, NULL, '{\"student_id\":21,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:18', '2026-07-22 20:04:18'),
(45, 3, 'turned on lunch for Khalid Hasan', 'meal_attendance', 685, NULL, '{\"student_id\":22,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:19', '2026-07-22 20:04:19'),
(46, 3, 'turned on dinner for Khalid Hasan', 'meal_attendance', 686, NULL, '{\"student_id\":22,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:21', '2026-07-22 20:04:21'),
(47, 3, 'turned on dinner for Rakib Hossain', 'meal_attendance', 687, NULL, '{\"student_id\":6,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:27', '2026-07-22 20:04:27'),
(48, 3, 'turned on dinner for Shahinur Rahman', 'meal_attendance', 688, NULL, '{\"student_id\":10,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-22 20:04:28', '2026-07-22 20:04:28'),
(49, 3, 'turned off lunch for Student User', 'meal_attendance', 662, NULL, '{\"student_id\":1,\"meal_type\":\"lunch\",\"action\":\"off\"}', '127.0.0.1', '2026-07-23 11:13:51', '2026-07-23 11:13:51'),
(50, 3, 'turned on lunch for Student User', 'meal_attendance', 662, NULL, '{\"student_id\":1,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 11:13:53', '2026-07-23 11:13:53'),
(51, 3, 'turned off dinner for Student User', 'meal_attendance', 663, NULL, '{\"student_id\":1,\"meal_type\":\"dinner\",\"action\":\"off\"}', '127.0.0.1', '2026-07-23 11:13:55', '2026-07-23 11:13:55'),
(52, 3, 'turned on dinner for Student User', 'meal_attendance', 663, NULL, '{\"student_id\":1,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 11:13:57', '2026-07-23 11:13:57'),
(53, 3, 'turned off lunch for Sadia Akter', 'meal_attendance', 668, NULL, '{\"student_id\":3,\"meal_type\":\"lunch\",\"action\":\"off\"}', '127.0.0.1', '2026-07-23 11:13:59', '2026-07-23 11:13:59'),
(54, 3, 'turned on lunch for Sadia Akter', 'meal_attendance', 668, NULL, '{\"student_id\":3,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 11:14:00', '2026-07-23 11:14:00'),
(55, 3, 'turned off lunch for Abu Sayeed', 'meal_attendance', 681, NULL, '{\"student_id\":20,\"meal_type\":\"lunch\",\"action\":\"off\"}', '127.0.0.1', '2026-07-23 11:14:09', '2026-07-23 11:14:09'),
(56, 3, 'turned on lunch for Abu Sayeed', 'meal_attendance', 681, NULL, '{\"student_id\":20,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 11:14:10', '2026-07-23 11:14:10'),
(57, 3, 'recorded advance payment of 700 for Taslima Begum', 'payment', NULL, NULL, '{\"student_id\":\"7\",\"amount\":700,\"payment_method\":\"cash\",\"paid_at\":\"2026-07-23\",\"notes\":null}', '127.0.0.1', '2026-07-23 11:14:51', '2026-07-23 11:14:51'),
(58, 3, 'turned on lunch for Student User', 'meal_attendance', 690, NULL, '{\"student_id\":1,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:22:46', '2026-07-23 20:22:46'),
(59, 3, 'turned on lunch for Md. Ariful Islam', 'meal_attendance', 691, NULL, '{\"student_id\":2,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:22:48', '2026-07-23 20:22:48'),
(60, 3, 'turned on lunch for Md. Hasan Ali', 'meal_attendance', 692, NULL, '{\"student_id\":4,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:22:49', '2026-07-23 20:22:49'),
(61, 3, 'turned on dinner for Student User', 'meal_attendance', 693, NULL, '{\"student_id\":1,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:22:50', '2026-07-23 20:22:50'),
(62, 3, 'turned on dinner for Md. Ariful Islam', 'meal_attendance', 694, NULL, '{\"student_id\":2,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:22:51', '2026-07-23 20:22:51'),
(63, 3, 'turned on lunch for Taslima Begum', 'meal_attendance', 695, NULL, '{\"student_id\":7,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:22:53', '2026-07-23 20:22:53'),
(64, 3, 'turned on lunch for Md. Kamrul Hasan', 'meal_attendance', 696, NULL, '{\"student_id\":8,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:22:54', '2026-07-23 20:22:54'),
(65, 3, 'turned on dinner for Md. Kamrul Hasan', 'meal_attendance', 697, NULL, '{\"student_id\":8,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:22:55', '2026-07-23 20:22:55'),
(66, 3, 'turned on dinner for Rakib Hossain', 'meal_attendance', 698, NULL, '{\"student_id\":6,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:22:55', '2026-07-23 20:22:55'),
(67, 3, 'turned on dinner for Shahinur Rahman', 'meal_attendance', 699, NULL, '{\"student_id\":10,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:22:56', '2026-07-23 20:22:56'),
(68, 3, 'turned on lunch for Farzana Yeasmin', 'meal_attendance', 700, NULL, '{\"student_id\":9,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:22:57', '2026-07-23 20:22:57'),
(69, 3, 'turned on dinner for Md. Sohel Rana', 'meal_attendance', 701, NULL, '{\"student_id\":12,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:22:59', '2026-07-23 20:22:59'),
(70, 3, 'turned on dinner for Mst. Sumaiya Khatun', 'meal_attendance', 702, NULL, '{\"student_id\":13,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:23:00', '2026-07-23 20:23:00'),
(71, 3, 'turned on lunch for Mst. Sumaiya Khatun', 'meal_attendance', 703, NULL, '{\"student_id\":13,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:23:00', '2026-07-23 20:23:00'),
(72, 3, 'turned on lunch for Md. Sohel Rana', 'meal_attendance', 704, NULL, '{\"student_id\":12,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:23:01', '2026-07-23 20:23:01'),
(73, 3, 'turned on lunch for Popy Rani Das', 'meal_attendance', 705, NULL, '{\"student_id\":17,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:23:04', '2026-07-23 20:23:04'),
(74, 3, 'turned on lunch for Md. Jubayer Ali', 'meal_attendance', 706, NULL, '{\"student_id\":16,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:23:05', '2026-07-23 20:23:05'),
(75, 3, 'turned on dinner for Sharmin Sultana', 'meal_attendance', 707, NULL, '{\"student_id\":15,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:23:06', '2026-07-23 20:23:06'),
(76, 3, 'turned on dinner for Tanvir Ahmed', 'meal_attendance', 708, NULL, '{\"student_id\":14,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:23:07', '2026-07-23 20:23:07'),
(77, 3, 'turned on lunch for Md. Mehedi Hasan', 'meal_attendance', 709, NULL, '{\"student_id\":18,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:23:08', '2026-07-23 20:23:08'),
(78, 3, 'turned on dinner for Md. Mehedi Hasan', 'meal_attendance', 710, NULL, '{\"student_id\":18,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:23:09', '2026-07-23 20:23:09'),
(79, 3, 'turned on dinner for Popy Rani Das', 'meal_attendance', 711, NULL, '{\"student_id\":17,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:23:10', '2026-07-23 20:23:10'),
(80, 3, 'turned on lunch for Abu Sayeed', 'meal_attendance', 712, NULL, '{\"student_id\":20,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:23:11', '2026-07-23 20:23:11'),
(81, 3, 'turned on dinner for Khalid Hasan', 'meal_attendance', 713, NULL, '{\"student_id\":22,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:23:13', '2026-07-23 20:23:13'),
(82, 3, 'turned on dinner for Abu Sayeed', 'meal_attendance', 714, NULL, '{\"student_id\":20,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:23:14', '2026-07-23 20:23:14'),
(83, 3, 'turned on lunch for Mim Khatun', 'meal_attendance', 715, NULL, '{\"student_id\":21,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:23:15', '2026-07-23 20:23:15'),
(84, 26, 'registered as student (Room 1st floor)', 'student', 23, NULL, '{\"name\":\"Nion\",\"email\":\"nion@gmail.com\",\"phone\":\"01799999999\",\"password\":\"nion2003\",\"room_number\":\"1st floor\",\"department\":\"CSE\",\"emergency_contact\":null}', '127.0.0.1', '2026-07-23 20:24:19', '2026-07-23 20:24:19'),
(85, 27, 'registered as student (Room 5th floor)', 'student', 24, NULL, '{\"name\":\"Sajib\",\"email\":\"sajib@gmail.com\",\"phone\":\"01811111111\",\"password\":\"sajib2003\",\"room_number\":\"5th floor\",\"department\":\"Civil\",\"emergency_contact\":null}', '127.0.0.1', '2026-07-23 20:34:44', '2026-07-23 20:34:44'),
(86, 2, 'logged in', 'user', 2, NULL, NULL, '127.0.0.1', '2026-07-23 20:44:33', '2026-07-23 20:44:33'),
(87, 2, 'approved student Sajib', 'student', 24, NULL, '{\"status\":\"approved\"}', '127.0.0.1', '2026-07-23 20:45:07', '2026-07-23 20:45:07'),
(88, 27, 'logged in', 'user', 27, NULL, NULL, '127.0.0.1', '2026-07-23 20:45:40', '2026-07-23 20:45:40'),
(89, 3, 'turned on lunch for Sajib', 'meal_attendance', 717, NULL, '{\"student_id\":24,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 20:47:00', '2026-07-23 20:47:00'),
(90, 3, 'turned off lunch for Sajib', 'meal_attendance', 717, NULL, '{\"student_id\":24,\"meal_type\":\"lunch\",\"action\":\"off\"}', '127.0.0.1', '2026-07-23 21:20:04', '2026-07-23 21:20:04'),
(91, 3, 'added expense other: Dishes (1200)', 'expense', 6, NULL, '{\"category\":\"other\",\"description\":\"Dishes\",\"amount\":1200,\"expense_date\":\"2026-07-24\",\"recorded_by\":3}', '127.0.0.1', '2026-07-23 21:44:25', '2026-07-23 21:44:25'),
(92, 3, 'recorded advance payment of 500 for Sajib', 'payment', NULL, NULL, '{\"student_id\":\"24\",\"amount\":500,\"payment_method\":\"cash\",\"paid_at\":\"2026-07-24\",\"notes\":\"no\"}', '127.0.0.1', '2026-07-23 21:54:35', '2026-07-23 21:54:35'),
(93, 4, 'logged in', 'user', 4, NULL, NULL, '127.0.0.1', '2026-07-23 21:58:53', '2026-07-23 21:58:53'),
(94, 23, 'logged in', 'user', 23, NULL, NULL, '127.0.0.1', '2026-07-23 22:28:13', '2026-07-23 22:28:13'),
(95, 3, 'turned on dinner for Abu Sayeed', 'meal_attendance', 714, NULL, '{\"student_id\":20,\"meal_type\":\"dinner\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 22:47:20', '2026-07-23 22:47:20'),
(96, 27, 'logged in', 'user', 27, NULL, NULL, '127.0.0.1', '2026-07-23 22:47:48', '2026-07-23 22:47:48'),
(97, 3, 'turned on lunch for Sajib', 'meal_attendance', 717, NULL, '{\"student_id\":24,\"meal_type\":\"lunch\",\"action\":\"on\"}', '127.0.0.1', '2026-07-23 22:48:13', '2026-07-23 22:48:13');

-- --------------------------------------------------------

--
-- Table structure for table `backups`
--

CREATE TABLE `backups` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `filename` varchar(255) NOT NULL,
  `size` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `daily_menus`
--

CREATE TABLE `daily_menus` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `meal_type` varchar(10) NOT NULL,
  `menu_text` text NOT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `daily_menus`
--

INSERT INTO `daily_menus` (`id`, `date`, `meal_type`, `menu_text`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '2026-07-01', 'lunch', 'amm jaam kathal', 3, '2026-07-21 23:24:10', '2026-07-23 21:48:09', NULL),
(2, '2026-07-01', 'dinner', 'Ruti, Mutton Rezala & Salad', 3, '2026-07-21 23:24:10', '2026-07-21 23:24:10', NULL),
(3, '2026-07-02', 'lunch', 'Rice, Chicken Curry, Dal & Salad', 3, '2026-07-21 23:24:10', '2026-07-21 23:24:10', NULL),
(4, '2026-07-02', 'dinner', 'Naan, Chicken Tikka Masala & Salad', 3, '2026-07-21 23:24:10', '2026-07-21 23:24:10', NULL),
(5, '2026-07-03', 'lunch', 'Rice, Chicken Curry, Dal & Salad', 3, '2026-07-21 23:24:10', '2026-07-21 23:24:10', NULL),
(6, '2026-07-03', 'dinner', 'Polao, Beef Kala Bhuna & Salad', 3, '2026-07-21 23:24:10', '2026-07-21 23:24:10', NULL),
(7, '2026-07-04', 'lunch', 'Rice, Dal, Aloo Bhaji & Begun Bhaja', 3, '2026-07-21 23:24:11', '2026-07-21 23:24:11', NULL),
(8, '2026-07-04', 'dinner', 'Ruti, Chicken Curry & Dal', 3, '2026-07-21 23:24:11', '2026-07-21 23:24:11', NULL),
(9, '2026-07-05', 'lunch', 'Rice, Murgir Jhol, Dal & Shukto', 3, '2026-07-21 23:24:11', '2026-07-21 23:24:11', NULL),
(10, '2026-07-05', 'dinner', 'Ruti, Chicken Curry & Dal', 3, '2026-07-21 23:24:11', '2026-07-21 23:24:11', NULL),
(11, '2026-07-06', 'lunch', 'Tehari with Beef & Salad', 3, '2026-07-21 23:24:11', '2026-07-21 23:24:11', NULL),
(12, '2026-07-06', 'dinner', 'Fried Rice, Chicken Manchurian & Soup', 3, '2026-07-21 23:24:11', '2026-07-21 23:24:11', NULL),
(13, '2026-07-07', 'lunch', 'Rice, Chicken Curry, Dal & Salad', 3, '2026-07-21 23:24:11', '2026-07-21 23:24:11', NULL),
(14, '2026-07-07', 'dinner', 'Paratha, Dal & Aloo Vorta', 3, '2026-07-21 23:24:11', '2026-07-21 23:24:11', NULL),
(15, '2026-07-08', 'lunch', 'Biryani with Borhani & Salad', 3, '2026-07-21 23:24:11', '2026-07-21 23:24:11', NULL),
(16, '2026-07-08', 'dinner', 'Fried Rice, Chicken Manchurian & Soup', 3, '2026-07-21 23:24:11', '2026-07-21 23:24:11', NULL),
(17, '2026-07-09', 'lunch', 'Rice, Chicken Curry, Dal & Salad', 3, '2026-07-21 23:24:11', '2026-07-21 23:24:11', NULL),
(18, '2026-07-09', 'dinner', 'Polao, Beef Kala Bhuna & Salad', 3, '2026-07-21 23:24:11', '2026-07-21 23:24:11', NULL),
(19, '2026-07-10', 'lunch', 'Rice, Beef Bhuna, Dal & Aloo Bhorta', 3, '2026-07-21 23:24:12', '2026-07-21 23:24:12', NULL),
(20, '2026-07-10', 'dinner', 'Roti, Beef Curry & Salad', 3, '2026-07-21 23:24:12', '2026-07-21 23:24:12', NULL),
(21, '2026-07-11', 'lunch', 'Rice, Fish Curry, Dal & Shobji', 3, '2026-07-21 23:24:12', '2026-07-21 23:24:12', NULL),
(22, '2026-07-11', 'dinner', 'Roti, Fish Curry & Vegetable', 3, '2026-07-21 23:24:12', '2026-07-21 23:24:12', NULL),
(23, '2026-07-12', 'lunch', 'Biryani with Borhani & Salad', 3, '2026-07-21 23:24:12', '2026-07-21 23:24:12', NULL),
(24, '2026-07-12', 'dinner', 'Polao, Beef Kala Bhuna & Salad', 3, '2026-07-21 23:24:12', '2026-07-21 23:24:12', NULL),
(25, '2026-07-13', 'lunch', 'Rice, Chicken Curry, Dal & Salad', 3, '2026-07-21 23:24:12', '2026-07-21 23:24:12', NULL),
(26, '2026-07-13', 'dinner', 'Biriyani, Salad & Raita', 3, '2026-07-21 23:24:12', '2026-07-21 23:24:12', NULL),
(27, '2026-07-14', 'lunch', 'Polao, Chicken Roast & Salad', 3, '2026-07-21 23:24:12', '2026-07-21 23:24:12', NULL),
(28, '2026-07-14', 'dinner', 'Polao, Beef Kala Bhuna & Salad', 3, '2026-07-21 23:24:12', '2026-07-21 23:24:12', NULL),
(29, '2026-07-15', 'lunch', 'Rice, Dal, Aloo Bhaji & Begun Bhaja', 3, '2026-07-21 23:24:12', '2026-07-21 23:24:12', NULL),
(30, '2026-07-15', 'dinner', 'Roti, Beef Curry & Salad', 3, '2026-07-21 23:24:12', '2026-07-21 23:24:12', NULL),
(31, '2026-07-16', 'lunch', 'Rice, Chicken Curry, Dal & Salad', 3, '2026-07-21 23:24:13', '2026-07-21 23:24:13', NULL),
(32, '2026-07-16', 'dinner', 'Biriyani, Salad & Raita', 3, '2026-07-21 23:24:13', '2026-07-21 23:24:13', NULL),
(33, '2026-07-17', 'lunch', 'Khichuri, Beef Curry & Tomato Achar', 3, '2026-07-21 23:24:13', '2026-07-21 23:24:13', NULL),
(34, '2026-07-17', 'dinner', 'Polao, Beef Kala Bhuna & Salad', 3, '2026-07-21 23:24:13', '2026-07-21 23:24:13', NULL),
(35, '2026-07-18', 'lunch', 'Khichuri, Beef Curry & Tomato Achar', 3, '2026-07-21 23:24:13', '2026-07-21 23:24:13', NULL),
(36, '2026-07-18', 'dinner', 'Khichuri, Dim Bhaji & Shobji', 3, '2026-07-21 23:24:13', '2026-07-21 23:24:13', NULL),
(37, '2026-07-19', 'lunch', 'Tehari with Beef & Salad', 3, '2026-07-21 23:24:13', '2026-07-21 23:24:13', NULL),
(38, '2026-07-19', 'dinner', 'Naan, Chicken Tikka Masala & Salad', 3, '2026-07-21 23:24:13', '2026-07-21 23:24:13', NULL),
(39, '2026-07-20', 'lunch', 'Rice, Chicken Curry, Dal & Salad', 3, '2026-07-21 23:24:13', '2026-07-21 23:24:13', NULL),
(40, '2026-07-20', 'dinner', 'Ruti, Mutton Rezala & Salad', 3, '2026-07-21 23:24:13', '2026-07-21 23:24:13', NULL),
(41, '2026-07-21', 'lunch', 'Rice, Dal, Aloo Bhaji & Begun Bhaja', 3, '2026-07-21 23:24:13', '2026-07-21 23:24:13', NULL),
(42, '2026-07-21', 'dinner', 'Fried Rice, Chicken Manchurian & Soup', 3, '2026-07-21 23:24:13', '2026-07-21 23:24:13', NULL),
(43, '2026-07-22', 'lunch', 'Rice, Dal, Aloo Bhaji & Begun Bhaja', 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(44, '2026-07-22', 'dinner', 'Biriyani, Salad & Raita', 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(45, '2026-07-23', 'lunch', 'Polao, Chicken Roast & Salad', 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(46, '2026-07-23', 'dinner', 'Roti, Beef Curry & Salad', 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(47, '2026-07-24', 'lunch', 'Biryani with Borhani & Salad', 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(48, '2026-07-24', 'dinner', 'Khichuri, Dim Bhaji & Shobji', 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(49, '2026-07-25', 'lunch', 'Rice, Beef Bhuna, Dal & Aloo Bhorta', 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(50, '2026-07-25', 'dinner', 'Roti, Beef Curry & Salad', 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(51, '2026-07-26', 'lunch', 'Tehari with Beef & Salad', 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(52, '2026-07-26', 'dinner', 'Naan, Chicken Tikka Masala & Salad', 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(53, '2026-07-27', 'lunch', 'Rice, Dal, Aloo Bhaji & Begun Bhaja', 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(54, '2026-07-27', 'dinner', 'Roti, Fish Curry & Vegetable', 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(55, '2026-07-28', 'lunch', 'Biryani with Borhani & Salad', 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(56, '2026-07-28', 'dinner', 'Ruti, Mutton Rezala & Salad', 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(57, '2026-07-29', 'lunch', 'Rice, Dal, Aloo Bhaji & Begun Bhaja', 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(58, '2026-07-29', 'dinner', 'Roti, Beef Curry & Salad', 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(59, '2026-07-30', 'lunch', 'Morog polaw', 3, '2026-07-21 23:24:14', '2026-07-23 21:46:59', NULL),
(60, '2026-07-30', 'dinner', 'panta vat', 3, '2026-07-21 23:24:14', '2026-07-23 21:45:30', NULL),
(61, '2026-07-31', 'lunch', 'Dim polaw', 3, '2026-07-21 23:24:14', '2026-07-23 21:47:16', NULL),
(62, '2026-07-31', 'dinner', 'Ruti, Daal, Dim', 3, '2026-07-21 23:24:14', '2026-07-23 21:46:24', NULL),
(64, '2026-08-01', 'lunch', 'Kacchi', 3, '2026-07-23 20:51:38', '2026-07-23 20:51:38', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category` varchar(30) NOT NULL,
  `description` text NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `expense_date` date NOT NULL,
  `vendor` varchar(255) DEFAULT NULL,
  `receipt_image` varchar(255) DEFAULT NULL,
  `recorded_by` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `category`, `description`, `amount`, `expense_date`, `vendor`, `receipt_image`, `recorded_by`, `status`, `approved_by`, `approved_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'food', 'Weekly market purchase — rice, dal, vegetables', 3600.00, '2026-07-02', NULL, NULL, 3, 'approved', 2, '2026-07-01 18:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10', NULL),
(2, 'food', 'Chicken and beef from Kawran Bazar', 1900.00, '2026-07-09', NULL, NULL, 3, 'approved', 2, '2026-07-08 18:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10', NULL),
(3, 'food', 'Cooking oil, spices & condiments', 4000.00, '2026-07-16', NULL, NULL, 3, 'approved', 2, '2026-07-15 18:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10', NULL),
(4, 'food', 'Bulk rice, dal, and cooking oil purchase for 2026-07', 5460.00, '2026-07-19', NULL, NULL, 3, 'approved', 2, '2026-07-17 23:24:10', '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(5, 'food', 'Fish, Rice, Dal', 1200.00, '2026-07-22', NULL, NULL, 3, 'pending', NULL, NULL, '2026-07-22 05:51:30', '2026-07-22 05:51:30', NULL),
(6, 'other', 'Dishes', 1200.00, '2026-07-24', NULL, NULL, 3, 'pending', NULL, NULL, '2026-07-23 21:44:25', '2026-07-23 21:44:25', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `meal_attendance`
--

CREATE TABLE `meal_attendance` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `daily_menu_id` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'booked',
  `marked_by` bigint(20) UNSIGNED DEFAULT NULL,
  `marked_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `meal_attendance`
--

INSERT INTO `meal_attendance` (`id`, `student_id`, `daily_menu_id`, `status`, `marked_by`, `marked_at`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 'attended', 3, '2026-07-01 13:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(2, 2, 2, 'attended', 3, '2026-07-01 03:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(3, 3, 2, 'attended', 3, '2026-07-01 03:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(4, 4, 1, 'attended', 3, '2026-07-01 10:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(5, 4, 2, 'cancelled', 3, '2026-07-01 02:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(6, 5, 1, 'attended', 3, '2026-07-01 14:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(7, 5, 2, 'attended', 3, '2026-07-01 07:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(8, 6, 1, 'attended', 3, '2026-07-01 06:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(9, 6, 2, 'attended', 3, '2026-07-01 06:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(10, 7, 1, 'attended', 3, '2026-07-01 04:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(11, 7, 2, 'attended', 3, '2026-07-01 03:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(12, 8, 1, 'attended', 3, '2026-07-01 10:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(13, 8, 2, 'attended', 3, '2026-07-01 05:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(14, 9, 1, 'attended', 3, '2026-07-01 14:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(15, 9, 2, 'attended', 3, '2026-07-01 02:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(16, 10, 2, 'attended', 3, '2026-07-01 04:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(17, 12, 1, 'attended', 3, '2026-07-01 13:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(18, 12, 2, 'attended', 3, '2026-07-01 09:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(19, 13, 1, 'attended', 3, '2026-07-01 14:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(20, 14, 1, 'attended', 3, '2026-07-01 11:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(21, 15, 1, 'cancelled', 3, '2026-07-01 08:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(22, 16, 1, 'attended', 3, '2026-07-01 08:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(23, 17, 1, 'attended', 3, '2026-07-01 06:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(24, 17, 2, 'attended', 3, '2026-07-01 13:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(25, 18, 1, 'attended', 3, '2026-07-01 03:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(26, 19, 1, 'attended', 3, '2026-07-01 02:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(27, 19, 2, 'attended', 3, '2026-07-01 03:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(28, 20, 2, 'attended', 3, '2026-07-01 09:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(29, 21, 1, 'attended', 3, '2026-07-01 10:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(30, 21, 2, 'attended', 3, '2026-07-01 08:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(31, 3, 4, 'cancelled', 3, '2026-07-02 03:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(32, 4, 3, 'attended', 3, '2026-07-02 11:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(33, 4, 4, 'attended', 3, '2026-07-02 04:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(34, 5, 3, 'attended', 3, '2026-07-02 02:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(35, 6, 3, 'attended', 3, '2026-07-02 13:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(36, 6, 4, 'attended', 3, '2026-07-02 05:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(37, 7, 4, 'cancelled', 3, '2026-07-02 08:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(38, 8, 3, 'cancelled', 3, '2026-07-02 10:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(39, 8, 4, 'attended', 3, '2026-07-02 08:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(40, 9, 3, 'cancelled', 3, '2026-07-02 10:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(41, 9, 4, 'cancelled', 3, '2026-07-02 13:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(42, 10, 3, 'cancelled', 3, '2026-07-02 07:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(43, 10, 4, 'attended', 3, '2026-07-02 11:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(44, 11, 3, 'cancelled', 3, '2026-07-02 13:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(45, 11, 4, 'attended', 3, '2026-07-02 08:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(46, 12, 3, 'attended', 3, '2026-07-02 10:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(47, 12, 4, 'attended', 3, '2026-07-02 13:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(48, 13, 3, 'attended', 3, '2026-07-02 07:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(49, 13, 4, 'attended', 3, '2026-07-02 02:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(50, 14, 3, 'attended', 3, '2026-07-02 08:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(51, 14, 4, 'attended', 3, '2026-07-02 07:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(52, 15, 3, 'attended', 3, '2026-07-02 07:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(53, 15, 4, 'attended', 3, '2026-07-02 07:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(54, 16, 3, 'attended', 3, '2026-07-02 07:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(55, 16, 4, 'attended', 3, '2026-07-02 13:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(56, 17, 4, 'attended', 3, '2026-07-02 13:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(57, 18, 3, 'attended', 3, '2026-07-02 04:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(58, 19, 3, 'cancelled', 3, '2026-07-02 07:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(59, 20, 3, 'attended', 3, '2026-07-02 07:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(60, 20, 4, 'cancelled', 3, '2026-07-02 09:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(61, 21, 3, 'attended', 3, '2026-07-02 12:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(62, 21, 4, 'attended', 3, '2026-07-02 07:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(63, 2, 5, 'attended', 3, '2026-07-03 09:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(64, 3, 5, 'cancelled', 3, '2026-07-03 13:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(65, 3, 6, 'attended', 3, '2026-07-03 14:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(66, 4, 5, 'attended', 3, '2026-07-03 14:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(67, 4, 6, 'attended', 3, '2026-07-03 05:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(68, 5, 5, 'attended', 3, '2026-07-03 04:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(69, 6, 6, 'attended', 3, '2026-07-03 11:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(70, 7, 5, 'attended', 3, '2026-07-03 04:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(71, 7, 6, 'cancelled', 3, '2026-07-03 03:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(72, 8, 5, 'attended', 3, '2026-07-03 05:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(73, 8, 6, 'attended', 3, '2026-07-03 07:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(74, 9, 5, 'cancelled', 3, '2026-07-03 08:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(75, 9, 6, 'cancelled', 3, '2026-07-03 05:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(76, 10, 5, 'cancelled', 3, '2026-07-03 12:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(77, 10, 6, 'cancelled', 3, '2026-07-03 06:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(78, 11, 5, 'attended', 3, '2026-07-03 09:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(79, 11, 6, 'attended', 3, '2026-07-03 05:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(80, 12, 6, 'attended', 3, '2026-07-03 13:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(81, 13, 6, 'attended', 3, '2026-07-03 08:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(82, 14, 5, 'attended', 3, '2026-07-03 05:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(83, 14, 6, 'attended', 3, '2026-07-03 04:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(84, 15, 6, 'cancelled', 3, '2026-07-03 14:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(85, 16, 5, 'attended', 3, '2026-07-03 13:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(86, 16, 6, 'cancelled', 3, '2026-07-03 12:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(87, 17, 5, 'attended', 3, '2026-07-03 09:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(88, 17, 6, 'attended', 3, '2026-07-03 10:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(89, 19, 5, 'cancelled', 3, '2026-07-03 12:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(90, 19, 6, 'cancelled', 3, '2026-07-03 05:00:00', '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(91, 20, 5, 'attended', 3, '2026-07-03 02:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(92, 21, 5, 'attended', 3, '2026-07-03 12:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(93, 21, 6, 'cancelled', 3, '2026-07-03 03:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(94, 2, 7, 'attended', 3, '2026-07-04 11:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(95, 2, 8, 'cancelled', 3, '2026-07-04 02:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(96, 3, 7, 'attended', 3, '2026-07-04 14:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(97, 4, 8, 'attended', 3, '2026-07-04 11:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(98, 5, 7, 'cancelled', 3, '2026-07-04 09:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(99, 6, 7, 'attended', 3, '2026-07-04 03:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(100, 7, 7, 'attended', 3, '2026-07-04 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(101, 7, 8, 'attended', 3, '2026-07-04 13:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(102, 8, 7, 'attended', 3, '2026-07-04 03:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(103, 9, 7, 'attended', 3, '2026-07-04 08:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(104, 9, 8, 'attended', 3, '2026-07-04 03:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(105, 10, 7, 'attended', 3, '2026-07-04 03:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(106, 10, 8, 'attended', 3, '2026-07-04 06:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(107, 11, 7, 'attended', 3, '2026-07-04 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(108, 12, 7, 'attended', 3, '2026-07-04 11:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(109, 13, 7, 'attended', 3, '2026-07-04 11:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(110, 13, 8, 'attended', 3, '2026-07-04 14:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(111, 14, 7, 'attended', 3, '2026-07-04 14:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(112, 14, 8, 'cancelled', 3, '2026-07-04 10:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(113, 15, 7, 'attended', 3, '2026-07-04 10:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(114, 15, 8, 'attended', 3, '2026-07-04 06:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(115, 16, 7, 'attended', 3, '2026-07-04 11:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(116, 18, 7, 'attended', 3, '2026-07-04 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(117, 18, 8, 'attended', 3, '2026-07-04 09:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(118, 19, 7, 'attended', 3, '2026-07-04 13:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(119, 20, 7, 'attended', 3, '2026-07-04 09:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(120, 20, 8, 'attended', 3, '2026-07-04 13:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(121, 21, 8, 'attended', 3, '2026-07-04 13:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(122, 2, 9, 'cancelled', 3, '2026-07-05 13:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(123, 2, 10, 'attended', 3, '2026-07-05 13:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(124, 3, 9, 'attended', 3, '2026-07-05 11:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(125, 3, 10, 'cancelled', 3, '2026-07-05 07:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(126, 4, 9, 'attended', 3, '2026-07-05 08:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(127, 5, 9, 'attended', 3, '2026-07-05 02:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(128, 5, 10, 'attended', 3, '2026-07-05 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(129, 6, 9, 'attended', 3, '2026-07-05 14:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(130, 6, 10, 'attended', 3, '2026-07-05 10:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(131, 7, 9, 'cancelled', 3, '2026-07-05 02:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(132, 7, 10, 'attended', 3, '2026-07-05 06:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(133, 8, 9, 'attended', 3, '2026-07-05 14:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(134, 9, 9, 'attended', 3, '2026-07-05 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(135, 10, 10, 'attended', 3, '2026-07-05 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(136, 11, 10, 'attended', 3, '2026-07-05 14:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(137, 12, 9, 'attended', 3, '2026-07-05 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(138, 13, 9, 'attended', 3, '2026-07-05 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(139, 14, 9, 'attended', 3, '2026-07-05 12:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(140, 14, 10, 'cancelled', 3, '2026-07-05 12:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(141, 15, 10, 'attended', 3, '2026-07-05 03:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(142, 16, 9, 'attended', 3, '2026-07-05 09:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(143, 16, 10, 'attended', 3, '2026-07-05 14:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(144, 18, 10, 'cancelled', 3, '2026-07-05 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(145, 19, 10, 'attended', 3, '2026-07-05 12:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(146, 20, 9, 'attended', 3, '2026-07-05 06:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(147, 21, 10, 'attended', 3, '2026-07-05 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(148, 2, 12, 'attended', 3, '2026-07-06 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(149, 3, 11, 'cancelled', 3, '2026-07-06 14:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(150, 3, 12, 'attended', 3, '2026-07-06 05:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(151, 4, 11, 'attended', 3, '2026-07-06 08:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(152, 5, 11, 'attended', 3, '2026-07-06 05:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(153, 7, 11, 'attended', 3, '2026-07-06 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(154, 8, 12, 'attended', 3, '2026-07-06 11:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(155, 9, 12, 'cancelled', 3, '2026-07-06 03:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(156, 10, 11, 'attended', 3, '2026-07-06 07:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(157, 10, 12, 'attended', 3, '2026-07-06 02:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(158, 11, 12, 'attended', 3, '2026-07-06 07:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(159, 12, 12, 'cancelled', 3, '2026-07-06 09:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(160, 14, 11, 'attended', 3, '2026-07-06 09:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(161, 14, 12, 'attended', 3, '2026-07-06 09:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(162, 15, 11, 'attended', 3, '2026-07-06 10:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(163, 15, 12, 'cancelled', 3, '2026-07-06 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(164, 16, 11, 'attended', 3, '2026-07-06 13:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(165, 16, 12, 'attended', 3, '2026-07-06 08:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(166, 17, 11, 'attended', 3, '2026-07-06 02:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(167, 17, 12, 'attended', 3, '2026-07-06 12:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(168, 18, 11, 'attended', 3, '2026-07-06 13:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(169, 19, 11, 'attended', 3, '2026-07-06 12:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(170, 19, 12, 'cancelled', 3, '2026-07-06 09:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(171, 20, 11, 'cancelled', 3, '2026-07-06 12:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(172, 20, 12, 'attended', 3, '2026-07-06 02:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(173, 21, 11, 'attended', 3, '2026-07-06 09:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(174, 21, 12, 'attended', 3, '2026-07-06 05:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(175, 2, 13, 'attended', 3, '2026-07-07 02:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(176, 2, 14, 'attended', 3, '2026-07-07 14:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(177, 3, 14, 'attended', 3, '2026-07-07 08:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(178, 4, 13, 'attended', 3, '2026-07-07 02:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(179, 4, 14, 'attended', 3, '2026-07-07 06:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(180, 5, 13, 'attended', 3, '2026-07-07 06:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(181, 6, 13, 'attended', 3, '2026-07-07 05:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(182, 7, 13, 'attended', 3, '2026-07-07 03:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(183, 7, 14, 'cancelled', 3, '2026-07-07 03:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(184, 8, 13, 'cancelled', 3, '2026-07-07 09:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(185, 8, 14, 'attended', 3, '2026-07-07 02:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(186, 9, 13, 'attended', 3, '2026-07-07 10:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(187, 9, 14, 'cancelled', 3, '2026-07-07 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(188, 10, 13, 'attended', 3, '2026-07-07 07:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(189, 11, 14, 'attended', 3, '2026-07-07 07:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(190, 12, 13, 'attended', 3, '2026-07-07 02:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(191, 13, 13, 'attended', 3, '2026-07-07 08:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(192, 13, 14, 'attended', 3, '2026-07-07 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(193, 14, 14, 'cancelled', 3, '2026-07-07 12:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(194, 15, 13, 'attended', 3, '2026-07-07 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(195, 15, 14, 'attended', 3, '2026-07-07 06:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(196, 16, 14, 'attended', 3, '2026-07-07 11:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(197, 17, 13, 'attended', 3, '2026-07-07 09:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(198, 18, 13, 'attended', 3, '2026-07-07 13:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(199, 18, 14, 'attended', 3, '2026-07-07 10:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(200, 19, 13, 'attended', 3, '2026-07-07 02:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(201, 19, 14, 'cancelled', 3, '2026-07-07 07:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(202, 20, 13, 'cancelled', 3, '2026-07-07 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(203, 20, 14, 'attended', 3, '2026-07-07 07:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(204, 21, 13, 'attended', 3, '2026-07-07 12:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(205, 21, 14, 'attended', 3, '2026-07-07 11:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(206, 2, 15, 'cancelled', 3, '2026-07-08 07:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(207, 2, 16, 'attended', 3, '2026-07-08 11:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(208, 3, 15, 'attended', 3, '2026-07-08 03:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(209, 4, 15, 'cancelled', 3, '2026-07-08 05:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(210, 4, 16, 'attended', 3, '2026-07-08 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(211, 5, 15, 'attended', 3, '2026-07-08 10:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(212, 7, 15, 'attended', 3, '2026-07-08 03:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(213, 8, 15, 'attended', 3, '2026-07-08 05:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(214, 8, 16, 'cancelled', 3, '2026-07-08 12:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(215, 10, 15, 'attended', 3, '2026-07-08 10:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(216, 11, 15, 'attended', 3, '2026-07-08 09:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(217, 11, 16, 'attended', 3, '2026-07-08 12:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(218, 12, 15, 'attended', 3, '2026-07-08 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(219, 12, 16, 'attended', 3, '2026-07-08 05:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(220, 13, 15, 'cancelled', 3, '2026-07-08 10:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(221, 13, 16, 'cancelled', 3, '2026-07-08 12:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(222, 14, 15, 'cancelled', 3, '2026-07-08 02:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(223, 14, 16, 'attended', 3, '2026-07-08 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(224, 15, 15, 'attended', 3, '2026-07-08 09:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(225, 15, 16, 'attended', 3, '2026-07-08 05:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(226, 16, 15, 'attended', 3, '2026-07-08 03:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(227, 17, 15, 'attended', 3, '2026-07-08 13:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(228, 17, 16, 'cancelled', 3, '2026-07-08 06:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(229, 18, 15, 'attended', 3, '2026-07-08 03:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(230, 18, 16, 'cancelled', 3, '2026-07-08 05:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(231, 19, 15, 'attended', 3, '2026-07-08 09:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(232, 21, 15, 'attended', 3, '2026-07-08 07:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(233, 21, 16, 'attended', 3, '2026-07-08 03:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(234, 2, 17, 'cancelled', 3, '2026-07-09 13:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(235, 3, 17, 'attended', 3, '2026-07-09 05:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(236, 3, 18, 'attended', 3, '2026-07-09 04:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(237, 4, 17, 'attended', 3, '2026-07-09 03:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(238, 4, 18, 'attended', 3, '2026-07-09 09:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(239, 5, 17, 'attended', 3, '2026-07-09 02:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(240, 5, 18, 'attended', 3, '2026-07-09 02:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(241, 6, 17, 'attended', 3, '2026-07-09 10:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(242, 6, 18, 'attended', 3, '2026-07-09 05:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(243, 7, 18, 'attended', 3, '2026-07-09 13:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(244, 8, 17, 'attended', 3, '2026-07-09 07:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(245, 8, 18, 'attended', 3, '2026-07-09 09:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(246, 9, 18, 'attended', 3, '2026-07-09 12:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(247, 10, 17, 'attended', 3, '2026-07-09 03:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(248, 11, 17, 'attended', 3, '2026-07-09 10:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(249, 11, 18, 'cancelled', 3, '2026-07-09 03:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(250, 12, 17, 'attended', 3, '2026-07-09 03:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(251, 12, 18, 'attended', 3, '2026-07-09 06:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(252, 13, 17, 'cancelled', 3, '2026-07-09 13:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(253, 14, 18, 'attended', 3, '2026-07-09 14:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(254, 15, 17, 'attended', 3, '2026-07-09 02:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(255, 15, 18, 'attended', 3, '2026-07-09 14:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(256, 16, 17, 'attended', 3, '2026-07-09 08:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(257, 16, 18, 'cancelled', 3, '2026-07-09 11:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(258, 17, 17, 'cancelled', 3, '2026-07-09 07:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(259, 18, 17, 'attended', 3, '2026-07-09 05:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(260, 18, 18, 'cancelled', 3, '2026-07-09 14:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(261, 19, 17, 'attended', 3, '2026-07-09 09:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(262, 20, 17, 'attended', 3, '2026-07-09 11:00:00', '2026-07-21 23:24:11', '2026-07-21 23:24:11'),
(263, 20, 18, 'attended', 3, '2026-07-09 13:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(264, 21, 17, 'cancelled', 3, '2026-07-09 02:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(265, 2, 19, 'cancelled', 3, '2026-07-10 13:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(266, 3, 20, 'attended', 3, '2026-07-10 11:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(267, 4, 19, 'attended', 3, '2026-07-10 05:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(268, 4, 20, 'attended', 3, '2026-07-10 14:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(269, 5, 19, 'attended', 3, '2026-07-10 14:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(270, 6, 19, 'attended', 3, '2026-07-10 12:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(271, 8, 19, 'attended', 3, '2026-07-10 12:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(272, 9, 19, 'attended', 3, '2026-07-10 05:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(273, 9, 20, 'attended', 3, '2026-07-10 13:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(274, 10, 19, 'cancelled', 3, '2026-07-10 09:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(275, 10, 20, 'cancelled', 3, '2026-07-10 03:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(276, 11, 20, 'attended', 3, '2026-07-10 14:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(277, 12, 19, 'attended', 3, '2026-07-10 11:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(278, 12, 20, 'attended', 3, '2026-07-10 04:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(279, 13, 19, 'attended', 3, '2026-07-10 07:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(280, 13, 20, 'attended', 3, '2026-07-10 14:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(281, 14, 20, 'attended', 3, '2026-07-10 14:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(282, 15, 19, 'attended', 3, '2026-07-10 11:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(283, 15, 20, 'attended', 3, '2026-07-10 13:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(284, 16, 19, 'attended', 3, '2026-07-10 02:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(285, 17, 19, 'attended', 3, '2026-07-10 04:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(286, 17, 20, 'attended', 3, '2026-07-10 09:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(287, 18, 20, 'attended', 3, '2026-07-10 02:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(288, 19, 19, 'attended', 3, '2026-07-10 14:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(289, 20, 19, 'attended', 3, '2026-07-10 12:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(290, 20, 20, 'attended', 3, '2026-07-10 09:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(291, 21, 19, 'attended', 3, '2026-07-10 02:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(292, 21, 20, 'attended', 3, '2026-07-10 05:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(293, 2, 21, 'attended', 3, '2026-07-11 11:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(294, 2, 22, 'attended', 3, '2026-07-11 03:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(295, 3, 21, 'cancelled', 3, '2026-07-11 14:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(296, 3, 22, 'attended', 3, '2026-07-11 12:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(297, 4, 22, 'attended', 3, '2026-07-11 14:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(298, 5, 21, 'attended', 3, '2026-07-11 08:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(299, 5, 22, 'attended', 3, '2026-07-11 02:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(300, 6, 21, 'attended', 3, '2026-07-11 02:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(301, 6, 22, 'attended', 3, '2026-07-11 04:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(302, 7, 21, 'attended', 3, '2026-07-11 03:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(303, 7, 22, 'attended', 3, '2026-07-11 02:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(304, 8, 21, 'attended', 3, '2026-07-11 02:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(305, 10, 21, 'attended', 3, '2026-07-11 11:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(306, 10, 22, 'cancelled', 3, '2026-07-11 06:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(307, 11, 22, 'attended', 3, '2026-07-11 11:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(308, 12, 21, 'attended', 3, '2026-07-11 07:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(309, 13, 21, 'attended', 3, '2026-07-11 08:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(310, 14, 21, 'cancelled', 3, '2026-07-11 11:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(311, 14, 22, 'attended', 3, '2026-07-11 10:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(312, 15, 21, 'attended', 3, '2026-07-11 07:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(313, 15, 22, 'attended', 3, '2026-07-11 11:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(314, 16, 21, 'attended', 3, '2026-07-11 06:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(315, 16, 22, 'attended', 3, '2026-07-11 04:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(316, 17, 21, 'attended', 3, '2026-07-11 02:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(317, 18, 21, 'cancelled', 3, '2026-07-11 07:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(318, 18, 22, 'attended', 3, '2026-07-11 12:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(319, 19, 21, 'cancelled', 3, '2026-07-11 09:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(320, 19, 22, 'attended', 3, '2026-07-11 05:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(321, 20, 22, 'cancelled', 3, '2026-07-11 05:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(322, 21, 21, 'attended', 3, '2026-07-11 10:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(323, 21, 22, 'attended', 3, '2026-07-11 05:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(324, 3, 23, 'attended', 3, '2026-07-12 12:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(325, 3, 24, 'cancelled', 3, '2026-07-12 10:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(326, 4, 23, 'attended', 3, '2026-07-12 13:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(327, 5, 23, 'cancelled', 3, '2026-07-12 10:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(328, 5, 24, 'attended', 3, '2026-07-12 09:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(329, 6, 23, 'cancelled', 3, '2026-07-12 08:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(330, 6, 24, 'cancelled', 3, '2026-07-12 05:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(331, 7, 23, 'attended', 3, '2026-07-12 12:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(332, 7, 24, 'attended', 3, '2026-07-12 12:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(333, 9, 23, 'attended', 3, '2026-07-12 04:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(334, 9, 24, 'attended', 3, '2026-07-12 12:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(335, 11, 23, 'attended', 3, '2026-07-12 12:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(336, 11, 24, 'attended', 3, '2026-07-12 10:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(337, 12, 24, 'attended', 3, '2026-07-12 07:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(338, 13, 23, 'attended', 3, '2026-07-12 04:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(339, 13, 24, 'attended', 3, '2026-07-12 10:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(340, 14, 23, 'attended', 3, '2026-07-12 09:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(341, 14, 24, 'attended', 3, '2026-07-12 03:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(342, 15, 23, 'cancelled', 3, '2026-07-12 08:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(343, 15, 24, 'cancelled', 3, '2026-07-12 04:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(344, 16, 24, 'attended', 3, '2026-07-12 13:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(345, 17, 23, 'attended', 3, '2026-07-12 02:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(346, 17, 24, 'attended', 3, '2026-07-12 05:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(347, 18, 23, 'attended', 3, '2026-07-12 03:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(348, 18, 24, 'attended', 3, '2026-07-12 07:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(349, 19, 24, 'attended', 3, '2026-07-12 12:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(350, 20, 23, 'attended', 3, '2026-07-12 14:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(351, 20, 24, 'attended', 3, '2026-07-12 06:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(352, 21, 23, 'attended', 3, '2026-07-12 08:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(353, 21, 24, 'cancelled', 3, '2026-07-12 13:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(354, 2, 25, 'attended', 3, '2026-07-13 02:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(355, 3, 26, 'cancelled', 3, '2026-07-13 10:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(356, 4, 25, 'attended', 3, '2026-07-13 07:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(357, 4, 26, 'attended', 3, '2026-07-13 03:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(358, 5, 25, 'attended', 3, '2026-07-13 02:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(359, 5, 26, 'attended', 3, '2026-07-13 07:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(360, 6, 25, 'attended', 3, '2026-07-13 07:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(361, 7, 25, 'attended', 3, '2026-07-13 09:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(362, 7, 26, 'attended', 3, '2026-07-13 05:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(363, 8, 25, 'cancelled', 3, '2026-07-13 13:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(364, 8, 26, 'cancelled', 3, '2026-07-13 08:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(365, 9, 26, 'attended', 3, '2026-07-13 12:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(366, 10, 25, 'attended', 3, '2026-07-13 11:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(367, 10, 26, 'attended', 3, '2026-07-13 13:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(368, 12, 25, 'cancelled', 3, '2026-07-13 07:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(369, 12, 26, 'attended', 3, '2026-07-13 03:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(370, 13, 25, 'attended', 3, '2026-07-13 03:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(371, 13, 26, 'attended', 3, '2026-07-13 05:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(372, 14, 25, 'attended', 3, '2026-07-13 05:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(373, 14, 26, 'attended', 3, '2026-07-13 08:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(374, 15, 26, 'attended', 3, '2026-07-13 14:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(375, 16, 25, 'attended', 3, '2026-07-13 12:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(376, 16, 26, 'cancelled', 3, '2026-07-13 03:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(377, 17, 25, 'attended', 3, '2026-07-13 13:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(378, 17, 26, 'attended', 3, '2026-07-13 10:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(379, 18, 25, 'attended', 3, '2026-07-13 11:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(380, 18, 26, 'attended', 3, '2026-07-13 09:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(381, 19, 25, 'cancelled', 3, '2026-07-13 08:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(382, 19, 26, 'attended', 3, '2026-07-13 02:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(383, 20, 25, 'attended', 3, '2026-07-13 04:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(384, 20, 26, 'attended', 3, '2026-07-13 03:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(385, 21, 25, 'attended', 3, '2026-07-13 13:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(386, 2, 27, 'attended', 3, '2026-07-14 04:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(387, 2, 28, 'cancelled', 3, '2026-07-14 03:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(388, 3, 27, 'cancelled', 3, '2026-07-14 10:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(389, 4, 27, 'cancelled', 3, '2026-07-14 06:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(390, 4, 28, 'attended', 3, '2026-07-14 02:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(391, 5, 27, 'attended', 3, '2026-07-14 12:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(392, 5, 28, 'attended', 3, '2026-07-14 06:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(393, 6, 27, 'cancelled', 3, '2026-07-14 09:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(394, 6, 28, 'attended', 3, '2026-07-14 08:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(395, 7, 28, 'attended', 3, '2026-07-14 10:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(396, 8, 27, 'attended', 3, '2026-07-14 05:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(397, 9, 27, 'attended', 3, '2026-07-14 07:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(398, 9, 28, 'attended', 3, '2026-07-14 06:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(399, 10, 28, 'attended', 3, '2026-07-14 07:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(400, 11, 27, 'attended', 3, '2026-07-14 05:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(401, 12, 28, 'attended', 3, '2026-07-14 13:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(402, 13, 27, 'attended', 3, '2026-07-14 03:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(403, 13, 28, 'attended', 3, '2026-07-14 14:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(404, 14, 27, 'attended', 3, '2026-07-14 10:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(405, 14, 28, 'attended', 3, '2026-07-14 12:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(406, 15, 27, 'cancelled', 3, '2026-07-14 09:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(407, 16, 27, 'cancelled', 3, '2026-07-14 13:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(408, 17, 27, 'attended', 3, '2026-07-14 09:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(409, 17, 28, 'attended', 3, '2026-07-14 11:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(410, 18, 28, 'attended', 3, '2026-07-14 04:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(411, 19, 27, 'attended', 3, '2026-07-14 14:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(412, 20, 27, 'attended', 3, '2026-07-14 13:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(413, 20, 28, 'attended', 3, '2026-07-14 12:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(414, 21, 27, 'attended', 3, '2026-07-14 13:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(415, 21, 28, 'attended', 3, '2026-07-14 07:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(416, 2, 29, 'attended', 3, '2026-07-15 10:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(417, 2, 30, 'attended', 3, '2026-07-15 02:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(418, 3, 30, 'attended', 3, '2026-07-15 08:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(419, 4, 29, 'attended', 3, '2026-07-15 04:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(420, 4, 30, 'attended', 3, '2026-07-15 10:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(421, 5, 29, 'attended', 3, '2026-07-15 03:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(422, 6, 29, 'attended', 3, '2026-07-15 05:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(423, 6, 30, 'cancelled', 3, '2026-07-15 09:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(424, 7, 29, 'attended', 3, '2026-07-15 11:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(425, 7, 30, 'attended', 3, '2026-07-15 02:00:00', '2026-07-21 23:24:12', '2026-07-21 23:24:12'),
(426, 9, 29, 'attended', 3, '2026-07-15 10:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(427, 9, 30, 'attended', 3, '2026-07-15 14:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(428, 10, 29, 'attended', 3, '2026-07-15 02:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(429, 10, 30, 'attended', 3, '2026-07-15 13:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(430, 11, 29, 'cancelled', 3, '2026-07-15 13:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(431, 11, 30, 'attended', 3, '2026-07-15 14:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(432, 12, 30, 'cancelled', 3, '2026-07-15 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(433, 13, 29, 'attended', 3, '2026-07-15 06:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(434, 13, 30, 'attended', 3, '2026-07-15 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(435, 14, 30, 'attended', 3, '2026-07-15 13:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(436, 15, 29, 'attended', 3, '2026-07-15 12:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(437, 16, 29, 'attended', 3, '2026-07-15 05:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(438, 16, 30, 'cancelled', 3, '2026-07-15 13:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(439, 17, 29, 'attended', 3, '2026-07-15 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(440, 17, 30, 'attended', 3, '2026-07-15 13:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(441, 19, 29, 'attended', 3, '2026-07-15 10:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(442, 19, 30, 'attended', 3, '2026-07-15 07:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(443, 20, 29, 'attended', 3, '2026-07-15 05:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(444, 21, 29, 'attended', 3, '2026-07-15 11:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(445, 21, 30, 'attended', 3, '2026-07-15 02:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(446, 2, 31, 'attended', 3, '2026-07-16 13:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(447, 2, 32, 'attended', 3, '2026-07-16 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(448, 5, 31, 'attended', 3, '2026-07-16 12:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(449, 6, 31, 'attended', 3, '2026-07-16 10:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(450, 7, 31, 'attended', 3, '2026-07-16 08:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(451, 7, 32, 'attended', 3, '2026-07-16 08:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(452, 8, 31, 'attended', 3, '2026-07-16 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(453, 8, 32, 'attended', 3, '2026-07-16 04:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(454, 9, 31, 'cancelled', 3, '2026-07-16 08:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(455, 9, 32, 'attended', 3, '2026-07-16 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(456, 10, 32, 'attended', 3, '2026-07-16 09:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(457, 11, 31, 'attended', 3, '2026-07-16 02:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(458, 12, 31, 'attended', 3, '2026-07-16 09:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(459, 12, 32, 'attended', 3, '2026-07-16 10:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(460, 13, 31, 'attended', 3, '2026-07-16 07:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(461, 13, 32, 'attended', 3, '2026-07-16 11:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(462, 14, 31, 'attended', 3, '2026-07-16 14:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(463, 14, 32, 'attended', 3, '2026-07-16 08:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(464, 15, 31, 'cancelled', 3, '2026-07-16 13:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(465, 15, 32, 'attended', 3, '2026-07-16 07:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(466, 16, 31, 'attended', 3, '2026-07-16 09:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(467, 16, 32, 'cancelled', 3, '2026-07-16 02:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(468, 17, 31, 'attended', 3, '2026-07-16 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(469, 17, 32, 'attended', 3, '2026-07-16 12:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(470, 18, 32, 'attended', 3, '2026-07-16 05:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(471, 19, 32, 'attended', 3, '2026-07-16 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(472, 20, 31, 'attended', 3, '2026-07-16 05:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(473, 20, 32, 'attended', 3, '2026-07-16 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(474, 21, 32, 'attended', 3, '2026-07-16 09:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(475, 2, 33, 'cancelled', 3, '2026-07-17 09:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(476, 2, 34, 'attended', 3, '2026-07-17 14:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(477, 3, 33, 'attended', 3, '2026-07-17 05:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(478, 3, 34, 'attended', 3, '2026-07-17 14:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(479, 4, 34, 'attended', 3, '2026-07-17 05:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(480, 5, 33, 'attended', 3, '2026-07-17 10:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(481, 5, 34, 'attended', 3, '2026-07-17 09:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(482, 6, 33, 'cancelled', 3, '2026-07-17 10:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(483, 6, 34, 'cancelled', 3, '2026-07-17 12:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(484, 7, 33, 'attended', 3, '2026-07-17 11:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(485, 8, 33, 'attended', 3, '2026-07-17 09:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(486, 8, 34, 'attended', 3, '2026-07-17 12:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(487, 9, 34, 'cancelled', 3, '2026-07-17 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(488, 10, 34, 'attended', 3, '2026-07-17 13:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(489, 11, 33, 'attended', 3, '2026-07-17 14:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(490, 11, 34, 'attended', 3, '2026-07-17 04:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(491, 12, 33, 'attended', 3, '2026-07-17 07:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(492, 12, 34, 'cancelled', 3, '2026-07-17 14:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(493, 13, 33, 'attended', 3, '2026-07-17 13:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(494, 13, 34, 'attended', 3, '2026-07-17 10:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(495, 14, 33, 'attended', 3, '2026-07-17 12:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(496, 14, 34, 'attended', 3, '2026-07-17 04:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(497, 15, 33, 'attended', 3, '2026-07-17 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(498, 15, 34, 'attended', 3, '2026-07-17 10:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(499, 16, 34, 'attended', 3, '2026-07-17 06:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(500, 17, 33, 'attended', 3, '2026-07-17 10:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(501, 17, 34, 'attended', 3, '2026-07-17 06:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(502, 18, 33, 'attended', 3, '2026-07-17 02:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(503, 18, 34, 'attended', 3, '2026-07-17 07:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(504, 19, 33, 'attended', 3, '2026-07-17 14:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(505, 19, 34, 'cancelled', 3, '2026-07-17 10:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(506, 20, 33, 'attended', 3, '2026-07-17 08:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(507, 20, 34, 'attended', 3, '2026-07-17 02:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(508, 21, 33, 'attended', 3, '2026-07-17 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(509, 21, 34, 'attended', 3, '2026-07-17 08:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(510, 2, 36, 'attended', 3, '2026-07-18 07:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(511, 3, 35, 'attended', 3, '2026-07-18 05:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(512, 3, 36, 'attended', 3, '2026-07-18 02:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(513, 4, 35, 'cancelled', 3, '2026-07-18 12:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(514, 4, 36, 'cancelled', 3, '2026-07-18 04:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(515, 5, 35, 'attended', 3, '2026-07-18 09:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(516, 5, 36, 'attended', 3, '2026-07-18 05:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(517, 6, 35, 'attended', 3, '2026-07-18 04:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13');
INSERT INTO `meal_attendance` (`id`, `student_id`, `daily_menu_id`, `status`, `marked_by`, `marked_at`, `created_at`, `updated_at`) VALUES
(518, 6, 36, 'attended', 3, '2026-07-18 12:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(519, 7, 35, 'cancelled', 3, '2026-07-18 11:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(520, 9, 35, 'attended', 3, '2026-07-18 08:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(521, 9, 36, 'attended', 3, '2026-07-18 06:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(522, 10, 35, 'attended', 3, '2026-07-18 04:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(523, 11, 36, 'cancelled', 3, '2026-07-18 12:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(524, 13, 35, 'attended', 3, '2026-07-18 02:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(525, 14, 35, 'attended', 3, '2026-07-18 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(526, 15, 35, 'attended', 3, '2026-07-18 06:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(527, 16, 35, 'attended', 3, '2026-07-18 13:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(528, 16, 36, 'cancelled', 3, '2026-07-18 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(529, 17, 36, 'attended', 3, '2026-07-18 14:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(530, 18, 35, 'attended', 3, '2026-07-18 14:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(531, 19, 35, 'cancelled', 3, '2026-07-18 06:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(532, 19, 36, 'attended', 3, '2026-07-18 13:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(533, 20, 36, 'attended', 3, '2026-07-18 12:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(534, 21, 35, 'cancelled', 3, '2026-07-18 12:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(535, 2, 37, 'attended', 3, '2026-07-19 11:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(536, 2, 38, 'attended', 3, '2026-07-19 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(537, 3, 37, 'cancelled', 3, '2026-07-19 02:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(538, 4, 37, 'attended', 3, '2026-07-19 10:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(539, 5, 38, 'attended', 3, '2026-07-19 06:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(540, 6, 37, 'attended', 3, '2026-07-19 07:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(541, 7, 37, 'attended', 3, '2026-07-19 04:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(542, 8, 37, 'attended', 3, '2026-07-19 04:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(543, 8, 38, 'attended', 3, '2026-07-19 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(544, 9, 37, 'attended', 3, '2026-07-19 08:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(545, 9, 38, 'attended', 3, '2026-07-19 02:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(546, 10, 37, 'attended', 3, '2026-07-19 09:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(547, 10, 38, 'attended', 3, '2026-07-19 02:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(548, 11, 37, 'attended', 3, '2026-07-19 10:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(549, 11, 38, 'attended', 3, '2026-07-19 11:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(550, 12, 37, 'cancelled', 3, '2026-07-19 12:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(551, 12, 38, 'cancelled', 3, '2026-07-19 09:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(552, 13, 38, 'attended', 3, '2026-07-19 09:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(553, 14, 37, 'attended', 3, '2026-07-19 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(554, 15, 37, 'attended', 3, '2026-07-19 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(555, 16, 37, 'attended', 3, '2026-07-19 14:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(556, 16, 38, 'attended', 3, '2026-07-19 04:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(557, 17, 37, 'cancelled', 3, '2026-07-19 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(558, 18, 38, 'attended', 3, '2026-07-19 10:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(559, 19, 37, 'attended', 3, '2026-07-19 11:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(560, 20, 37, 'cancelled', 3, '2026-07-19 05:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(561, 20, 38, 'attended', 3, '2026-07-19 12:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(562, 21, 37, 'attended', 3, '2026-07-19 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(563, 2, 39, 'cancelled', 3, '2026-07-20 06:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(564, 2, 40, 'attended', 3, '2026-07-20 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(565, 3, 39, 'attended', 3, '2026-07-20 14:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(566, 3, 40, 'attended', 3, '2026-07-20 06:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(567, 4, 39, 'attended', 3, '2026-07-20 14:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(568, 4, 40, 'attended', 3, '2026-07-20 09:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(569, 5, 39, 'attended', 3, '2026-07-20 12:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(570, 5, 40, 'cancelled', 3, '2026-07-20 04:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(571, 6, 40, 'attended', 3, '2026-07-20 12:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(572, 7, 39, 'attended', 3, '2026-07-20 04:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(573, 7, 40, 'attended', 3, '2026-07-20 02:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(574, 8, 40, 'attended', 3, '2026-07-20 12:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(575, 9, 40, 'attended', 3, '2026-07-20 12:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(576, 10, 39, 'attended', 3, '2026-07-20 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(577, 10, 40, 'attended', 3, '2026-07-20 11:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(578, 11, 39, 'attended', 3, '2026-07-20 14:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(579, 11, 40, 'attended', 3, '2026-07-20 10:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(580, 12, 39, 'attended', 3, '2026-07-20 03:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(581, 15, 40, 'attended', 3, '2026-07-20 07:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(582, 16, 39, 'cancelled', 3, '2026-07-20 05:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(583, 16, 40, 'attended', 3, '2026-07-20 08:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(584, 17, 39, 'attended', 3, '2026-07-20 09:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(585, 17, 40, 'attended', 3, '2026-07-20 04:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(586, 18, 39, 'attended', 3, '2026-07-20 07:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(587, 19, 39, 'cancelled', 3, '2026-07-20 14:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(588, 20, 39, 'attended', 3, '2026-07-20 06:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(589, 20, 40, 'attended', 3, '2026-07-20 02:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(590, 21, 39, 'attended', 3, '2026-07-20 05:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(591, 21, 40, 'attended', 3, '2026-07-20 02:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(592, 2, 42, 'attended', 3, '2026-07-21 10:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(593, 3, 42, 'attended', 3, '2026-07-21 13:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(594, 4, 42, 'attended', 3, '2026-07-21 07:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(595, 5, 41, 'attended', 3, '2026-07-21 07:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(596, 6, 41, 'attended', 3, '2026-07-21 09:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(597, 6, 42, 'attended', 3, '2026-07-21 09:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(598, 7, 41, 'attended', 3, '2026-07-21 14:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(599, 8, 41, 'attended', 3, '2026-07-21 13:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(600, 9, 42, 'attended', 3, '2026-07-21 06:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(601, 10, 41, 'attended', 3, '2026-07-21 05:00:00', '2026-07-21 23:24:13', '2026-07-21 23:24:13'),
(602, 10, 42, 'cancelled', 3, '2026-07-21 04:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(603, 11, 41, 'attended', 3, '2026-07-21 10:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(604, 11, 42, 'cancelled', 3, '2026-07-21 05:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(605, 12, 41, 'attended', 3, '2026-07-21 14:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(606, 12, 42, 'cancelled', 3, '2026-07-21 07:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(607, 13, 41, 'attended', 3, '2026-07-21 10:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(608, 13, 42, 'attended', 3, '2026-07-21 06:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(609, 14, 41, 'attended', 3, '2026-07-21 13:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(610, 14, 42, 'attended', 3, '2026-07-21 02:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(611, 15, 41, 'cancelled', 3, '2026-07-21 04:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(612, 15, 42, 'attended', 3, '2026-07-21 07:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(613, 16, 42, 'cancelled', 3, '2026-07-21 07:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(614, 17, 41, 'attended', 3, '2026-07-21 13:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(615, 18, 41, 'attended', 3, '2026-07-21 04:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(616, 18, 42, 'attended', 3, '2026-07-21 08:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(617, 19, 41, 'cancelled', 3, '2026-07-21 09:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(618, 19, 42, 'cancelled', 3, '2026-07-21 09:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(619, 20, 42, 'attended', 3, '2026-07-21 03:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(620, 21, 41, 'attended', 3, '2026-07-21 08:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(621, 21, 42, 'attended', 3, '2026-07-21 05:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(622, 2, 43, 'attended', 3, '2026-07-22 12:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(623, 2, 44, 'attended', 3, '2026-07-22 07:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(624, 3, 44, 'attended', 3, '2026-07-22 11:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(625, 4, 44, 'attended', 3, '2026-07-22 10:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(626, 5, 43, 'attended', 3, '2026-07-22 11:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(627, 5, 44, 'attended', 3, '2026-07-22 13:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(628, 6, 43, 'booked', 3, '2026-07-22 08:00:00', '2026-07-21 23:24:14', '2026-07-22 17:23:06'),
(629, 6, 44, 'attended', 3, '2026-07-22 05:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(630, 7, 43, 'attended', 3, '2026-07-22 14:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(631, 7, 44, 'attended', 3, '2026-07-22 14:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(632, 8, 43, 'attended', 3, '2026-07-22 03:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(633, 8, 44, 'attended', 3, '2026-07-22 14:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(634, 9, 43, 'attended', 3, '2026-07-22 12:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(635, 10, 43, 'booked', 3, '2026-07-22 03:00:00', '2026-07-21 23:24:14', '2026-07-22 17:23:08'),
(636, 10, 44, 'attended', 3, '2026-07-22 06:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(637, 11, 43, 'attended', 3, '2026-07-22 08:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(638, 12, 43, 'cancelled', 3, '2026-07-22 10:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(639, 13, 43, 'attended', 3, '2026-07-22 14:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(640, 13, 44, 'attended', 3, '2026-07-22 14:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(641, 14, 44, 'attended', 3, '2026-07-22 03:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(642, 15, 43, 'attended', 3, '2026-07-22 10:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(643, 15, 44, 'attended', 3, '2026-07-22 11:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(644, 16, 43, 'attended', 3, '2026-07-22 04:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(645, 16, 44, 'attended', 3, '2026-07-22 05:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(646, 17, 43, 'attended', 3, '2026-07-22 11:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(647, 17, 44, 'attended', 3, '2026-07-22 10:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(648, 18, 43, 'attended', 3, '2026-07-22 10:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(649, 18, 44, 'attended', 3, '2026-07-22 10:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(650, 19, 44, 'attended', 3, '2026-07-22 13:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(651, 20, 43, 'attended', 3, '2026-07-22 06:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(652, 20, 44, 'cancelled', 3, '2026-07-22 14:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(653, 21, 44, 'attended', 3, '2026-07-22 06:00:00', '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(654, 1, 43, 'booked', NULL, NULL, '2026-07-22 14:15:11', '2026-07-22 14:15:11'),
(655, 1, 44, 'booked', NULL, NULL, '2026-07-22 14:15:12', '2026-07-22 14:15:12'),
(656, 3, 43, 'booked', NULL, NULL, '2026-07-22 14:15:41', '2026-07-22 14:15:41'),
(657, 4, 43, 'booked', NULL, NULL, '2026-07-22 17:23:04', '2026-07-22 17:23:04'),
(658, 9, 44, 'booked', NULL, NULL, '2026-07-22 17:23:11', '2026-07-22 17:23:13'),
(659, 11, 44, 'booked', NULL, NULL, '2026-07-22 17:23:15', '2026-07-22 17:23:15'),
(660, 12, 44, 'booked', NULL, NULL, '2026-07-22 17:23:17', '2026-07-22 17:23:17'),
(661, 22, 43, 'booked', NULL, NULL, '2026-07-22 17:23:20', '2026-07-22 17:23:20'),
(662, 1, 45, 'booked', NULL, NULL, '2026-07-22 20:03:50', '2026-07-23 11:13:53'),
(663, 1, 46, 'booked', NULL, NULL, '2026-07-22 20:03:52', '2026-07-23 11:13:57'),
(664, 2, 45, 'booked', NULL, NULL, '2026-07-22 20:03:53', '2026-07-22 20:03:53'),
(665, 5, 45, 'booked', NULL, NULL, '2026-07-22 20:03:54', '2026-07-22 20:03:54'),
(666, 5, 46, 'booked', NULL, NULL, '2026-07-22 20:03:56', '2026-07-22 20:03:56'),
(667, 6, 45, 'booked', NULL, NULL, '2026-07-22 20:03:57', '2026-07-22 20:03:57'),
(668, 3, 45, 'booked', NULL, NULL, '2026-07-22 20:03:58', '2026-07-23 11:14:00'),
(669, 8, 46, 'booked', NULL, NULL, '2026-07-22 20:03:59', '2026-07-22 20:03:59'),
(670, 9, 45, 'booked', NULL, NULL, '2026-07-22 20:04:00', '2026-07-22 20:04:00'),
(671, 7, 45, 'booked', NULL, NULL, '2026-07-22 20:04:01', '2026-07-22 20:04:01'),
(672, 12, 45, 'booked', NULL, NULL, '2026-07-22 20:04:03', '2026-07-22 20:04:03'),
(673, 11, 46, 'booked', NULL, NULL, '2026-07-22 20:04:04', '2026-07-22 20:04:04'),
(674, 11, 45, 'booked', NULL, NULL, '2026-07-22 20:04:05', '2026-07-22 20:04:05'),
(675, 14, 45, 'booked', NULL, NULL, '2026-07-22 20:04:07', '2026-07-22 20:04:07'),
(676, 14, 46, 'booked', NULL, NULL, '2026-07-22 20:04:07', '2026-07-22 20:04:07'),
(677, 13, 46, 'booked', NULL, NULL, '2026-07-22 20:04:09', '2026-07-22 20:04:09'),
(678, 16, 46, 'booked', NULL, NULL, '2026-07-22 20:04:11', '2026-07-22 20:04:11'),
(679, 17, 45, 'booked', NULL, NULL, '2026-07-22 20:04:12', '2026-07-22 20:04:12'),
(680, 18, 45, 'booked', NULL, NULL, '2026-07-22 20:04:13', '2026-07-22 20:04:13'),
(681, 20, 45, 'booked', NULL, NULL, '2026-07-22 20:04:14', '2026-07-23 11:14:10'),
(682, 19, 46, 'booked', NULL, NULL, '2026-07-22 20:04:15', '2026-07-22 20:04:15'),
(683, 19, 45, 'booked', NULL, NULL, '2026-07-22 20:04:16', '2026-07-22 20:04:16'),
(684, 21, 45, 'booked', NULL, NULL, '2026-07-22 20:04:18', '2026-07-22 20:04:18'),
(685, 22, 45, 'booked', NULL, NULL, '2026-07-22 20:04:19', '2026-07-22 20:04:19'),
(686, 22, 46, 'booked', NULL, NULL, '2026-07-22 20:04:21', '2026-07-22 20:04:21'),
(687, 6, 46, 'booked', NULL, NULL, '2026-07-22 20:04:27', '2026-07-22 20:04:27'),
(688, 10, 46, 'booked', NULL, NULL, '2026-07-22 20:04:28', '2026-07-22 20:04:28'),
(689, 3, 48, 'booked', NULL, NULL, '2026-07-23 20:10:44', '2026-07-23 20:10:44'),
(690, 1, 47, 'attended', NULL, '2026-07-23 22:45:49', '2026-07-23 20:22:46', '2026-07-23 22:45:49'),
(691, 2, 47, 'attended', NULL, '2026-07-23 22:45:49', '2026-07-23 20:22:48', '2026-07-23 22:45:49'),
(692, 4, 47, 'attended', NULL, '2026-07-23 22:45:49', '2026-07-23 20:22:49', '2026-07-23 22:45:49'),
(693, 1, 48, 'booked', NULL, NULL, '2026-07-23 20:22:50', '2026-07-23 20:22:50'),
(694, 2, 48, 'booked', NULL, NULL, '2026-07-23 20:22:51', '2026-07-23 20:22:51'),
(695, 7, 47, 'attended', NULL, '2026-07-23 22:45:49', '2026-07-23 20:22:53', '2026-07-23 22:45:49'),
(696, 8, 47, 'attended', NULL, '2026-07-23 22:45:49', '2026-07-23 20:22:54', '2026-07-23 22:45:49'),
(697, 8, 48, 'booked', NULL, NULL, '2026-07-23 20:22:55', '2026-07-23 20:22:55'),
(698, 6, 48, 'booked', NULL, NULL, '2026-07-23 20:22:55', '2026-07-23 20:22:55'),
(699, 10, 48, 'booked', NULL, NULL, '2026-07-23 20:22:56', '2026-07-23 20:22:56'),
(700, 9, 47, 'attended', NULL, '2026-07-23 22:45:49', '2026-07-23 20:22:57', '2026-07-23 22:45:49'),
(701, 12, 48, 'booked', NULL, NULL, '2026-07-23 20:22:59', '2026-07-23 20:22:59'),
(702, 13, 48, 'booked', NULL, NULL, '2026-07-23 20:23:00', '2026-07-23 20:23:00'),
(703, 13, 47, 'attended', NULL, '2026-07-23 22:45:49', '2026-07-23 20:23:00', '2026-07-23 22:45:49'),
(704, 12, 47, 'attended', NULL, '2026-07-23 22:45:49', '2026-07-23 20:23:01', '2026-07-23 22:45:49'),
(705, 17, 47, 'attended', NULL, '2026-07-23 22:45:49', '2026-07-23 20:23:04', '2026-07-23 22:45:49'),
(706, 16, 47, 'attended', NULL, '2026-07-23 22:45:49', '2026-07-23 20:23:05', '2026-07-23 22:45:49'),
(707, 15, 48, 'booked', NULL, NULL, '2026-07-23 20:23:06', '2026-07-23 20:23:06'),
(708, 14, 48, 'booked', NULL, NULL, '2026-07-23 20:23:06', '2026-07-23 20:23:06'),
(709, 18, 47, 'attended', NULL, '2026-07-23 22:45:49', '2026-07-23 20:23:08', '2026-07-23 22:45:49'),
(710, 18, 48, 'booked', NULL, NULL, '2026-07-23 20:23:09', '2026-07-23 20:23:09'),
(711, 17, 48, 'booked', NULL, NULL, '2026-07-23 20:23:10', '2026-07-23 20:23:10'),
(712, 20, 47, 'attended', NULL, '2026-07-23 22:45:49', '2026-07-23 20:23:11', '2026-07-23 22:45:49'),
(713, 22, 48, 'booked', NULL, NULL, '2026-07-23 20:23:13', '2026-07-23 20:23:13'),
(714, 20, 48, 'booked', NULL, NULL, '2026-07-23 20:23:14', '2026-07-23 22:47:20'),
(715, 21, 47, 'attended', NULL, '2026-07-23 22:45:49', '2026-07-23 20:23:15', '2026-07-23 22:45:49'),
(716, 24, 48, 'booked', NULL, NULL, '2026-07-23 20:46:13', '2026-07-23 20:46:13'),
(717, 24, 47, 'attended', NULL, '2026-07-23 22:48:17', '2026-07-23 20:47:00', '2026-07-23 22:48:17');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_07_19_234132_create_personal_access_tokens_table', 1),
(5, '2026_07_20_004304_create_permission_tables', 1),
(6, '2026_07_20_004658_add_fields_to_users_table', 1),
(7, '2026_07_20_004658_create_students_table', 1),
(8, '2026_07_20_004659_create_daily_menus_table', 1),
(9, '2026_07_20_004659_create_settings_table', 1),
(10, '2026_07_20_004700_create_meal_attendance_table', 1),
(11, '2026_07_20_004701_create_monthly_bills_table', 1),
(12, '2026_07_20_004704_create_expenses_table', 1),
(13, '2026_07_20_004704_create_notices_table', 1),
(14, '2026_07_20_004704_create_payments_table', 1),
(15, '2026_07_20_004705_create_activity_logs_table', 1),
(16, '2026_07_20_004705_create_notifications_log_table', 1),
(17, '2026_07_20_004706_create_backups_table', 1),
(18, '2026_07_21_000001_add_cutoff_settings', 1),
(19, '2026_07_21_000001_update_student_status_and_cutoff', 1),
(20, '2026_07_21_000002_add_balance_to_students_table', 1),
(21, '2026_07_21_000003_create_transactions_table', 1),
(22, '2026_07_21_000004_add_meal_debt_to_students_table', 1),
(23, '2026_07_22_011902_update_meal_rate_settings', 1);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 1),
(2, 'App\\Models\\User', 2),
(3, 'App\\Models\\User', 3),
(4, 'App\\Models\\User', 4),
(4, 'App\\Models\\User', 5),
(4, 'App\\Models\\User', 6),
(4, 'App\\Models\\User', 7),
(4, 'App\\Models\\User', 8),
(4, 'App\\Models\\User', 9),
(4, 'App\\Models\\User', 10),
(4, 'App\\Models\\User', 11),
(4, 'App\\Models\\User', 12),
(4, 'App\\Models\\User', 13),
(4, 'App\\Models\\User', 14),
(4, 'App\\Models\\User', 15),
(4, 'App\\Models\\User', 16),
(4, 'App\\Models\\User', 17),
(4, 'App\\Models\\User', 18),
(4, 'App\\Models\\User', 19),
(4, 'App\\Models\\User', 20),
(4, 'App\\Models\\User', 21),
(4, 'App\\Models\\User', 22),
(4, 'App\\Models\\User', 23),
(4, 'App\\Models\\User', 24),
(4, 'App\\Models\\User', 25),
(4, 'App\\Models\\User', 26),
(4, 'App\\Models\\User', 27);

-- --------------------------------------------------------

--
-- Table structure for table `monthly_bills`
--

CREATE TABLE `monthly_bills` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `month` varchar(7) NOT NULL,
  `total_lunches` int(11) NOT NULL DEFAULT 0,
  `total_dinners` int(11) NOT NULL DEFAULT 0,
  `lunch_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `dinner_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `generated_by` bigint(20) UNSIGNED NOT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `monthly_bills`
--

INSERT INTO `monthly_bills` (`id`, `student_id`, `month`, `total_lunches`, `total_dinners`, `lunch_amount`, `dinner_amount`, `total_amount`, `status`, `generated_by`, `approved_by`, `approved_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 2, '2026-07', 11, 14, 0.00, 0.00, 449.75, 'pending', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(2, 3, '2026-07', 8, 13, 0.00, 0.00, 377.79, 'pending', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(3, 4, '2026-07', 13, 15, 0.00, 0.00, 503.72, 'paid', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(4, 5, '2026-07', 19, 11, 0.00, 0.00, 539.70, 'pending', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(5, 6, '2026-07', 14, 11, 0.00, 0.00, 449.75, 'pending', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(6, 7, '2026-07', 16, 12, 0.00, 0.00, 503.72, 'pending', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(7, 8, '2026-07', 14, 11, 0.00, 0.00, 449.75, 'pending', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(8, 9, '2026-07', 11, 13, 0.00, 0.00, 431.76, 'partial', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(9, 10, '2026-07', 12, 13, 0.00, 0.00, 449.75, 'paid', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(10, 11, '2026-07', 12, 13, 0.00, 0.00, 449.75, 'pending', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(11, 12, '2026-07', 13, 10, 0.00, 0.00, 413.77, 'paid', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(12, 13, '2026-07', 16, 14, 0.00, 0.00, 539.70, 'pending', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(13, 14, '2026-07', 14, 15, 0.00, 0.00, 521.71, 'pending', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(14, 15, '2026-07', 13, 14, 0.00, 0.00, 485.73, 'paid', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(15, 16, '2026-07', 16, 10, 0.00, 0.00, 467.74, 'pending', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(16, 17, '2026-07', 16, 14, 0.00, 0.00, 539.70, 'pending', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(17, 18, '2026-07', 14, 12, 0.00, 0.00, 467.74, 'paid', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(18, 19, '2026-07', 11, 9, 0.00, 0.00, 359.80, 'pending', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(19, 20, '2026-07', 14, 15, 0.00, 0.00, 521.71, 'paid', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL),
(20, 21, '2026-07', 16, 16, 0.00, 0.00, 575.68, 'pending', 3, NULL, NULL, '2026-07-21 23:24:14', '2026-07-21 23:24:14', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notices`
--

CREATE TABLE `notices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `target_role` varchar(30) NOT NULL DEFAULT 'all',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `published_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notices`
--

INSERT INTO `notices` (`id`, `title`, `content`, `target_role`, `is_active`, `published_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Hello world', 'lorem kjBSDIZUCXIUEZRVIUSBVIO ZXIDUBVOUABRAVS', 'student', 1, 2, '2026-07-22 05:54:09', '2026-07-22 05:54:09', NULL),
(2, 'Today Fix meal', '100 taka kore dite hobe', 'student', 1, 3, '2026-07-22 10:03:24', '2026-07-22 10:03:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notifications_log`
--

CREATE TABLE `notifications_log` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `monthly_bill_id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(30) NOT NULL,
  `transaction_ref` varchar(255) DEFAULT NULL,
  `paid_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `recorded_by` bigint(20) UNSIGNED NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'manage_users', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(2, 'manage_settings', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(3, 'approve_reports', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(4, 'view_analytics', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(5, 'manage_menus', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(6, 'mark_meals', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(7, 'manage_expenses', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(8, 'generate_bills', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(9, 'record_payments', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(10, 'view_due_list', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(11, 'book_meals', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(12, 'view_bill', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(13, 'make_payment', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(14, 'view_notices', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(15, 'create_notices', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(16, 'export_reports', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(8, 'App\\Models\\User', 3, 'api-token', '7f060a1bb0842b2774a8544dcffdd1c0a5a62abc7a22a7e39d99d86e48400ff9', '[\"*\"]', '2026-07-24 16:57:50', NULL, '2026-07-22 06:37:55', '2026-07-24 16:57:50'),
(12, 'App\\Models\\User', 2, 'api-token', 'dd69e30d24f7ea96f77d9972dd31ee1b2b7c7194a12aa4dc50de03118663bba0', '[\"*\"]', '2026-07-23 22:21:05', NULL, '2026-07-23 20:44:33', '2026-07-23 22:21:05'),
(16, 'App\\Models\\User', 27, 'api-token', '4d64bb053139dde96753e595e5aaa1c28f4bb9ec78a025c8afca1c6fe7474f43', '[\"*\"]', '2026-07-23 22:48:35', NULL, '2026-07-23 22:47:48', '2026-07-23 22:48:35');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'super_admin', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(2, 'hall_tutor', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(3, 'manager', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(4, 'student', 'web', '2026-07-21 23:23:50', '2026-07-21 23:23:50');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(3, 2),
(4, 1),
(4, 2),
(4, 3),
(5, 1),
(5, 3),
(6, 1),
(6, 3),
(7, 1),
(7, 3),
(8, 1),
(8, 3),
(9, 1),
(9, 3),
(10, 1),
(10, 2),
(10, 3),
(11, 1),
(11, 4),
(12, 1),
(12, 4),
(13, 1),
(13, 4),
(14, 1),
(14, 2),
(14, 3),
(14, 4),
(15, 1),
(15, 2),
(15, 3),
(16, 1),
(16, 2),
(16, 3);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `type` varchar(20) NOT NULL DEFAULT 'string',
  `group` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`, `type`, `group`, `created_at`, `updated_at`) VALUES
(1, 'lunch_cutoff_time', '00:00', 'string', 'meal', NULL, '2026-07-21 23:37:45'),
(2, 'dinner_cutoff_time', '14:00', 'string', 'meal', NULL, '2026-07-21 23:37:45'),
(5, 'meal_rate', '0', 'decimal', 'meal', NULL, NULL),
(6, 'hostel_name', 'DIU Hall Management', 'string', 'general', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(7, 'monthly_fee', '2000', 'integer', 'fee', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(8, 'meal_deadline_hours', '2', 'integer', 'meal', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(9, 'currency', 'BDT', 'string', 'general', '2026-07-21 23:23:50', '2026-07-21 23:23:50'),
(10, 'max_meals_per_day', '2', 'integer', 'meal', '2026-07-21 23:23:50', '2026-07-21 23:23:50');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `room_number` varchar(20) NOT NULL,
  `department` varchar(255) NOT NULL DEFAULT 'N/A',
  `batch` varchar(50) NOT NULL DEFAULT 'N/A',
  `emergency_contact` varchar(20) DEFAULT NULL,
  `admission_date` date NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `meal_debt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `user_id`, `student_id`, `room_number`, `department`, `batch`, `emergency_contact`, `admission_date`, `status`, `balance`, `meal_debt`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 4, 'STU-0004', '3rd Floor, Room 12', 'N/A', 'N/A', NULL, '2026-01-22', 'approved', 667.12, 0.00, '2026-07-21 23:23:53', '2026-07-23 22:45:49', NULL),
(2, 5, 'DIU-HM-001', '1st Floor, Room 101', 'CSE', '63', '01774393486', '2025-01-22', 'approved', 467.12, 0.00, '2026-07-21 23:23:54', '2026-07-23 22:45:49', NULL),
(3, 6, 'DIU-HM-002', '1st Floor, Room 102', 'EEE', '63', '01798490830', '2025-05-22', 'approved', 0.00, 88.79, '2026-07-21 23:23:55', '2026-07-21 23:24:14', NULL),
(4, 7, 'DIU-HM-003', '1st Floor, Room 103', 'BBA', '63', '01769799155', '2025-02-22', 'approved', 1747.40, 0.00, '2026-07-21 23:23:56', '2026-07-23 22:45:49', NULL),
(5, 8, 'DIU-HM-004', '2nd Floor, Room 201', 'English', '64', '01754497414', '2025-11-22', 'approved', 0.00, 539.70, '2026-07-21 23:23:57', '2026-07-21 23:24:14', NULL),
(6, 9, 'DIU-HM-005', '2nd Floor, Room 202', 'CSE', '64', '01713340646', '2025-12-22', 'approved', 0.00, 449.75, '2026-07-21 23:23:57', '2026-07-21 23:24:14', NULL),
(7, 10, 'DIU-HM-006', '2nd Floor, Room 203', 'Law', '62', '01795921528', '2025-10-22', 'approved', 667.12, 0.00, '2026-07-21 23:23:58', '2026-07-23 22:45:49', NULL),
(8, 11, 'DIU-HM-007', '3rd Floor, Room 301', 'Economics', '65', '01714469665', '2025-01-22', 'approved', -32.88, 32.88, '2026-07-21 23:23:59', '2026-07-23 22:45:49', NULL),
(9, 12, 'DIU-HM-008', '3rd Floor, Room 302', 'Pharmacy', '63', '01799253553', '2025-02-22', 'approved', 55.36, 0.00, '2026-07-21 23:24:00', '2026-07-23 22:45:49', NULL),
(10, 13, 'DIU-HM-009', '3rd Floor, Room 303', 'CSE', '62', '01783645011', '2025-01-22', 'approved', 2027.25, 0.00, '2026-07-21 23:24:01', '2026-07-21 23:24:14', NULL),
(11, 14, 'DIU-HM-010', '4th Floor, Room 401', 'EEE', '64', '01729118546', '2024-07-22', 'approved', 1600.00, 0.00, '2026-07-21 23:24:02', '2026-07-22 07:06:15', NULL),
(12, 15, 'DIU-HM-011', '4th Floor, Room 402', 'BBA', '65', '01735564959', '2025-12-22', 'approved', 2033.35, 0.00, '2026-07-21 23:24:02', '2026-07-23 22:45:49', NULL),
(13, 16, 'DIU-HM-012', '4th Floor, Room 403', 'English', '63', '01793164222', '2024-09-22', 'approved', -32.88, 32.88, '2026-07-21 23:24:03', '2026-07-23 22:45:49', NULL),
(14, 17, 'DIU-HM-013', '5th Floor, Room 501', 'CSE', '61', '01737345150', '2026-01-22', 'approved', 0.00, 521.71, '2026-07-21 23:24:04', '2026-07-21 23:24:14', NULL),
(15, 18, 'DIU-HM-014', '5th Floor, Room 502', 'Law', '64', '01714535716', '2025-10-22', 'approved', 2286.27, 0.00, '2026-07-21 23:24:05', '2026-07-21 23:24:14', NULL),
(16, 19, 'DIU-HM-015', '5th Floor, Room 503', 'Economics', '62', '01752909653', '2025-02-22', 'approved', -32.88, 32.88, '2026-07-21 23:24:06', '2026-07-23 22:45:49', NULL),
(17, 20, 'DIU-HM-016', '6th Floor, Room 601', 'Pharmacy', '65', '01741940021', '2025-09-22', 'approved', -32.88, 32.88, '2026-07-21 23:24:07', '2026-07-23 22:45:49', NULL),
(18, 21, 'DIU-HM-017', '6th Floor, Room 602', 'CSE', '61', '01722330732', '2025-02-22', 'approved', 1580.38, 0.00, '2026-07-21 23:24:07', '2026-07-23 22:45:49', NULL),
(19, 22, 'DIU-HM-018', '6th Floor, Room 603', 'EEE', '63', '01772247734', '2025-01-22', 'approved', 0.00, 359.80, '2026-07-21 23:24:08', '2026-07-21 23:24:14', NULL),
(20, 23, 'DIU-HM-019', '7th Floor, Room 701', 'BBA', '64', '01731937732', '2025-04-22', 'approved', 529.41, 0.00, '2026-07-21 23:24:09', '2026-07-23 22:45:49', NULL),
(21, 24, 'DIU-HM-020', '7th Floor, Room 702', 'English', '65', '01733622705', '2025-07-22', 'approved', -32.88, 32.88, '2026-07-21 23:24:10', '2026-07-23 22:45:49', NULL),
(22, 25, 'STU-0025', '2nd floor, room 202', 'EEE', 'N/A', NULL, '2026-07-22', 'approved', 0.00, 0.00, '2026-07-21 23:39:42', '2026-07-22 05:49:48', NULL),
(23, 26, 'STU-0026', '1st floor', 'CSE', 'N/A', NULL, '2026-07-24', 'pending', 0.00, 0.00, '2026-07-23 20:24:19', '2026-07-23 20:24:19', NULL),
(24, 27, 'STU-0027', '5th floor', 'Civil', 'N/A', NULL, '2026-07-24', 'approved', 467.91, 0.00, '2026-07-23 20:34:44', '2026-07-23 22:48:17', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(10) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `balance_before` decimal(10,2) NOT NULL,
  `balance_after` decimal(10,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `reference_type` varchar(255) DEFAULT NULL,
  `reference_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `student_id`, `type`, `amount`, `balance_before`, `balance_after`, `description`, `reference_type`, `reference_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 3, 'credit', 289.00, 0.00, 289.00, 'Initial wallet top-up', 'advance_payment', NULL, 3, '2026-07-21 23:23:55', '2026-07-21 23:23:55'),
(2, 4, 'credit', 2284.00, 0.00, 2284.00, 'Initial wallet top-up', 'advance_payment', NULL, 3, '2026-07-21 23:23:56', '2026-07-21 23:23:56'),
(3, 9, 'credit', 520.00, 0.00, 520.00, 'Initial wallet top-up', 'advance_payment', NULL, 3, '2026-07-21 23:24:00', '2026-07-21 23:24:00'),
(4, 10, 'credit', 2477.00, 0.00, 2477.00, 'Initial wallet top-up', 'advance_payment', NULL, 3, '2026-07-21 23:24:01', '2026-07-21 23:24:01'),
(5, 12, 'credit', 2480.00, 0.00, 2480.00, 'Initial wallet top-up', 'advance_payment', NULL, 3, '2026-07-21 23:24:02', '2026-07-21 23:24:02'),
(6, 13, 'credit', 322.00, 0.00, 322.00, 'Initial wallet top-up', 'advance_payment', NULL, 3, '2026-07-21 23:24:03', '2026-07-21 23:24:03'),
(7, 15, 'credit', 2772.00, 0.00, 2772.00, 'Initial wallet top-up', 'advance_payment', NULL, 3, '2026-07-21 23:24:05', '2026-07-21 23:24:05'),
(8, 18, 'credit', 2081.00, 0.00, 2081.00, 'Initial wallet top-up', 'advance_payment', NULL, 3, '2026-07-21 23:24:07', '2026-07-21 23:24:07'),
(9, 20, 'credit', 1084.00, 0.00, 1084.00, 'Initial wallet top-up', 'advance_payment', NULL, 3, '2026-07-21 23:24:09', '2026-07-21 23:24:09'),
(10, 21, 'credit', 450.00, 0.00, 450.00, 'Initial wallet top-up', 'advance_payment', NULL, 3, '2026-07-21 23:24:10', '2026-07-21 23:24:10'),
(11, 3, 'debit', 289.00, 289.00, 0.00, 'Seed: Meal deductions for 2026-07', 'meal_batch', NULL, 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(12, 4, 'debit', 503.72, 2284.00, 1780.28, 'Seed: Meal deductions for 2026-07', 'meal_batch', NULL, 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(13, 9, 'debit', 431.76, 520.00, 88.24, 'Seed: Meal deductions for 2026-07', 'meal_batch', NULL, 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(14, 10, 'debit', 449.75, 2477.00, 2027.25, 'Seed: Meal deductions for 2026-07', 'meal_batch', NULL, 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(15, 12, 'debit', 413.77, 2480.00, 2066.23, 'Seed: Meal deductions for 2026-07', 'meal_batch', NULL, 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(16, 13, 'debit', 322.00, 322.00, 0.00, 'Seed: Meal deductions for 2026-07', 'meal_batch', NULL, 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(17, 15, 'debit', 485.73, 2772.00, 2286.27, 'Seed: Meal deductions for 2026-07', 'meal_batch', NULL, 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(18, 18, 'debit', 467.74, 2081.00, 1613.26, 'Seed: Meal deductions for 2026-07', 'meal_batch', NULL, 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(19, 20, 'debit', 521.71, 1084.00, 562.29, 'Seed: Meal deductions for 2026-07', 'meal_batch', NULL, 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(20, 21, 'debit', 450.00, 450.00, 0.00, 'Seed: Meal deductions for 2026-07', 'meal_batch', NULL, 3, '2026-07-21 23:24:14', '2026-07-21 23:24:14'),
(21, 1, 'credit', 700.00, 0.00, 700.00, 'Noted', 'advance_payment', NULL, 3, '2026-07-22 06:38:38', '2026-07-22 06:38:38'),
(22, 2, 'credit', 500.00, 0.00, 500.00, 'none', 'advance_payment', NULL, 3, '2026-07-22 06:59:47', '2026-07-22 06:59:47'),
(23, 11, 'credit', 1600.00, 0.00, 1600.00, 'Test Taka', 'advance_payment', NULL, 3, '2026-07-22 07:06:15', '2026-07-22 07:06:15'),
(24, 7, 'credit', 700.00, 0.00, 700.00, 'Advance payment', 'advance_payment', NULL, 3, '2026-07-23 11:14:51', '2026-07-23 11:14:51'),
(25, 24, 'credit', 500.00, 0.00, 500.00, 'no', 'advance_payment', NULL, 3, '2026-07-23 21:54:35', '2026-07-23 21:54:35'),
(26, 1, 'debit', 32.88, 700.00, 667.12, 'Lunch auto-attended on 2026-07-24', 'meal_attendance', 690, NULL, '2026-07-23 22:45:49', '2026-07-23 22:45:49'),
(27, 2, 'debit', 32.88, 500.00, 467.12, 'Lunch auto-attended on 2026-07-24', 'meal_attendance', 691, NULL, '2026-07-23 22:45:49', '2026-07-23 22:45:49'),
(28, 4, 'debit', 32.88, 1780.28, 1747.40, 'Lunch auto-attended on 2026-07-24', 'meal_attendance', 692, NULL, '2026-07-23 22:45:49', '2026-07-23 22:45:49'),
(29, 7, 'debit', 32.88, 700.00, 667.12, 'Lunch auto-attended on 2026-07-24', 'meal_attendance', 695, NULL, '2026-07-23 22:45:49', '2026-07-23 22:45:49'),
(30, 8, 'debit', 32.88, 0.00, -32.88, 'Lunch auto-attended on 2026-07-24', 'meal_attendance', 696, NULL, '2026-07-23 22:45:49', '2026-07-23 22:45:49'),
(31, 9, 'debit', 32.88, 88.24, 55.36, 'Lunch auto-attended on 2026-07-24', 'meal_attendance', 700, NULL, '2026-07-23 22:45:49', '2026-07-23 22:45:49'),
(32, 13, 'debit', 32.88, 0.00, -32.88, 'Lunch auto-attended on 2026-07-24', 'meal_attendance', 703, NULL, '2026-07-23 22:45:49', '2026-07-23 22:45:49'),
(33, 12, 'debit', 32.88, 2066.23, 2033.35, 'Lunch auto-attended on 2026-07-24', 'meal_attendance', 704, NULL, '2026-07-23 22:45:49', '2026-07-23 22:45:49'),
(34, 17, 'debit', 32.88, 0.00, -32.88, 'Lunch auto-attended on 2026-07-24', 'meal_attendance', 705, NULL, '2026-07-23 22:45:49', '2026-07-23 22:45:49'),
(35, 16, 'debit', 32.88, 0.00, -32.88, 'Lunch auto-attended on 2026-07-24', 'meal_attendance', 706, NULL, '2026-07-23 22:45:49', '2026-07-23 22:45:49'),
(36, 18, 'debit', 32.88, 1613.26, 1580.38, 'Lunch auto-attended on 2026-07-24', 'meal_attendance', 709, NULL, '2026-07-23 22:45:49', '2026-07-23 22:45:49'),
(37, 20, 'debit', 32.88, 562.29, 529.41, 'Lunch auto-attended on 2026-07-24', 'meal_attendance', 712, NULL, '2026-07-23 22:45:49', '2026-07-23 22:45:49'),
(38, 21, 'debit', 32.88, 0.00, -32.88, 'Lunch auto-attended on 2026-07-24', 'meal_attendance', 715, NULL, '2026-07-23 22:45:49', '2026-07-23 22:45:49'),
(39, 24, 'debit', 32.09, 500.00, 467.91, 'Lunch auto-attended on 2026-07-24', 'meal_attendance', 717, NULL, '2026-07-23 22:48:17', '2026-07-23 22:48:17');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'student',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `avatar`, `role`, `is_active`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Super Admin', 'admin@hmems.local', '01700000000', NULL, 'super_admin', 1, NULL, '$2y$12$.zA0HKA5k8M5YJn/I3pU2u3ZGR90NoirxuHTdBg8oKNVbCutoK.6O', NULL, '2026-07-21 23:23:53', '2026-07-21 23:23:53', NULL),
(2, 'Teacher', 'tutor@hmems.local', '01700000001', 'avatars/OMjh74QcxMnoaFk2GpqGdQCxYjZPk7o141fGl6hT.png', 'hall_tutor', 1, NULL, '$2y$12$quvlX7LY.d3Frea5bSVGzevnkQjy2/foEN/eCDYLjpIAxhefCIcHu', NULL, '2026-07-21 23:23:53', '2026-07-21 23:52:16', NULL),
(3, 'Manager', 'manager@hmems.local', '01700000002', 'avatars/SaBZa6dcgMyZWEfvylI525jHo3DoMyUVMg1EeFXe.png', 'manager', 1, NULL, '$2y$12$Jj7QmZPj6q9bK0Sn6dkO4.IFKQceCKQ5a616la4DtvWcS396xLInu', NULL, '2026-07-21 23:23:53', '2026-07-22 20:05:24', NULL),
(4, 'Student User', 'student@hmems.local', '01700000022', NULL, 'student', 1, NULL, '$2y$12$KvVa2ec/jz4B4tK/l2lC4.LpBKia2mZJAVb9t4lOQ2eIgTtAsqosS', NULL, '2026-07-21 23:23:53', '2026-07-23 22:14:14', NULL),
(5, 'Md. Ariful Islam', 'student1@diu.edu.bd', '01714337156', 'avatars/raYI9u0Yb3gOjvxExkp6YwgrohN1mFSzBHhhuDoc.png', 'student', 1, NULL, '$2y$12$u5qOYrQP0omVDx1E5JfYYOsd9yxPlKRN4iEvZdzthmOg3un8JNngO', NULL, '2026-07-21 23:23:54', '2026-07-22 06:54:39', NULL),
(6, 'Sadia Akter', 'student2@diu.edu.bd', '01716544617', NULL, 'student', 1, NULL, '$2y$12$d7wDUy90qKOy5Wg0vDQyoepL6Lea16s7WY74PFfQ9ubvqkmihUlDu', NULL, '2026-07-21 23:23:55', '2026-07-21 23:23:55', NULL),
(7, 'Md. Hasan Ali', 'student3@diu.edu.bd', '01767264366', NULL, 'student', 1, NULL, '$2y$12$F/peFxBTxPrAyfPnwQGCk.YTJsJzB5stUyWInvcxQRMjgUI279f0C', NULL, '2026-07-21 23:23:56', '2026-07-21 23:23:56', NULL),
(8, 'Nusrat Jahan', 'student4@diu.edu.bd', '01788334904', NULL, 'student', 1, NULL, '$2y$12$2hs0ws1/yu4X27wj.Og9tuN3TnQB9QM9YEoSB9azpkZWIwcc2sddi', NULL, '2026-07-21 23:23:57', '2026-07-21 23:23:57', NULL),
(9, 'Rakib Hossain', 'student5@diu.edu.bd', '01737913731', NULL, 'student', 1, NULL, '$2y$12$wtzVqDtI5Gf1cqvUDLLskuyVA50V9Yz8kPtI1AiYK6CLsiJ9ylc1.', NULL, '2026-07-21 23:23:57', '2026-07-21 23:23:57', NULL),
(10, 'Taslima Begum', 'student6@diu.edu.bd', '01784740973', NULL, 'student', 1, NULL, '$2y$12$lSVb7Iqzbjf611qa5s0kJuEfRUZJRED2lkaDHOD.sW8iEFS/ANAl6', NULL, '2026-07-21 23:23:58', '2026-07-21 23:23:58', NULL),
(11, 'Md. Kamrul Hasan', 'student7@diu.edu.bd', '01720140463', NULL, 'student', 1, NULL, '$2y$12$9S5YH7aGRHD4.gVdxrlSAuH.RU8uBaMQ2HNohkeyEjPpMJNIFPWe.', NULL, '2026-07-21 23:23:59', '2026-07-21 23:23:59', NULL),
(12, 'Farzana Yeasmin', 'student8@diu.edu.bd', '01745754260', NULL, 'student', 1, NULL, '$2y$12$zACaM5qaq2j0fb43rK.pjeNB2y247PxO.aa7jLNn15lVAhbUC5hkK', NULL, '2026-07-21 23:24:00', '2026-07-21 23:24:00', NULL),
(13, 'Shahinur Rahman', 'student9@diu.edu.bd', '01775437517', NULL, 'student', 1, NULL, '$2y$12$LynIjU9zivheEjYyOe7LGeQIya4AMrQ45j8RvlEOktUms2mnxZbWa', NULL, '2026-07-21 23:24:01', '2026-07-21 23:24:01', NULL),
(14, 'Jannatul Ferdous', 'student10@diu.edu.bd', '01786225626', NULL, 'student', 1, NULL, '$2y$12$su6kTXeS.Dj9UM8HQeDfWOZM4wavlqQVbr7rQnPjlNTWqmWFpmTdC', NULL, '2026-07-21 23:24:02', '2026-07-21 23:24:02', NULL),
(15, 'Md. Sohel Rana', 'student11@diu.edu.bd', '01769608070', NULL, 'student', 1, NULL, '$2y$12$FoudYdQk7cPofvtFecBihu18beEM6FJtE8VRhMAYafAuz5K1ZO9Qy', NULL, '2026-07-21 23:24:02', '2026-07-21 23:24:02', NULL),
(16, 'Mst. Sumaiya Khatun', 'student12@diu.edu.bd', '01745571020', NULL, 'student', 1, NULL, '$2y$12$wmtm9BgYHdUjzSuaOr1pC.V9qvI95OICy.9xgCLsqhKRNhOhnjFF2', NULL, '2026-07-21 23:24:03', '2026-07-21 23:24:03', NULL),
(17, 'Tanvir Ahmed', 'student13@diu.edu.bd', '01712682265', NULL, 'student', 1, NULL, '$2y$12$BcE1hCknZDCM4fW6l.FwKuxlC3FmFuhzIQmO4zKBNQxm8im.nIeEa', NULL, '2026-07-21 23:24:04', '2026-07-21 23:24:04', NULL),
(18, 'Sharmin Sultana', 'student14@diu.edu.bd', '01734369484', NULL, 'student', 1, NULL, '$2y$12$tnX5rzNlUIysGx0inwvY8epLfmvZTEyE9JG6i64G5Xqno6inym/Di', NULL, '2026-07-21 23:24:05', '2026-07-21 23:24:05', NULL),
(19, 'Md. Jubayer Ali', 'student15@diu.edu.bd', '01755270025', NULL, 'student', 1, NULL, '$2y$12$gDPkVhx8fM4G1qnq/t.vHeqUjS1hyJ5yA8LRwZJlGcLqY1vKiBhii', NULL, '2026-07-21 23:24:06', '2026-07-21 23:24:06', NULL),
(20, 'Popy Rani Das', 'student16@diu.edu.bd', '01727286982', NULL, 'student', 1, NULL, '$2y$12$NStI5ly2bpkdMtdwwY6wluVWI0J.g3e7SK6mR/teyFFuMnH2xp3Ga', NULL, '2026-07-21 23:24:07', '2026-07-21 23:24:07', NULL),
(21, 'Md. Mehedi Hasan', 'student17@diu.edu.bd', '01746369678', NULL, 'student', 1, NULL, '$2y$12$CV9KpBdpA3q6eDHMbl68TORiVvfGXReGldcp4Fh/IEDeDAGaicpWe', NULL, '2026-07-21 23:24:07', '2026-07-21 23:24:07', NULL),
(22, 'Khadiza Akter', 'student18@diu.edu.bd', '01729632242', NULL, 'student', 1, NULL, '$2y$12$HYbSNV9fRcv95sw6snNghen4M1SP0X8vwS92ly7YXNZHsTSkBehqO', NULL, '2026-07-21 23:24:08', '2026-07-21 23:24:08', NULL),
(23, 'Abu Sayeed', 'student19@diu.edu.bd', '01796099812', NULL, 'student', 1, NULL, '$2y$12$9jY.61udu6v028AdnE6Jw.mjigOGSdMerV6FcfFkhbv0UcJ7aurFe', NULL, '2026-07-21 23:24:09', '2026-07-21 23:24:09', NULL),
(24, 'Mim Khatun', 'student20@diu.edu.bd', '01776051971', NULL, 'student', 1, NULL, '$2y$12$UZYiDNPkmMe9U0ygGf8/uet7gpp9cZTMEbam8sm6ChDLt0CfpuBQ.', NULL, '2026-07-21 23:24:10', '2026-07-21 23:24:10', NULL),
(25, 'Khalid Hasan', 'khalidhasanshafi@gmail.com', '01518937330', NULL, 'student', 1, NULL, '$2y$12$.sXUxoccNm3z2qTV.SzrTebhtp/F2v4.j8BMGZtTk8hDxamuekROm', NULL, '2026-07-21 23:39:42', '2026-07-21 23:39:42', NULL),
(26, 'Nion', 'nion@gmail.com', '01799999999', NULL, 'student', 1, NULL, '$2y$12$pobMxt1x4xYSrzan.u9Oru8UCwNAGG24kBSp6OuJlcjrYkqzBqLM6', NULL, '2026-07-23 20:24:19', '2026-07-23 20:24:19', NULL),
(27, 'Sajib', 'sajib@gmail.com', '01811111111', NULL, 'student', 1, NULL, '$2y$12$phiQ6ZwSzO05/xVRIJYtTuiJNpnUdPHFEcEULWzlW2wiG23Jimbry', NULL, '2026-07-23 20:34:44', '2026-07-23 20:34:44', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_user_id_foreign` (`user_id`),
  ADD KEY `activity_logs_subject_type_subject_id_index` (`subject_type`,`subject_id`);

--
-- Indexes for table `backups`
--
ALTER TABLE `backups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `backups_created_by_foreign` (`created_by`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `daily_menus`
--
ALTER TABLE `daily_menus`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `daily_menus_date_meal_type_unique` (`date`,`meal_type`),
  ADD KEY `daily_menus_created_by_foreign` (`created_by`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expenses_recorded_by_foreign` (`recorded_by`),
  ADD KEY `expenses_approved_by_foreign` (`approved_by`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `meal_attendance`
--
ALTER TABLE `meal_attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `meal_attendance_student_id_daily_menu_id_unique` (`student_id`,`daily_menu_id`),
  ADD KEY `meal_attendance_daily_menu_id_foreign` (`daily_menu_id`),
  ADD KEY `meal_attendance_marked_by_foreign` (`marked_by`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `monthly_bills`
--
ALTER TABLE `monthly_bills`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `monthly_bills_student_id_month_unique` (`student_id`,`month`),
  ADD KEY `monthly_bills_generated_by_foreign` (`generated_by`),
  ADD KEY `monthly_bills_approved_by_foreign` (`approved_by`);

--
-- Indexes for table `notices`
--
ALTER TABLE `notices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notices_published_by_foreign` (`published_by`);

--
-- Indexes for table `notifications_log`
--
ALTER TABLE `notifications_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_log_user_id_foreign` (`user_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_monthly_bill_id_foreign` (`monthly_bill_id`),
  ADD KEY `payments_student_id_foreign` (`student_id`),
  ADD KEY `payments_recorded_by_foreign` (`recorded_by`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_unique` (`key`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `students_user_id_unique` (`user_id`),
  ADD UNIQUE KEY `students_student_id_unique` (`student_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transactions_created_by_foreign` (`created_by`),
  ADD KEY `transactions_student_id_created_at_index` (`student_id`,`created_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `backups`
--
ALTER TABLE `backups`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `daily_menus`
--
ALTER TABLE `daily_menus`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `meal_attendance`
--
ALTER TABLE `meal_attendance`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=718;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `monthly_bills`
--
ALTER TABLE `monthly_bills`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `notices`
--
ALTER TABLE `notices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `notifications_log`
--
ALTER TABLE `notifications_log`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `backups`
--
ALTER TABLE `backups`
  ADD CONSTRAINT `backups_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `daily_menus`
--
ALTER TABLE `daily_menus`
  ADD CONSTRAINT `daily_menus_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `expenses_recorded_by_foreign` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `meal_attendance`
--
ALTER TABLE `meal_attendance`
  ADD CONSTRAINT `meal_attendance_daily_menu_id_foreign` FOREIGN KEY (`daily_menu_id`) REFERENCES `daily_menus` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `meal_attendance_marked_by_foreign` FOREIGN KEY (`marked_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `meal_attendance_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `monthly_bills`
--
ALTER TABLE `monthly_bills`
  ADD CONSTRAINT `monthly_bills_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `monthly_bills_generated_by_foreign` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `monthly_bills_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notices`
--
ALTER TABLE `notices`
  ADD CONSTRAINT `notices_published_by_foreign` FOREIGN KEY (`published_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `notifications_log`
--
ALTER TABLE `notifications_log`
  ADD CONSTRAINT `notifications_log_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_monthly_bill_id_foreign` FOREIGN KEY (`monthly_bill_id`) REFERENCES `monthly_bills` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_recorded_by_foreign` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `payments_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `transactions_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
