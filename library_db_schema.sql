-- library_db.books definition

CREATE TABLE `books` (
                         `id` varchar(36) NOT NULL,
                         `title` varchar(30) NOT NULL DEFAULT 'No name',
                         `author` varchar(15) NOT NULL DEFAULT 'Anonimous',
                         `genre` varchar(10) NOT NULL DEFAULT '',
                         `status` varchar(10) NOT NULL DEFAULT 'in_stock',
                         `year` int unsigned NOT NULL DEFAULT '2000',
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- library_db.books_readers definition

CREATE TABLE `books_readers` (
                                 `book_id` varchar(36) NOT NULL,
                                 `reader_id` int NOT NULL,
                                 `taken_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                                 PRIMARY KEY (`book_id`,`reader_id`),
                                 KEY `reader_id` (`reader_id`),
                                 CONSTRAINT `books_readers_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
                                 CONSTRAINT `books_readers_ibfk_2` FOREIGN KEY (`reader_id`) REFERENCES `readers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- library_db.readers definition

CREATE TABLE `readers` (
                           `id` int NOT NULL AUTO_INCREMENT,
                           `name` varchar(50) NOT NULL,
                           PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;