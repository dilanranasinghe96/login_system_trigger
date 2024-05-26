const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dilanranasinghe099@gmail.com', // Your Gmail email address
    pass: '#####'    // Your Gmail password
  }
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'login_system'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Register endpoint
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  
  // Check if email already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Internal Server Error.');
      return;
    }

    if (results.length > 0) {
      res.status(400).send('Email already registered.');
      return;
    }

    // Encrypt the password
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        res.status(500).send('Error hashing password.');
        return;
      }

      // Save user to the database with hashed password
      const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
      db.query(sql, [email, hash], (err, result) => {
        if (err) {
          console.error('Error saving user:', err);
          res.status(500).send('Error saving user.');
          return;
        }
        console.log('User registered successfully:', result);
        
        // Send a descriptive response message
        res.status(200).send('User registered successfully');
      });
    });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const loginSql = 'SELECT * FROM users WHERE email = ?';

  db.query(loginSql, [email], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Internal Server Error.');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('User not found.');
      return;
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        res.status(500).send('Internal Server Error.');
        return;
      }

      if (!result) {
        res.status(401).send('Incorrect password.');
        return;
      }

      // Insert login attempt into the login_attempts table
      const insertLoginAttemptSql = 'INSERT INTO login_attempts (email, timestamp) VALUES (?, NOW())';
      db.query(insertLoginAttemptSql, [email], (err, result) => {
        if (err) {
          console.error('Error saving login attempt:', err);
          // Proceed even if there's an error saving the login attempt
        } else {
          console.log('Login attempt saved:', result);
        }
      });

      const mailOptions = {
        from: 'dilanranasinghe099@gmail.com',
        to: email,
        subject: 'Login Notification',
        text: 'Hello, you have successfully logged in.'
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });

      res.status(200).send('Login successful');
    });
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001.');
});
