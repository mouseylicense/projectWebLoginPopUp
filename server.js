const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
const sql = require('./DB/DB');
const CRUD = require('./DB/CRUD')
const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'Alfa_Slab_One')));
app.use(express.static(path.join(__dirname, 'static'), { type: 'application/javascript' }));
app.set('views', path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookie());

app.get('/', (req, res) => {
  CRUD.createTable();
  res.redirect('/login');
});
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/indexAdmin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'indexAdmin.html'));
});
app.get('/index2', (req, res) => {
  CRUD.createResultsTable();
  res.sendFile(path.join(__dirname, 'views', 'index2.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'indexlogin.html'));
});
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'indexsignup.html'));
});


//admin-actions
app.post('/dropTables', (req,res) => {
  CRUD.dropAllTables(req,res)
  res.redirect("/indexAdmin");
})
app.post('/createTables', (req, res) => {
  CRUD.createGymTable();
  CRUD.createTable();
  console.log("create table ran")
  res.redirect("/indexAdmin")
});

//signup_page
app.post('/signup', (req, res) => {
  const { nameUser, email, password, password2 } = req.body;

  if (password == password2) {
    CRUD.checkUserExists(email, (err, userExists) => {
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred');
        return;
      }

      if (userExists) {
        res.send('<script>alert("User with the provided email already exists"); window.history.back();</script>');
      } else {
        CRUD.createNewUser(email, nameUser, password, (err, results) => {
          if (err) {
            console.log(err);
            res.status(500).send('An error occurred');
            return;
          }
          res.sendFile(path.join(__dirname, 'views', 'indexlogin.html'));
        });
      }
    });
  } else {
    res.send('<script>alert("Passwords do not match"); window.history.back();</script>');
  }
});

//login_page
app.post('/loginButton', (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  CRUD.validateUser(email, password, (err, userExists) => {
    console.log(userExists)
    if (err) {
      console.log(err);
      res.status(500).send(`An error occurred while validating user ${err}`);
      return;
    }
    if (userExists) {
      const adminEmail = 'admin@admin.admin';
      const adminPassword = 'admin';
      if (email === adminEmail && password === adminPassword) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ Exists: "Admin" }))
        return;
      } else {
        res.cookie('signedEmail', email);
        res.cookie('signedPassword', password);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ Exists: true }))
      }
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ Exists: false }))
    }
  })
});

app.post('/formDetails', (req, res) => {
  const { gender, age, activityLevel, height, weight, goal } = req.body;
  var email = req.cookies.signedEmail;

  if (isNaN(age) || isNaN(height) || isNaN(weight) || weight < 0 || height < 0 || age < 0) {
    res.status(400).send('<script>alert("Invalid input"); window.history.back();</script>');
    return;
  } else {
    CRUD.culcResults(gender, age, activityLevel, height, weight, goal);

    CRUD.insertNewDetails(email, gender, age, activityLevel, height, weight, goal);
    res.sendFile(path.join(__dirname, 'views', 'index2.html'));
  }
});

app.get('/results', CRUD.culcResults);
// app.get('/createTable', CRUD.createTable);
// app.get('/insertData', CRUD.insertData);
// app.get('/dropAllTables', CRUD.dropAllTables);
// app.get('/createNewUser', CRUD.createNewUser);
// app.get('/createNewUser', CRUD.insertNewDetails);
// app.get('/checkUserExists', CRUD.checkUserExists);
// app.get('/checkUserExists', CRUD.validateUser);
// app.get('/checkUserExists', CRUD.validateAdmin);
// app.get('/checkUserExists', CRUD.createGymTable);
// app.get('/checkUserExists', CRUD.createResultsTable);
sql.connect((err) => {
  if (err) {
    console.error('Failed to connect to the SQL database:', err);
  } else {
    console.log('Connected to the SQL database');
  }
});

app.listen(port, () => {
  console.log(`Server is running on :`, port);
});

