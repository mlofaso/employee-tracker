// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "",
    database: "employees_db",
  },
  console.log(`Connected to the courses_db database.`)
);

function menu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "Please select from the following options:",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Quit",
        ],
      },
    ])
    .then(function (answers) {
      switch (answers.options) {
        case "View All Departments":
          viewDepartments();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Employees":
          viewEmployees();
          break;
        default:
          process.exit();
          break;
      }
    });
}

function viewDepartments() {
  db.query("SELECT * FROM department;", (err, result) => {
    if (err) throw err;
    console.table(result);
    menu();
  });
}

function viewRoles() {
  db.query("SELECT * FROM role;", (err, result) => {
    if (err) throw err;
    console.table(result);
    menu();
  });
}

function viewEmployees() {
  db.query("SELECT * FROM employee;", (err, result) => {
    if (err) throw err;
    console.table(result);
    menu();
  });
}
menu();
