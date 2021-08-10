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
                        console.log('Enter ')
                    }
                }
            }
        ])
    }


}