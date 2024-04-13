const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
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
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update an Employee Role":
          updateEmployeeRole();
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
  db.query(
    "SELECT role.title, role.id, department.name, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;",
    (err, result) => {
      if (err) throw err;
      console.table(result);
      menu();
    }
  );
}

function viewEmployees() {
  db.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, manager.first_name AS managerFirstName, manager.last_name AS managerLastName FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON manager.id =  employee.manager_id;",
    (err, result) => {
      if (err) throw err;
      console.table(result);
      menu();
    }
  );
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDepartment",
        message: "Please enter the Department name:",
      },
    ])
    .then((answer) => {
      db.query(
        `INSERT INTO department (name) VALUES ("${answer.addDepartment}")`,
        (err, result) => {
          if (err) throw err;
          console.log("department added");
          menu();
        }
      );
    });
}

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
function addRole() {
  db.query("SELECT * from department", (err, result) => {
    if (err) throw err;

    const departmentData = result.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the name of the role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role?",
        },
        {
          type: "list",
          name: "department_id",
          message: "Which department does the role belong to?",
          choices: departmentData,
        },
      ])
      .then((answer) => {
        console.log(answer);
        db.query(
          `INSERT INTO role (title, salary, department_id) VALUES ("${answer.title}", "${answer.salary}", "${answer.department_id}")`,
          (err, result) => {
            if (err) throw err;
            console.log("role added");
            menu();
          }
        );
      });
  });
}

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
function addEmployee() {
  db.query(`SELECT * FROM role`, (err, result) => {
    if (err) throw err;

    const roleData = result.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    db.query(`SELECT * FROM employee`, (err, result) => {
      if (err) throw err;

      const employeeData = result.map(({ first_name, last_name, id }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));

      employeeData.unshift({
        name: "No Manager",
        value: null,
      });

      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?",
          },
          {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?",
          },
          {
            type: "list",
            name: "role_id",
            message: "What is the employee's role?",
            choices: roleData,
          },
          {
            type: "list",
            name: "manager_id",
            message: "Who is this employee's manager?",
            choices: employeeData,
          },
        ])
        .then((answer) => {
          console.log(answer);
          db.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.first_name}", "${answer.last_name}", "${answer.role_id}", "${answer.manager_id}")`,
            (err, result) => {
              if (err) throw err;
              console.log("role added");
              menu();
            }
          );
        });
    });
  });
}

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
function updateEmployeeRole() {
  db.query(`SELECT * FROM role`, (err, result) => {
    if (err) throw err;

    const roleData = result.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    db.query(`SELECT * FROM employee`, (err, result) => {
      if (err) throw err;

      const employeeData = result.map(({ first_name, last_name, id }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));

      employeeData.unshift({
        name: "No Manager",
        value: null,
      });

      inquirer
        .prompt([
          {
            type: "list",
            name: "employee_id",
            message: "What is the name of the employee you'd like to update?",
            choices: employeeData,
          },
          {
            type: "list",
            name: "role_id",
            message: "What is their new role?",
            choices: roleData,
          },
        ])
        .then((answer) => {
          console.log(answer);
          db.query(
            `UPDATE employee SET role_id = ${answer.role_id} WHERE id = "${answer.employee_id}"`,
            (err, result) => {
              if (err) throw err;
              console.log("role updated");
              menu();
            }
          );
        });
    });
  });
}

menu();
