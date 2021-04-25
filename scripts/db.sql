DROP TABLE IF EXISTS Users;

CREATE TABLE Users
(
    id UUID PRIMARY KEY,
    login VARCHAR(20) UNIQUE NOT NULL CHECK(password <>''),
    password VARCHAR(15) NOT NULL CHECK(password <>''),
    age SMALLINT NOT NULL CHECK(age >0 AND Age < 200)
);

INSERT INTO Users (id, login, password, age) 
VALUES 
(
    '795b54f5-9566-42d8-b71c-dfb4b0df17f3',
    'test_user_1',
    'test_password_1',
    24
),
(
    'e93256ee-c004-4d8c-92fc-8e19d83218f8',
    'test_user_2',
    'test_password_2',
    26
),
(
    '651a9490-4e0c-493f-9905-a4ce82bd2bd7',
    'test_user_3',
    'test_password_3',
    14
),
(
    '9b738e11-f1ea-470d-94d4-5dc7638583a2',
    'test_user_4',
    'test_password_4',
    54
),
(
    'c825e06a-770e-423d-84b1-4db0f68d15c1',
    'test_user_5',
    'test_password_5',
    40
);
