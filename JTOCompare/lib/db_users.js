//Declare constants
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();


//Open Database
const db = new sqlite3.Database("./db/users.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log("connection sucessful");
});
//~Open Database



// //Create random user API
// //Use random user API to populate users table  (Run multiple time to create more random users)
// axios
//     .get("https://random-data-api.com/api/users/random_user")
//     .then((response) => {
//         const { data } = response;
//         const { first_name } = data;
//         const { last_name } = data;
//         const { username } = data;
//         const { email } = data;
//         const { password } = data;


//         const sql = 'INSERT INTO users (first_name, last_name, username, password, email) VALUES(?,?,?,?,?)';


//         db.run(sql, [first_name, last_name, username, password, email], (err) => {

//             if (err) return console.error(err.message);
//             console.log("A new row has been created");
//         });

//         db.close((err) => {
//             if (err) return console.error(err.message);
//         });

//     })

// .catch((error) => {
//     if (err) return console.error(err.message);
// });
// //~Create Random User API



// //Create Table
// db.run(
//     'CREATE TABLE users(id INTEGER PRIMARY KEY, first_name, last_name, username, password, email)'
// );
// console.log("Table Create");
// //~Create Table




// //Insert into Table
// const sql = 'INSERT INTO users (first_name, last_name, username, password, email) VALUES(?,?,?,?,?)';
// db.run(sql, ["josh", "owens", "joshowens", "password123", "joshtowens@gmail.com"], (err) => {

//     if (err) return console.error(err.message);
//     console.log("A new row has been created");
// });

//         db.close((err) => {
//             if (err) return console.error(err.message);
//         });

// //~Insert into Table



// //Drop Table
// db.run("DROP Table users");
// console.log("Drop Table")
// //~ Drop Table



// //Query records
// const sql = 'SELECT * FROM users';

// db.all(sql, [], (err, rows) => {
//     if (err) return console.error(err.message);
//     rows.forEach(row => {
//         console.log(row);
//     })
// })

// db.close((err) => {
//     if (err) return console.error(err.message);

// });
// //~Query recordss