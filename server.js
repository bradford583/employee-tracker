//import dependencies
const { table } = require("console");
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
      ],
    })
    .then(function (response) {
      switch (response.start) {
        case "View all employees":
          viewEmps();
          break;

        case "View all departments":
        viewByDept();
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

const viewByDept = () => {
  const deptQuery = `SELECT * FROM department`;
  db.query(deptQuery, function (err, rows) {
    if (err) throw err;
    console.table(rows);
    startServer();
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
