// Author: Nayandeep Sidhu 
// Date Created: August 10th, 2021

const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const PORT = process.env.PORT || 3002; 
const app = express(); 

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '***************',
    database: 'employee_db'    
})

connection.connect(err => {
    if (err) throw err; 
    console.log('connected as id' + connection.threadId + '\n');
    initiateApp ();
});

const initiateApp = () => {

    const questions = () => {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'menu',
                message: 'Select actions from below:',
                choices: [
                    'View all Departments',
                    'View all Roles',
                    'View all Employees',
                    'Add a Department',
                    'Add a Role',
                    'Add an Employee',
                    'Update an Employee Role',
                ],
            }
        ])

            .then(answers => {
                if (answers.menu === 'View all Departments'){
                    displayDepartments(); 
                }
                if (answers.menu === 'View all Roles'){
                    displayRoles(); 
                }
                if (answers.menu === 'View all Employees'){
                    displayDepartments(); 
                }
                if (answers.menu === 'Add a Department'){
                    addDepartment(); 
                }
                if (answers.menu === 'Add a Role'){
                    addRole(); 
                }
                if (answers.menu === 'Add an Employee'){
                    addEmployee(); 
                }
                if (answers.menu === 'Update an Employee'){
                    addEmployee(); 
                }
                if (answers.menu === 'Finished'){
                    console.log('Thank you for using Employee Tracker...')
                    return false;  
                }
            })

    };

    //To display ALL Departments
    displayDepartments = () => {
        const query = connection.query(
            `SELECT department.id, department_name AS Department FROM department`,
            function (err, res){
                if (err) throw err;
                console.log('\n _______All Departments_______\n');
                console.table(res);
                questions();
                return true; 
            }
        );
    };

    //To display ALL Roles
    displayRoles = () => {
        const query = connection.query(
            `SELECT employee_role.id, title AS "Job Designation", department_name AS Department, salary As Salary FROM employee_role INNER JOIN department ON employee_role.department_id = department.id`, 
            function (err, res) {
                if (err) throw err;
                console.log('\n _______All Roles_______\n');
                console.table(res);
                questions();
                return true; 
            }
        );
    };

    //To display ALL Employees
    displayEmployees = () => {
        const query = connection.query( 
            `SELECT employee.id, employee.first_name AS "First Name", employee.last_name AS "Last Name", title AS "Job Designation", department_name AS Department, salary AS Salary, FROM employee
            INNER JOIN employee_role
                ON employee_role_id = employee_role.id
            LEFT JOIN employee manager
                ON manager.id = employee.manager_id`,
            function (err, res){
                if (err) throw err;
                console.log('\n _______All Employees_______\n');
                console.table(res);
                questions();
                return true; 
            }
        );
    };

    // To ADD a new department 
    addDepartment = () => {
        return inquirer.prompt ([
            {
                type: 'input',
                name: 'department_name', 
                message: 'Enter the name of the Department that you want to add.',
                validate: checkInput => {
                    if (checkInput) {
                        return true; 
                    }
                    else{
                        console.log('Incorrect format. Enter the Department name correctly.');
                        return false; 
                    }
                }
            }
        ])

            .then(answers => {
                console.log(answers);
                console.log('\n_______Adding the new Department_______\n');
                const query = connection.query(
                    `SELECT id AS value, department_name AS Department FROM department`, answers,
                    function (err, res){
                        if (err) throw err; 
                        console.log(res.affectedRows);
                    });
                console.log('Department has been added!');
                displayDepartments(); 
                return true;
    
            })        
    };

    //To ADD a new Role
    addRole = () => {
        let choicesDepartments = []; 

        connection.query(
            `SELECT id AS value, department_name AS Department FROM department`, 
            function (err, res){
                if (err) throw (err);
                for (let i=0; i<res.length; i++){
                    const department = res[i];
                    choicesDepartments.push({
                        name: department.department, 
                        value: department.value
                    });
                }
                promptRole(choicesDepartments)
            }
        );
    } 

    // New Role questions 
    promptRole = (choicesDepartments) => {

        return inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is designation of this new role? ',
                validate: checkInput => {
                    if (checkInput){
                        return true; 
                    }
                    else{
                        console.log('Incorrect format. Enter the Role name correctly.');
                        return false; 
                    }
                }
            },
            {
                type: 'input',
                name: 'title',
                message: 'What is salary of this new role? ',
                validate: checkInput => {
                    if (checkInput){
                        return true; 
                    }
                    else{
                        console.log('Incorrect format. Enter the salary correctly.');
                        return false; 
                    }
                }
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'What department is this new role assigned to? ',
                choices: choicesDepartments
            }
        ])

        .then(answers => {
            console.log(answers);
            console.log('\n_______Adding the new Role_______\n');
            const query = connection.query(
                `INSERT INTO employee_role SET ?`, answers,
                function (err, res){
                    if (err) throw err; 
                    console.log(res.affectedRows);
                });
            console.log('Role has been added!');
            displayRoles(); 
            return true;

        })        
    };

    // To Add a new employee 
    addEmployee = () => {
        let choicesRoles = []; 
        let choicesManager = [];

        connection.query(
            `SELECT id AS value, title AS Role FROM employee_role`,
            function (err, res) {
                if (err) throw (err);
                for (let i=0; i<res.length; i++){
                    const roles = res[i];
                    choicesRoles.push({
                        name: roles.roles, 
                        value: roles.value
                    });
                }
            }
        );

        connection.query(
            `SELECT employee.id AS value, CONCAT(employee.first_name, ' ', employee.last_name) AS Manager FROM employees;`,
            function (err, res) {
                if (err) throw err; 
                for (let i=0; i<res.length; i++){
                    const roles = res[i];
                    choicesManager.push({
                        name: roles.Manager, 
                        value: roles.value
                    });
                }

                employeePrompt(choicesRoles, choicesManager)
            }
        );
    }

    //New Employee Questions
    promptEmployee = (choicesRoles, choicesManager) => {

        return inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the first name of the employee? ',
                validate: checkInput => {
                    if (checkInput){
                        return true; 
                    }
                    else{
                        console.log('Incorrect format. Enter the First Name of the employee correctly.');
                        return false; 
                    }
                }
            },
            {
                type: 'input',
                name: 'title',
                message: 'What is the last name of the employee? ',
                validate: checkInput => {
                    if (checkInput){
                        return true; 
                    }
                    else{
                        console.log('Incorrect format. Enter the Last Name of the employee correctly.');
                        return false; 
                    }
                }
            },
            {
                type: 'list',
                name: 'employee_role_id',
                message: 'What is the role assigned to this new Employee?',
                choices: choicesRoles
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'What department is this new role assigned to? ',
                choices: choicesmanager,
            }
        ])

        .then(answers => {
            console.log(answers);
            console.log('\n_______Adding the new Employee_______\n');
            const query = connection.query(
                `INSERT INTO employee SET ?`, answers,
                function (err, res){
                    if (err) throw err; 
                    console.log(res.affectedRows);
                });
            console.log('New Employee has been added!');
            displayEmployees(); 
            return true;
        })        
    };

    //Updating an existing employee role 
    updateRole = () => {
        let choicesRoles = [];
        let choicesEmployee = [];

        connection.query(
            `SELECT id AS value, title AS Role FROM employee_role`,
            function (err, res) {
                if (err) throw err; 
                for (let i=0; e<res.length; i++){
                    const roles = res[i];
                    choicesRoles.push({
                        name: roles.roles, 
                        value: roles.value
                    });
                }
            }
        );

        connection.query(
            `SELECT employee.id AS value, CONCAT(employee.first_name, ' ', employee.last_name) AS Manager FROM employee;`,
            function (err, res) {
                if (err) throw err; 
                for (let i=0; i<res.length; i++){
                    const roles = res[i];
                    choicesEmployee.push({
                        name: roles.Manager, 
                        value: roles.value
                    });
                }

                updateRolePrompt(choicesEmployee, choicesRoles)
            }
        );
    }

    // Questions when Updating employee role 
    updateRolePrompt = (choicesEmployee, choicesRoles) => {
        return inquirer.prompt([
            {
                type: 'list', 
                name: 'id', 
                message: 'Select an Employee to modify Role',
                choices: choicesEmployee
            },
            {
                type: 'list',
                name: 'employee_role_id',
                message: 'What is the New Role that is being assigned to this employee?',
                choices: choicesRoles
            }
        ])

            .then(answers => {
                console.log(answers);
                console.log('\n_______Updating the Employee_______\n');
                const query = connection.query(
                `UPDATE employee SET ? WHERE ?`, [
                    {
                        employee_role_id: answers.employee_role_id;
                    },
                    {
                        id: answers.id,
                    }
                ],
                    function (err, res){
                        if (err) throw err; 
                        console.log(res.affectedRows);
                    });

                console.log('Employee has been updated!');
                displayEmployees(); 
                return true;
            })
    }


}