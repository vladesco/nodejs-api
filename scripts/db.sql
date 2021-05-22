DROP TABLE IF EXISTS Groups CASCADE;
DROP TABLE IF EXISTS Permissions CASCADE;
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS GroupPermissions CASCADE;
DROP TABLE IF EXISTS UserGroups CASCADE;
DROP TABLE IF EXISTS AuthUsers CASCADE;

CREATE TABLE Users
(
    id UUID PRIMARY KEY,
    login VARCHAR(20) UNIQUE NOT NULL CHECK(password <>''),
    password VARCHAR(15) NOT NULL CHECK(password <>''),
    age SMALLINT NOT NULL CHECK(age >0 AND Age < 200)
);

CREATE TABLE Permissions(
    name VARCHAR(20) PRIMARY KEY
);

CREATE TABLE Groups(
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE GroupPermissions(
     permission_name VARCHAR(20) REFERENCES Permissions(name) ON DELETE CASCADE,
     group_id UUID REFERENCES Groups(id) ON DELETE CASCADE,
     PRIMARY KEY(permission_name, group_id)
);

CREATE TABLE UserGroups(
    group_id UUID REFERENCES Groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    PRIMARY KEY(group_id, user_id)
);

CREATE TABLE AuthUsers(
    auth_id UUID PRIMARY KEY,
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    token VARCHAR(100)
);

INSERT INTO Users (id, login, password, age) 
VALUES 
(
    '795b54f5-9566-42d8-b71c-dfb4b0df17f3',
    'testUser1',
    'testPassword1',
    24
),
(
    'e93256ee-c004-4d8c-92fc-8e19d83218f8',
    'testUser2',
    'testPassword2',
    26
),
(
    '651a9490-4e0c-493f-9905-a4ce82bd2bd7',
    'testUser3',
    'testPassword3',
    14
),
(
    '9b738e11-f1ea-470d-94d4-5dc7638583a2',
    'testUser4',
    'testPassword4',
    54
),
(
    'c825e06a-770e-423d-84b1-4db0f68d15c1',
    'testUser5',
    'testPassword5',
    40
);

INSERT INTO Permissions (name)
VALUES
    ('READ'),
    ('WRITE'),
    ('DELETE'),
    ('SHARE'),
    ('UPLOAD_FILES');

INSERT INTO Groups (id, name)
VALUES
(
    '24c87820-c023-46a9-b9d5-4d136d689234',
    'default group'
);

INSERT INTO GroupPermissions (group_id, permission_name)
VALUES
(
    '24c87820-c023-46a9-b9d5-4d136d689234',
    'READ'
);

INSERT INTO UserGroups (group_id, user_id)
VALUES
(
  '24c87820-c023-46a9-b9d5-4d136d689234',
  '795b54f5-9566-42d8-b71c-dfb4b0df17f3'
),
(
  '24c87820-c023-46a9-b9d5-4d136d689234',
  'e93256ee-c004-4d8c-92fc-8e19d83218f8'
),
(
  '24c87820-c023-46a9-b9d5-4d136d689234',
  '651a9490-4e0c-493f-9905-a4ce82bd2bd7'
),
(
  '24c87820-c023-46a9-b9d5-4d136d689234',
  '9b738e11-f1ea-470d-94d4-5dc7638583a2'
),
(
  '24c87820-c023-46a9-b9d5-4d136d689234',
  'c825e06a-770e-423d-84b1-4db0f68d15c1'
);
