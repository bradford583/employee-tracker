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
      
const empQuery = 'SELECT CONCAT(e.first_name," ",e.last_name) AS full_name FROM employee AS e';
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

const rolesQuery = (callback) => {
  let sqlQuery = `SELECT * FROM roles`
  db.query(sqlQuery,  function(err, results)  {
    if (err) throw err;
    let data = [];
    results.forEach(element => {
      data.push(element)
    });;
    callback(data);
  })
  //return results;
};

const managerQuery = () => {
  let sqlQuery = `SELECT * FROM manager`
  db.query(sqlQuery, (err, results) => {
    //console.log(results);
    return results;
  });
  //return results;
};

const addEmp = () => {
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
              choices: rolesQuery(function (data){
                return Object.values(data)
              }),
              message: addEmployeeQuestions[2]

          },
          {
              name: 'manager',
              type: 'list',
              choices: managerQuery(),
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
  };

const addDept = () => {
  inquirer.prompt({
      name: 'dept',
      type: 'input',
      message: 'What is the name of the department?'
    }).then(function(response) {
      let sqlQuery = `INSERT INTO department SET ?`;
      db.query(sqlQuery, { department_name: response.dept }, (err, res) => {
        if (err) throw err;
        console.log('department added');
      });
      startServer();
    });
};


//Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startServer();
