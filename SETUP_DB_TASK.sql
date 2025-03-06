-- Drop tables if already exist
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS tags;

-- Creating users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(35) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    settings JSON NOT NULL DEFAULT '{"at_a_glance": 1, "default_cal_view": "month"}'
);

-- Creating tasks table
CREATE TABLE tasks (
    uid VARCHAR(75) PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tags JSON NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP NOT NULL,
    title VARCHAR(50) NOT NULL,
    body TEXT NOT NULL,
    repeating JSON NOT NULL,
    repeating_end_time TIMESTAMP,
    completed_time TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Creating tags table
CREATE TABLE tags (
    tag_id VARCHAR(75) PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    tag_name VARCHAR(50) NOT NULL,
    rgb_value VARCHAR(25) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    use_count SERIAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Inserting users
INSERT INTO users (email, password)
VALUES 
    ('user1@example.com', 'password1'),
    ('user2@example.com', 'password2'),
    ('user3@example.com', 'password3'),
	('demo@example.com', 'demo');

-- Inserting original sample data into tasks table
INSERT INTO tasks (uid, user_id, tags, start_time, end_time, title, body, repeating, repeating_end_time, completed_time) 
VALUES 
    ('task1_user1', 1, '{"tag1": "1", "tag2": "2"}', NULL, '2024-04-25 10:00:00', 'Task 1 for User 1', 'Description of task 1 for User 1', '{}', NULL, NULL),
    ('task2_user1-0', 1, '{"tag2": "2", "tag3": "3"}', '2024-04-26 10:00:00', '2024-04-26 12:00:00', 'Task 2 for User 1', 'Description of task 2 for User 1', '{"frequency": "daily"}', '2024-05-01 00:00:00', NULL),
    ('task2_user1-1', 1, '{"tag2": "2", "tag3": "3"}', '2024-04-27 10:00:00', '2024-04-27 12:00:00', 'Task 2 for User 1', 'Description of task 2 for User 1', '{"frequency": "daily"}', '2024-05-01 00:00:00', NULL),
    ('task2_user1-2', 1, '{"tag2": "2", "tag3": "3"}', '2024-04-28 10:00:00', '2024-04-28 12:00:00', 'Task 2 for User 1', 'Description of task 2 for User 1', '{"frequency": "daily"}', '2024-05-01 00:00:00', NULL),
    ('task2_user1-3', 1, '{"tag2": "2", "tag3": "3"}', '2024-04-29 10:00:00', '2024-04-29 12:00:00', 'Task 2 for User 1', 'Description of task 2 for User 1', '{"frequency": "daily"}', '2024-05-01 00:00:00', NULL),
    ('task2_user1-4', 1, '{"tag2": "2", "tag3": "3"}', '2024-04-30 10:00:00', '2024-04-30 12:00:00', 'Task 2 for User 1', 'Description of task 2 for User 1', '{"frequency": "daily"}', '2024-05-01 00:00:00', NULL),
    ('task2_user1-5', 1, '{"tag2": "2", "tag3": "3"}', '2024-05-01 10:00:00', '2024-05-01 12:00:00', 'Task 2 for User 1', 'Description of task 2 for User 1', '{"frequency": "daily"}', '2024-05-01 00:00:00', NULL),
    ('task1_user2', 2, '{"tag1": "1", "tag3": "3"}', NULL, '2024-04-25 09:30:00', 'Task 1 for User 2', 'Description of task 1 for User 2', '{}', NULL, NULL),
    ('task2_user2', 2, '{"default": "0"}', '2024-04-26 13:00:00', '2024-04-26 15:00:00', 'Task 2 for User 2', 'Description of task 2 for User 2', '{"frequency": "daily"}', NULL, NULL),
    ('task1_user3', 3, '{"tag1": "1", "tag3": "3"}', '2024-04-27 08:00:00', '2024-04-27 09:30:00', 'Task 1 for User 3', 'Description of task 1 for User 3', '{"frequency": "weekly"}', NULL, NULL),
    ('task2_user3', 3, '{"tag2": "2", "tag4": "4"}', NULL, '2024-04-28 11:30:00', 'Task 2 for User 3', 'Description of task 2 for User 3', '{}', NULL, NULL),

    ('b382a54b-8611-4cc7-a413-14ef9043b00e-0', 4, '{"school":"13d33e11-0bd5-41b1-82bd-e4d23dcd5d40", "SENG2":"b807fc95-9d40-4339-9605-89c4c1a3a28a"}', NULL, '2024-03-03 23:59:00', 'Status Report', E'# Status Report - Week 1\n### What Did you accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are you going to accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are your current roadblocks?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.', '{"frequency":"Weekly","end_time":"3 Months"}', '2024-06-03 18:59:00', NULL),
    ('b382a54b-8611-4cc7-a413-14ef9043b00e-1', 4, '{"school":"13d33e11-0bd5-41b1-82bd-e4d23dcd5d40", "SENG2":"b807fc95-9d40-4339-9605-89c4c1a3a28a"}', NULL, '2024-03-10 23:59:00', 'Status Report', E'# Status Report - Week 2\n### What Did you accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are you going to accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are your current roadblocks?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.', '{"frequency":"Weekly","end_time":"3 Months"}', '2024-06-03 18:59:00', NULL),
    ('b382a54b-8611-4cc7-a413-14ef9043b00e-2', 4, '{"school":"13d33e11-0bd5-41b1-82bd-e4d23dcd5d40", "SENG2":"b807fc95-9d40-4339-9605-89c4c1a3a28a"}', NULL, '2024-03-17 23:59:00', 'Status Report', E'# Status Report - Week 3\n### What Did you accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are you going to accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are your current roadblocks?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.', '{"frequency":"Weekly","end_time":"3 Months"}', '2024-06-03 18:59:00', NULL),
    ('b382a54b-8611-4cc7-a413-14ef9043b00e-3', 4, '{"school":"13d33e11-0bd5-41b1-82bd-e4d23dcd5d40", "SENG2":"b807fc95-9d40-4339-9605-89c4c1a3a28a"}', NULL, '2024-03-24 23:59:00', 'Status Report', E'# Status Report - Week 4\n### What Did you accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are you going to accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are your current roadblocks?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.', '{"frequency":"Weekly","end_time":"3 Months"}', '2024-06-03 18:59:00', NULL),
    ('b382a54b-8611-4cc7-a413-14ef9043b00e-4', 4, '{"school":"13d33e11-0bd5-41b1-82bd-e4d23dcd5d40", "SENG2":"b807fc95-9d40-4339-9605-89c4c1a3a28a"}', NULL, '2024-03-31 23:59:00', 'Status Report', E'# Status Report - Week 5\n### What Did you accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are you going to accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are your current roadblocks?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.', '{"frequency":"Weekly","end_time":"3 Months"}', '2024-06-03 18:59:00', NULL),
    ('b382a54b-8611-4cc7-a413-14ef9043b00e-5', 4, '{"school":"13d33e11-0bd5-41b1-82bd-e4d23dcd5d40", "SENG2":"b807fc95-9d40-4339-9605-89c4c1a3a28a"}', NULL, '2024-04-07 23:59:00', 'Status Report', E'# Status Report - Week 6\n### What Did you accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are you going to accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are your current roadblocks?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.', '{"frequency":"Weekly","end_time":"3 Months"}', '2024-06-03 18:59:00', NULL),
    ('b382a54b-8611-4cc7-a413-14ef9043b00e-6', 4, '{"school":"13d33e11-0bd5-41b1-82bd-e4d23dcd5d40", "SENG2":"b807fc95-9d40-4339-9605-89c4c1a3a28a"}', NULL, '2024-04-14 23:59:00', 'Status Report', E'# Status Report - Week 7\n### What Did you accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are you going to accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are your current roadblocks?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.', '{"frequency":"Weekly","end_time":"3 Months"}', '2024-06-03 18:59:00', NULL),
    ('b382a54b-8611-4cc7-a413-14ef9043b00e-7', 4, '{"school":"13d33e11-0bd5-41b1-82bd-e4d23dcd5d40", "SENG2":"b807fc95-9d40-4339-9605-89c4c1a3a28a"}', NULL, '2024-04-21 23:59:00', 'Status Report', E'# Status Report - Week 8\n### What Did you accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are you going to accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are your current roadblocks?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.', '{"frequency":"Weekly","end_time":"3 Months"}', '2024-06-03 18:59:00', NULL),
    ('b382a54b-8611-4cc7-a413-14ef9043b00e-8', 4, '{"school":"13d33e11-0bd5-41b1-82bd-e4d23dcd5d40", "SENG2":"b807fc95-9d40-4339-9605-89c4c1a3a28a"}', NULL, '2024-04-28 23:59:00', 'Status Report', E'# Status Report - Week 9\n### What Did you accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are you going to accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are your current roadblocks?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.', '{"frequency":"Weekly","end_time":"3 Months"}', '2024-06-03 18:59:00', NULL),
    ('b382a54b-8611-4cc7-a413-14ef9043b00e-9', 4, '{"school":"13d33e11-0bd5-41b1-82bd-e4d23dcd5d40", "SENG2":"b807fc95-9d40-4339-9605-89c4c1a3a28a"}', NULL, '2024-05-05 23:59:00', 'Status Report', E'# Status Report - Week 10\n### What Did you accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are you going to accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are your current roadblocks?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.', '{"frequency":"Weekly","end_time":"3 Months"}', '2024-06-03 18:59:00', NULL),
    ('b382a54b-8611-4cc7-a413-14ef9043b00e-10', 4, '{"school":"13d33e11-0bd5-41b1-82bd-e4d23dcd5d40", "SENG2":"b807fc95-9d40-4339-9605-89c4c1a3a28a"}', NULL, '2024-05-12 23:59:00', 'Status Report', E'# Status Report - Week 11\n### What Did you accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are you going to accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are your current roadblocks?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.', '{"frequency":"Weekly","end_time":"3 Months"}', '2024-06-03 18:59:00', NULL),
    ('b382a54b-8611-4cc7-a413-14ef9043b00e-11', 4, '{"school":"13d33e11-0bd5-41b1-82bd-e4d23dcd5d40", "SENG2":"b807fc95-9d40-4339-9605-89c4c1a3a28a"}', NULL, '2024-05-19 23:59:00', 'Status Report', E'# Status Report - Week 12\n### What Did you accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are you going to accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are your current roadblocks?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.', '{"frequency":"Weekly","end_time":"3 Months"}', '2024-06-03 18:59:00', NULL),
    ('b382a54b-8611-4cc7-a413-14ef9043b00e-12', 4, '{"school":"13d33e11-0bd5-41b1-82bd-e4d23dcd5d40", "SENG2":"b807fc95-9d40-4339-9605-89c4c1a3a28a"}', NULL, '2024-05-26 23:59:00', 'Status Report', E'# Status Report - Week 13\n### What Did you accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are you going to accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are your current roadblocks?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.', '{"frequency":"Weekly","end_time":"3 Months"}', '2024-06-03 18:59:00', NULL),
    ('b382a54b-8611-4cc7-a413-14ef9043b00e-13', 4, '{"school":"13d33e11-0bd5-41b1-82bd-e4d23dcd5d40", "SENG2":"b807fc95-9d40-4339-9605-89c4c1a3a28a"}', NULL, '2024-06-02 23:59:00', 'Status Report', E'# Status Report - Week 14\n### What Did you accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are you going to accomplish?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.\n\n### What are your current roadblocks?\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia.', '{"frequency":"Weekly","end_time":"3 Months"}', '2024-06-03 18:59:00', NULL),
    ('b0b81380-3dde-41ea-a7ef-a092ed3c8162', 4, '{"school":"13d33e11-0bd5-41b1-82bd-e4d23dcd5d40", "SENG2":"b807fc95-9d40-4339-9605-89c4c1a3a28a"}', '2024-04-30 11:00:00', '2024-04-30 13:30:00', 'Final Presentation', 'The final presentation/demo for our project.', '{"frequency":"None","end_time":"None"}', NULL, NULL),
    ('53d38f49-ddd2-4203-a96a-2ef1cd6a118a', 4, '{"School":"13d33e11-0bd5-41b1-82bd-e4d23dcd5d40","Automata":"370a4aa9-7377-47c5-a5be-99975287d7eb"}','2024-05-03 14:00:00', '2024-05-03 16:30:00', 'Regex Exam', E'# Operations Review\n\n1. A U B - A union B\n2. Concatenation A . B {xy | x exists in A, y exists in B}\nEx. {aa, ca} . {cc, bc} = {aacc, aabb, cacc, cabc}\n\n3. Kleen closure A\ ={x, x2, x3, .. xn | n>= 0, xi exists in A for i = 1, .., n}\nEx. {ab, cc}\  = {empty, ab, cc, abcc, abab, ccab, …}\n\nBasically you take the strings and concatenate them in any order\n\nRegular Expressions over Sigma\n\n1. 0/ is the empty set\n2. If c exists in Sigma, then c is a regular expression over Sigma\n3. A and B are regular expressions over Sigma, then so are \n    1. AuB\n    2. A.B   \n    3. A\n\n We write AB for A.B we don’t write the dot.\nThere is a precedence for these operations, it goes   > . > U\n\n1. 0/ stands for the empty set {}\n2. C stands for the singleton set {c}\n3. A\n\nL(E) the language that E describes.\n- L(0/) = {}\n- L(c) = {c}\n- L(AuB) = L(A) U L(B)\n- L(A.B) = L(A) . L(B)\n- L(A ) = L(A)',  '{"frequency":"None","end_time":"None"}', NULL, NULL),
    ('50a9aec5-8960-40bd-a7cc-ab572ac9b4c5-0', 4, '{"Work":"aab184ca-df38-4736-b31c-e12f2d4d016c"}', '2024-04-25 07:00:00', '2024-04-25 07:30:00', 'Weekly Team Meeting', 'Weekly check-in meeting to see what everyone has been working on.', '{"frequency":"Weekly","end_time":"1 Month"}', '2024-05-25 07:30:00', NULL),
    ('50a9aec5-8960-40bd-a7cc-ab572ac9b4c5-1', 4, '{"Work":"aab184ca-df38-4736-b31c-e12f2d4d016c"}', '2024-05-02 07:00:00', '2024-05-02 07:30:00', 'Weekly Team Meeting', 'Weekly check-in meeting to see what everyone has been working on.', '{"frequency":"Weekly","end_time":"1 Month"}', '2024-05-25 07:30:00', NULL),
    ('50a9aec5-8960-40bd-a7cc-ab572ac9b4c5-2', 4, '{"Work":"aab184ca-df38-4736-b31c-e12f2d4d016c"}', '2024-05-09 07:00:00', '2024-05-09 07:30:00', 'Weekly Team Meeting', 'Weekly check-in meeting to see what everyone has been working on.', '{"frequency":"Weekly","end_time":"1 Month"}', '2024-05-25 07:30:00', NULL),
    ('50a9aec5-8960-40bd-a7cc-ab572ac9b4c5-3', 4, '{"Work":"aab184ca-df38-4736-b31c-e12f2d4d016c"}', '2024-05-16 07:00:00', '2024-05-16 07:30:00', 'Weekly Team Meeting', 'Weekly check-in meeting to see what everyone has been working on.', '{"frequency":"Weekly","end_time":"1 Month"}', '2024-05-25 07:30:00', NULL),
    ('50a9aec5-8960-40bd-a7cc-ab572ac9b4c5-4', 4, '{"Work":"aab184ca-df38-4736-b31c-e12f2d4d016c"}', '2024-05-23 07:00:00', '2024-05-23 07:30:00', 'Weekly Team Meeting', 'Weekly check-in meeting to see what everyone has been working on.', '{"frequency":"Weekly","end_time":"1 Month"}', '2024-05-25 07:30:00', NULL),
    ('77278d3c-f006-496b-bc5e-7bd19339611c', 4, '{"Work":"aab184ca-df38-4736-b31c-e12f2d4d016c"}', NULL, '2024-05-06 13:00:00', 'Complete Assigned Work', E'# Things to complete this week:\n\n### Main Tasks\n\n1. Item 1\n2. Item 2\n    - Sub 2.1\n    - Sub 2.2\n3. Item 3\n\n### Backlog\n\n- Item 1\n- Item 2\n- Item 3\n- Item 4', '{"frequency":"None","end_time":"None"}', NULL, NULL);


-- Inserting original sample data into tags table
INSERT INTO tags (tag_id, user_id, tag_name, rgb_value) 
VALUES 
    (1, 1, 'Tag 1', '#FF5733'),
    (2, 1, 'Tag 2', '#33FF57'),
    (3, 1, 'Tag 3', '#3357FF'),
    (4, 2, 'Tag 4', '#57FF33'),
    (5, 3, 'Tag 1', '#FF5733'),
    (6, 3, 'Tag 2', '#33FF57'),
    ('13d33e11-0bd5-41b1-82bd-e4d23dcd5d40', 4, 'School', '#92e198'),
    ('b807fc95-9d40-4339-9605-89c4c1a3a28a', 4, 'SENG2', '#a026ff'),
    ('370a4aa9-7377-47c5-a5be-99975287d7eb', 4, 'Automata', '#ff65f9'),
    ('aab184ca-df38-4736-b31c-e12f2d4d016c', 4, 'Work', '#4d64ff');
