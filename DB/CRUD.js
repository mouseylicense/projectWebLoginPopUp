
const path = require('path');
const sql = require('./DB');
const cookie = require('cookie-parser');
const csv = require('csvtojson');

const createResultsTable = (req, res) => {
    const Q1 = "CREATE TABLE IF NOT EXISTS `nutrition` (bmr FLOAT(10,2), tdee FLOAT(10,2), fat FLOAT(10,2), fatCals FLOAT(10,2), protein FLOAT(10,2), proteinCals FLOAT(10,2), carbs FLOAT(10,2), carbsCals FLOAT(10,2))";
    sql.query(Q1, (err, mysqlres) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("table created");
        return;
    })
}
//bmr, tdee, fat, fatCals, protein, proteinCals, carbs, carbsCals
const createTable = (req, res) => {
    const Q1 = "CREATE TABLE IF NOT EXISTS `users` (email VARCHAR(255) PRIMARY KEY NOT NULL, name VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL,  gender VARCHAR(255),age INT ,activityLevel VARCHAR(255) ,height INT ,weight INT ,goal VARCHAR(255))";
    sql.query(Q1, (err, mysqlres) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("user table created");
        return;
    })
    const adminUser = {
        email: 'admin@admin.admin',
        name: 'admin',
        password: 'admin'
    };
    // run insert query
    const Q3 = "INSERT IGNORE INTO users SET ?";
    sql.query(Q3, adminUser, (err, mysqlres) => {
        if (err) {
            console.log(err);
            console.log("something went wrong");
            return;
        }
        console.log("details entered");
    });
};

const createGymTable = (req, res) => {
    const Q8 = "CREATE TABLE IF NOT EXISTS `gyms` ( gymName VARCHAR(255) NOT NULL, address VARCHAR(255) NOT NULL, lat DECIMAL(9,6) NOT NULL, lon DECIMAL(9,6) NOT NULL,rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5))";
    sql.query(Q8, (err, mysqlres) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("GYMStable created");
        return;
    })
};
const insertData = (req, res) => {
    const csvPath = path.join(__dirname, "data.csv");
    /// this is new
    csv().fromFile(csvPath).then((jsonObj) => {
        console.log(jsonObj);
        for (let i = 0; i < jsonObj.length; i++) {
            const element = jsonObj[i];
            console.log(element);
            const NewCsvData = {
                name: element.name,
                email: element.email,
                password: element.password
            };
            const Q2 = "insert into users set ?";
            sql.query(Q2, NewCsvData, (err, mysqlres) => {
                if (err) {
                    throw err
                }
                //res.send('Data inserted into table');
            });
        }

    });
    res.send("ok");
};


const createNewUser = (email, nameUser, password, res) => {
    const newUser = {
        email,
        name: nameUser,
        password
    };
    // run insert query
    const Q3 = "INSERT INTO users SET ?";
    sql.query(Q3, newUser, (err, mysqlres) => {
        if (err) {
            console.log(err);
            console.log("something went wrong");
            return;
        }
        console.log("details entered");
    });
};

const insertNewDetails = (email, gender, age, activityLevel, height, weight, goal, callback) => {
    const Q4 = "UPDATE users SET gender = ?, age = ?, activityLevel = ?, height = ?, weight = ?, goal = ? WHERE email = ?";
    sql.query(Q4, [gender, age, activityLevel, height, weight, goal, email], (err, results) => {
        if (err) {
            // TODO:you are not actually passing a callback when calling the function, this results in an error every time
            callback(err, null);
            return;
        }
        console.log("details entered");
    })
};

const checkUserExists = (email, callback) => {
    const Q6 = "SELECT EXISTS (SELECT 1 FROM users WHERE email = ?) AS userExists";
    sql.query(Q6, [email], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        console.log(results)
        const userExists = results[0].userExists === 1;
        callback(null, userExists);
    });
};
const validateUser = (email, password, callback) => {
    const Q5 = "SELECT EXISTS (SELECT 1 FROM users WHERE email = ? AND password = ?) AS userExists";
    sql.query(Q5, [email, password], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        const userExists = results[0].userExists === 1;
        callback(null, userExists);
    });
};

const validateAdmin = (email, password, callback) => {
    const Q5 = "SELECT EXISTS (SELECT 1 FROM users WHERE email = ? AND password = ?) AS isAdmin";
    sql.query(Q5, [email, password], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        const isAdmin = results[0].isAdmin === 1;
        callback(null, isAdmin);
    });
};
function errorCulc(req, res) {
    console.log('hi');
    const missingDataMessage = "Missing Data, Try Refilling The Form";
    const htmlResponse = `<div id="caloriesData">${missingDataMessage}</div>`;
    res.sendFile(htmlResponse);
}
const culcResults = (gender, age, activityLevel, height, weight, goal, callback) => {
    console.log('hi');
    const dataAll = { gender, age, activityLevel, height, weight, goal }
    var bmrMen = weight * 10 + height * 6.25 - age * 5 + 5;
    var bmrWomen = weight * 10 + height * 6.25 - age * 5 - 161;
    var tdee = 0;

    if (gender === 'male') {
        if (activityLevel === 'sedentary') {
            tdee = bmrMen * 1.4;
        } else if (activityLevel === 'moderately active') {
            tdee = bmrMen * 1.6;
        } else if (activityLevel === 'active') {
            tdee = bmrMen * 1.8;
        } else {
            errorCulc();
        }
    } else if (gender === 'female') {
        if (activityLevel === 'sedentary') {
            tdee = bmrWomen * 1.4;
        } else if (activityLevel === 'moderately active') {
            tdee = bmrWomen * 1.6;
        } else if (activityLevel === 'active') {
            tdee = bmrWomen * 1.8;
        } else {
            errorCulc();
        }
    } else {
        errorCulc();
    }
    return
}
//lehosif check all querys for admin- עובר על הכל וברגע שיש שאילתה שלא עובדת שולח מה השאילתה ומפסיק לרוץ, צריך להתחל את כל המשתנים לפני
//lehashlimmmmmmmmmmmmmmmmmmmm et col ha tables
const dropAllTables = (req, res) => {
    console.log("test")
    const Q10 = 'DROP TABLE IF EXISTS users, gyms, nutrition ;';
    sql.query(Q10, (err, mysqlres) => {
        if (err) {
            console.log(err);
            res.status(400).send(err);
            return;
        }
        console.log("table dropped");


        return;
    })
};
module.exports = { culcResults, createGymTable, createResultsTable, validateAdmin, validateUser, checkUserExists, createTable, createNewUser, insertNewDetails, dropAllTables, insertData };