const mysql = require("mysql");
const inquirer = require("inquirer");
const start = require("./app");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});


function manageStore() {
    inquirer.prompt([
        // View Products for Sale

        // View Low Inventory

        // Add to Inventory

        // Add New Product

        {
            name: 'manage',
            type: 'rawlist',
            message: 'Select your command.',
            choices: ['Products for Sale', 'Check Inventory', 'Add Inventory', 'Add Product', 'Main']
        }

    ]).then(function (answers) {

        switch (answers.manage) {
            case 'Products for Sale':
                productList();
                break;
            case 'Check Inventory':
                inventoryStatus();
                break;
            case 'Add Inventory':
                addInventory();
                break;
            case 'Add Product':
                addproduct();
                break;
            case 'Main':
                start();
                break;
        }

    });


}

function productList() {
    // * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res)

        manageStore();
    });
}

function inventoryStatus() {
    // * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        console.table(res)

        manageStore();
    });
}

function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res)

        // * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
        inquirer.prompt([
            //    * The first should ask them the ID of the product they would like to buy.
            {
                name: "product",
                type: "input",
                message: "Please enter the id of what you would like to add inventory for"
            },
            //    * The second message should ask how many units of the product they would like to buy.
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            // 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
            connection.query(
                "SELECT stock_quantity, product_name FROM products WHERE ?",
                [
                    {
                        id: answer.product
                    }
                ],
                function (error, res) {
                    if (error) throw err;
                    let quantChange = parseInt(res[0].stock_quantity) + parseInt(answer.quantity)
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: quantChange
                            },
                            {
                                id: answer.product
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("You added " + answer.quantity + " to " + res[0].product_name);


                        }
                    );

                }
            );
            manageStore();
        })
    })
}


function addproduct() {
    // * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        console.table(res)

        // * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
        inquirer.prompt([
            {
                name: 'product',
                type: 'input',
                message: 'What is the name of the product you want add?'
            },
            {
                name: 'department',
                type: 'input',
                message: 'What department does this belong in?'
            },
            {
                name: 'price',
                type: 'input',
                message: 'What would you like to set the price to?',
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: 'quantity',
                type: 'input',
                message: 'How many would you like to add?',
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            console.log(answer);
            connection.query('INSERT INTO products SET ?',
                {
                    product_name: answer.product,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.quantity
                },
                function (err, data) {
                    if (err) throw err
                    console.log('You added ' + answer.product + ' to the inventory!')
                    manageStore();
                }
            )
        })
        //INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('Shovel', 'Gardening', '20.99', '36');
    })
}





module.exports = manageStore;