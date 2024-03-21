DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);