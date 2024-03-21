USE employees_db;

INSERT INTO department (name)
VALUES ("Research & Development"),
       ("Human Resources"),
       ("Customer Service"),
       ("Management");

INSERT INTO role (title, salary, department_id)
VALUES ("R&D Officer", 90000, 1),
       ("HR Director", 70000, 2),
       ("CS Representative", 60000, 3),
       ("Manager", 100000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Smith", 4, NULL),
       ("Ella", "Fitzgerald", 2, 1),
       ("Geoffrey", "Lewis", 1, 1),
       ("Lucy", "Lawless", 3, 1);