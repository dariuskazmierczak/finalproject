DROP TABLE IF EXISTS education;
DROP TABLE IF EXISTS personal;
DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    email VARCHAR (255) NOT NULL UNIQUE,
    password VARCHAR (255) NOT NULL,
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_codes
(
    id SERIAL PRIMARY KEY,
    email VARCHAR (255) NOT NULL,
    code VARCHAR (255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE personal
(
    id SERIAL PRIMARY KEY,
    first VARCHAR (255) NOT NULL DEFAULT 'unknown',
    last VARCHAR (255) NOT NULL DEFAULT 'unknown',
    email VARCHAR (255) NOT NULL DEFAULT 'unknown@unknown',
    phone VARCHAR (255) NOT NULL DEFAULT 'unknown',
    location VARCHAR (255) NOT NULL DEFAULT 'unknown',
    jobcategory VARCHAR (255) NOT NULL DEFAULT 'unknown',
    user_id INT REFERENCES users(id) NOT NULL,
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE education
(
    id SERIAL PRIMARY KEY,
    school_name VARCHAR (255) NOT NULL DEFAULT 'unknown',
    school_location VARCHAR (255) NOT NULL DEFAULT 'unknown',
    degree VARCHAR (255) NOT NULL DEFAULT 'unknown',
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL DEFAULT CURRENT_DATE,
    user_id INT REFERENCES users(id) NOT NULL,
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
