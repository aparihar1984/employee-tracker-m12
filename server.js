// Import and require inquirer and mysql2
const inquirer = require("inquirer");
const mysql = require("mysql2");

// Connecting to database
const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employeeTracker_db",
});

// Connecting to the database
db.connect((err) => {
    if (err) throw err;
    console.log("Connected to the Employee Tracker Database!");
    // Starting the application
    start();
});