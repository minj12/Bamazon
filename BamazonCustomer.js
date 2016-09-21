var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: " ", //Your password
    database: "Bamazon_db"
})

//*
//THIS LOGS WETHER YOU ARE CONNECTED OR NOT AND WHAT IS YOUR CONNECTION ID
// connection.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected as id " + connection.threadId);
// })

//**
//THIS LOGS ALL THE ITEMS IN THE DATABASE AS A WHOLE AN A OBJECT 
// connection.query('SELECT * FROM products', function(err, res) {
// 	if (err) throw err;
// 	console.log(res);
// })


//MAIN CHECK AND BUY FUNCTION WHICH DISPLAYS ALL ITEMS FROM MY SQL AND THEN ADDS FUNCTIONALITY TO BUY AN ITEM WITH QUANTITIY CHOICES. 
var checkAndBuy2 = function() {
    connection.query('SELECT * FROM products', function(err, res) {
    	//CREATES A NEW TABLE IN THE COOL CLI VIEW 
        var table = new Table({
            head: ['ID', 'Product Name', 'Department', 'Price', 'Stock Quantity']
        });

        //DISPLAYS ALL ITEMS FOR SALE 
        console.log("HERE ARE ALL THE ITEMS AVAILABLE FOR SALE: ");
        console.log("===========================================");
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].id, res[i].ProductName, res[i].DepartmentName, res[i].Price.toFixed(2), res[i].StockQuantity]);
        }
        console.log("-----------------------------------------------");
        //LOGS THE COOL TABLE WITH ITEMS IN FOR PURCHASE. 
        console.log(table.toString());
        inquirer.prompt([{
            name: "itemId",
            type: "input",
            message: "What is the item ID you would like to buy?",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            name: "Quantity",
            type: "input",
            message: "How many of this item would you like to buy?",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }]).then(function(answer) {
            var chosenId = answer.itemId - 1
            var chosenProduct = res[chosenId]
            var chosenQuantity = answer.Quantity
            if (chosenQuantity < res[chosenId].StockQuantity) {
                console.log("Your total for " + "(" + answer.Quantity + ")" + " - " + res[chosenId].ProductName + " is: " + res[chosenId].Price.toFixed(2) * chosenQuantity);
                connection.query("UPDATE products SET ? WHERE ?", [{
                    StockQuantity: res[chosenId].StockQuantity - chosenQuantity
                }, {
                    id: res[chosenId].id
                }], function(err, res) {
                    //console.log(err);
                });

            } else {
                console.log("Sorry, insufficient Quanity at this time. All we have is " + res[chosenId].StockQuantity + " in our Inventory.");
            }
        })
    })
}


checkAndBuy2();
