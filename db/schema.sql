-- SQL Commands to drop, create and use a potential database
DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;
USE employeeTracker_db;

-- Creating the departments table, which generates random ids
CREATE TABLE departments (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
department_name VARCHAR(30) NOT NULL
);

-- Creating the role table, which generates random ids
CREATE TABLE roles (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30),
-- DECIMAL(8,2) means there is a decimal number with a total precision of 8 digits. 2 of them after the decimal point and 6 before.
salary DECIMAL(8,2),
department_id INT,
-- Establishing the FK - PK connection as shown in the Mock Up diagram in the Assignment Page
FOREIGN KEY (department_id)
REFERENCES departments(id)
ON DELETE SET NULL
);

CREATE TABLE employee (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT,
-- Establishing the FK - PK connection as shown in the Mock Up diagram in the Assignment Page
FOREIGN KEY (role_id)
REFERENCES roles(id),
manager_id INT,
-- Establishing the FK - PK connection as shown in the Mock Up diagram in the Assignment Page
FOREIGN KEY (manager_id)
REFERENCES employee(id)
);