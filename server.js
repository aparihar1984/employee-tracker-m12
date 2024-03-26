// Import and require inquirer and mysql2
const inquirer = require("inquirer");
const mysql = require("mysql2");

// Connecting to the database
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

// Function to Start SQL Employee Tracker Application
function start() {
    inquirer.prompt({
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "Exit",
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "View all employees":
                    viewAllEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update an employee role":
                    updateEmployeeRole();
                    break;
                case "Exit":
                    console.log("Goodbye!");
                    db.end();
                    break;
            }
        });
}

// Function to view departments
function viewAllDepartments() {
    const query = "SELECT * FROM departments";
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Function to view roles
function viewAllRoles() {
    const query = "SELECT roles.title, roles.id, departments.department_name, roles.salary FROM roles JOIN departments on roles.department_id = departments.id";
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Function to view employees
function viewAllEmployees() {
    const query = `
    SELECT e.id, e.first_name, e.last_name, r.title AS role, d.department_name AS department, r.salary, 
    CONCAT(m.first_name, ' ', m.last_name) AS manager_name 
    FROM employee e
    LEFT JOIN employee m ON e.manager_id = m.id 
    INNER JOIN roles r ON e.role_id = r.id 
    INNER JOIN departments d ON r.department_id = d.id;
    `;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Function to add a Department
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the new department?',
        }
    ]).then((answer) => {
        const query = `INSERT INTO departments (department_name) VALUES('${answer.name}')`;
        db.query(query, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Added " + answer.name + " to the database!")
            start();
        });
    });
};

