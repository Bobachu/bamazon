module.exports = start;

const customerPurchase = require('./bamazonCustomer');
const manageStore = require('./bamazonManager');
const superviseStore = require('./bamazonSupervisor');
const mysql = require('mysql');
const inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: 'root',
    database: 'bamazon'
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    inquirer.prompt([

        {
            name: 'position',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: ['Customer', 'Manager', 'Supervisor', 'Exit']
        }

    ]).then(function (answers) {

        switch (answers.position) {
            case 'Customer':
                customerPurchase();
                break;
            case 'Manager':
                manageStore();
                break;
            case 'Supervisor':
                superviseStore();
                break;
            case 'Exit':
                connection.end();
                break;
        }

    });
}

