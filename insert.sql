CREATE TABLE fake_users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    registration_date DATE,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    profile_bio TEXT,
    age INT
);

INSERT INTO fake_users (first_name, last_name, email, registration_date, last_login, is_active, profile_bio, age)
VALUES
('Emma', 'Johnson', 'emma.johnson@example.com', '2023-01-15', '2024-06-10 14:30:22', TRUE, 'Coffee lover and bookworm. Always seeking new adventures.', 28),
('Liam', 'Smith', 'liam.smith@example.com', '2023-02-22', '2024-06-09 09:15:47', TRUE, 'Tech enthusiast and amateur photographer. Passionate about open-source.', 31),
('Olivia', 'Brown', 'olivia.brown@example.com', '2023-03-05', '2024-06-08 18:45:12', TRUE, 'Yoga instructor and plant mom. Believes in mindful living.', 26),
('Noah', 'Davis', 'noah.davis@example.com', '2023-04-12', '2024-06-07 11:20:33', TRUE, 'Gamer and streamer. Loves retro consoles and indie games.', 24),
('Ava', 'Miller', 'ava.miller@example.com', '2023-05-18', '2024-06-06 16:55:08', TRUE, 'Foodie and home chef. Specializes in international cuisines.', 29),
('Ethan', 'Wilson', 'ethan.wilson@example.com', '2023-06-21', '2024-06-05 08:40:19', TRUE, 'Fitness coach and marathon runner. Believes in discipline and consistency.', 33),
('Isabella', 'Moore', 'isabella.moore@example.com', '2023-07-30', '2024-06-04 20:10:55', TRUE, 'Artist and muralist. Uses art to express social messages.', 27),
('Mason', 'Taylor', 'mason.taylor@example.com', '2023-08-14', '2024-06-03 13:25:41', TRUE, 'Musician and producer. Plays guitar and writes indie folk songs.', 30),
('Sophia', 'Anderson', 'sophia.anderson@example.com', '2023-09-09', '2024-06-02 17:05:29', TRUE, 'Travel blogger and digital nomad. Has visited 30+ countries.', 25),
('Logan', 'Thomas', 'logan.thomas@example.com', '2023-10-25', '2024-06-01 10:30:17', TRUE, 'Entrepreneur and startup founder. Passionate about sustainable tech.', 35);