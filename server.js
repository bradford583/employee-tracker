//import express
const express = require('express');
//import mysql
const mysql = require('mysql2');
//port designation
const PORT = process.env.PORT || 3003;
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: '',
      database: 'store_employees'
    },
    console.log('Connected to the store_employees database.')
  );

  // Get all employees
app.get('/api/employees', (req, res) => {
  const sql = `SELECT employee.*, parties.name
              AS party_name
              FROM candidates
              LEFT JOIN parties
              ON candidates.party_id = parties.id`;

  db.query(sql, (err, rows) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({
          message: 'success',
          data: rows
      });
  });
});

//Get single employee
app.get('/api/employee/:id', (req, res) => {
  const sql = `SELECT employee.*, parties.name
              AS party_name
              FROM candidates
              LEFT JOIN parties
              ON candidates.party_id = parties.id
              WHERE candidates.id = ?`;

  db.query(sql, params, (err, row) => {
      if (err) {
          res.status(400).json({ error: err.message });
          return;
      }
      res.json({
          message: 'success',
          data: row
      });
  });
});

//Delete a employee
app.delete('/api/employee/:id', (req, res) => {
  const sql = `DELETE FROM employee WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
      if (err) {
          res.statusMessage(400).json({ error: err.message });
      } else if (!result.affectedRows) {
          res.json({
              message: 'Employee not found'
          });
      } else {
          res.json({
              message: 'deleted',
              changes: result.affectedRows,
              id: req.params.id
          });
      }
  });
});

//Create a candidate
app.post('/api/employee', ({ body }, res) => {
  const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
  if (errors) {
      res.status(400).json({ error: errors });
      return;
  }

  const sql = `INSERT INTO employee (first_name, last_name, industry_connected)
  VALUES (?, ?, ?)`;
  const params = [body.first_name, body.last_name, body.industry_connected];

  db.query(sql, params, (err, result) => {
      if (err) {
          res.status(400).json({ error: err.message });
          return;
      }
      res.json({
          message: 'success',
          data: body
      });
  });
});

app.get('/api/parties', (req, res) => {
  const sql = `SELECT * FROM parties`;
  db.query(sql, (err, rows) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({
          message: 'success',
          data: rows
      });
  });
});

app.get('/api/party/:id', (req, res) => {
  const sql = `SELECT * FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, row) => {
      if (err) {
          res.status(400).json({ error: err.message });
          return;
      }
      res.json({
          message: 'success',
          data: row
      });
  });
});


//Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});