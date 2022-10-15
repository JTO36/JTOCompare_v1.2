//Declare constants
//const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();


//Open Database Items
const db = new sqlite3.Database("./db/app.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log("connection sucessful to Search db");
});
//~Open Database

// //Create Table
// db.run(
//     'CREATE TABLE cex(itemId PRIMARY KEY, itemName, sellPrice, cashPrice, exchangePrice, stock)'
// );
// console.log("Table Create");
// //~Create Table


// //Insert into Table
// const sql = 'INSERT INTO items (item_name, website_name, item_url, item_price) VALUES(?,?,?,?)';
// db.run(sql, ["Nintendo Amiibo - Inkling Super Smash Bros. Collection ", "AmazonFR", "https://www.amazon.fr/Amiibo-Inkling-Super-Smash-Collection/dp/B07FQDV2V3/ref=d_pd_sbs_sccl_1_2/260-8466220-8989766?pd_rd_w=v6GB6&content-id=amzn1.sym.a3887efd-109c-459f-8231-5681df40f35a&pf_rd_p=a3887efd-109c-459f-8231-5681df40f35a&pf_rd_r=QPBQCRAF8V8TFB2HS9XQ&pd_rd_wg=aSkBr&pd_rd_r=0cb89fe5-3c61-4f4d-a4ba-9f528abcc6f8&pd_rd_i=B07FQDV2V3&psc=1", "0"], (err) => {

//     if (err) return console.error(err.message);
//     console.log("A new row has been created");
// });

// db.close((err) => {
//     if (err) return console.error(err.message);
// });



//~Delete from Table
// //delete by id number
// const sql = 'DELETE FROM cex WHERE id = 2';
// db.run(sql, (err) => {
//     if (err) return console.error(err.message);
//     console.log("deleted");
// });

db.close((err) => {
    if (err) return console.error(err.message);
});
//~Delete from Table by id



// //Drop Table
// db.run("DROP Table items");
// console.log("Drop Table")
//     //~ Drop Table



// //Query records from item table
// const sql = 'SELECT * FROM cex';

// db.all(sql, [], (err, rows) => {
//     if (err) return console.error(err.message);
//     rows.forEach(row => {
//         console.log(row);
//     })
// })

// db.close((err) => {
//     if (err) return console.error(err.message);

// });
// //~Query records