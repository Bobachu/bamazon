// requirements
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

// 5. Then create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
function customerPurchase() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res)
        // 6. The app should then prompt users with two messages.
        inquirer.prompt([
            //    * The first should ask them the ID of the product they would like to buy.
            {
                name: "product",
                type: "input",
                message: "Please enter the id of what you would like to purchase"
            },
            //    * The second message should ask how many units of the product they would like to buy.
            {
                name: "quantity",
                type: "input",
                message: "How many would you like?",
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
                "SELECT stock_quantity, price FROM products WHERE ?",
                [
                    {
                        id: answer.product
                    }
                ],
                function (error, res) {
                    if (error) throw err;
                    let quantChange = res[0].stock_quantity - answer.quantity
                    if (res[0].stock_quantity >= answer.quantity) {
                        // 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
                        //    * This means updating the SQL database to reflect the remaining quantity.
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
                                //    * Once the update goes through, show the customer the total cost of their purchase.

                                console.log("Your total was " + (res[0].price * answer.quantity).toFixed(2) + "\nThank you for you purchase!")

                                start();
                            }
                        );
                    } else {
                        //    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
                        console.log("So sad! :( We just don't have enough to fill that order.");

                        start();
                    }
                }
            );



        });
    })
}


module.exports = customerPurchase;