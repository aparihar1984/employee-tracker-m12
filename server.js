// Import and require both inquirer and mysql2
const inquirer = require("inquirer");
const mysql = require("mysql2");

// Connecting to the database
const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // MySQL Username
    user: "root",
    // MySQL Password
    password: "1977BlueJays!",
    database: "employeeTracker_db",
});

// Connecting to the database
db.connect((err) => {
    // If statement used in case of an error.  If there are no errors, the application will start.
    if (err) throw err;
    console.log("Connected to the Employee Tracker Database!");
    // Starting the application
    start();
});

// Function to Start SQL Employee Tracker Application
function start() {
    // Prompt for the user to select what they would like to do out of a list of choices
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
        // Actions taken based on which choice the user makes
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
    // Using JOIN to combine rows from multiple table based on a realted column
    const query = "SELECT roles.title, roles.id, departments.department_name, roles.salary FROM roles JOIN departments on roles.department_id = departments.id";
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Function to view employees
function viewAllEmployees() {
    // CONCAT is used to combine the first and last names
    // Employee shortened to e, role shortened to r and department shortened to d for clarity purposes
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

// Function to add a role
function addRole() {
    // Using the SELECT * FROM to add a new entry (role) to the departments table
    const query = "SELECT * FROM departments";
    db.query(query, (err, res) => {
        if (err) throw err;
        inquirer.prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Enter the title of the new role:",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Enter the salary of the new role:",
                },
                {
                    type: "list",
                    name: "department",
                    message: "Select the department for the new role:",
                    choices: res.map(
                        (department) => department.department_name
                    ),
                },
            ])
            .then((answers) => {
                const department = res.find(
                    (department) => department.name === answers.department
                );
                // Inserting the user entries for the new role, salary and department into the database
                const query = "INSERT INTO roles SET ?";
                db.query(
                    query,
                    {
                        title: answers.title,
                        salary: answers.salary,
                        department_id: department,
                    },
                    (err, res) => {
                        if (err) throw err;
                        // Displaying the addition of the new role and its details in the terminal
                        console.log(
                            `Added role ${answers.title} with salary ${answers.salary} to the ${answers.department} department in the database!`
                        );
                        start();
                    }
                );
            });
    });
}
