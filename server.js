//import dependencies
const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql");
//port designation
const PORT = process.env.PORT || 3003;
const app = express();

const empTable = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.department_name, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
      FROM employee 
      LEFT JOIN manager ON employee.manager_id = manager.id
      LEFT JOIN roles ON employee.role_id = roles.id 
      LEFT JOIN department ON employee.department_id = department.id`;
      
const roleQuery = 'SELECT * from roles; SELECT CONCAT (e.first_name," ",e.last_name) AS full_name FROM employee e'
const addEmployeeQuestions = [
  "What is the first name?",
  "What is the last name?",
  "What is their role?",
  "Who is their manager?",
];

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // Your MySQL username,
    user: "root",
    // Your MySQL password
    password: "12161985Cb$",
    database: "store_employees",
  },
  console.log("Connected to the store_employees database.")
);

function startServer() {
  inquirer
    .prompt({
      message: "What would you like to do?",
      name: "start",
      type: "list",
      choices: [
        "View all employees",
        "View all roles",
        "View all departments",
        "Add an employee",
        "Add a department",
        "Add a role",
        "Update an employee",
      ],
    })
    .then(function (response) {
      switch (response.start) {
        case "View all employees":
          viewEmps();
          break;

        case "View all departments":
          viewDept();
          break;

        case "View all roles":
          viewRoles();
          break;

        case "Add an employee":
          addEmp();
          break;

        case "Add a department":
          addDept();
          break;

        case "Add a role":
          addRole();
          break;

        case "Update an employee":
          updateEmp();
          break;
      }
    });
}

const viewEmps = () => {
  db.query(empTable, function (err, rows) {
    if (err) throw err;
    console.table(rows);
    startServer();
  });
};

const viewDept = () => {
  const deptQuery = `SELECT * FROM department`;
  db.query(deptQuery, function (err, rows) {
    if (err) throw err;
    console.table(rows);
    startServer();
  });
};

const viewRoles = () => {
  const rolesQuery = `SELECT * FROM roles`;
  db.query(rolesQuery, function (err, rows) {
    if (err) throw err;
    console.table(rows);
    startServer();
  });
};

const addEmp = () => {
  db.query(roleQuery, (err, results) => {
      if (err) throw err;

      inquirer.prompt([
          {
              name: 'fName',
              type: 'input',
              message: addEmployeeQuestions[0]

          },
          {
              name: 'lName',
              type: 'input',
              message: addEmployeeQuestions[1]
          },
          {
              name: 'role',
              type: 'list',
              choices: function () {
                  let choiceArray = results[0].map(choice => choice.title);
                  return choiceArray;
              },
              message: addEmployeeQuestions[2]

          },
          {
              name: 'manager',
              type: 'list',
              choices: function () {
                  let choiceArray = results[1].map(choice => choice.full_name);
                  return choiceArray;
              },
              message: addEmployeeQuestions[3]

          }
      ]).then((answer) => {
            db.query(
              `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, 
              (SELECT id FROM roles WHERE title = ? ), 
              (SELECT id FROM (SELECT id FROM employee WHERE CONCAT(first_name," ",last_name) = ? ) AS tmptable))`, [answer.fName, answer.lName, answer.role, answer.manager]
          )
          startServer();
      })
  })
}

//Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startServer();
