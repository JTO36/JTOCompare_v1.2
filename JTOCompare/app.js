//App.js 
//

//NodeJS Module
const path = require('path');
const alert = require('alert');

//Routes
const routes = require("./routes/route");

//Controllers
const controller = require('./controllers/controller');

//Libs 
//CEX Search
const cexsearch = require('./lib/cexsearch');
const websitesearch = require('./lib/websitesearch');


//Express Modules
const express = require('express');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const router = express.Router();
const favicon = require('serve-favicon');
const flash = require('connect-flash');

//Db Modules
const sqlite3 = require("sqlite3").verbose();

//For website price search
const axios = require('axios'),
    cheerio = require('cheerio');


//Variables
var firstname;
var loggedin_username;
//var items = [];
exports.items = [];
loggedin = false;


//Main function
main();

//Main Function
function main() {

    //Open App database
    db = new sqlite3.Database("./db/app.db", sqlite3.OPEN_READWRITE, (err) => {
        if (err) return console.error(err.message);
        //    console.log("connection sucessful");
    });

    //Set middleware settings
    //App Init
    const app = express();

    //Load View Engine
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    //Express Messages
    const oneDay = 1000 * 60 * 60 * 24;
    app.use(session({
        secret: 'secretkey123459385',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: oneDay },
        loggedin: false
    }));

    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    //Set Public folder
    app.use(express.static(path.join(__dirname, 'static')));

    //Set fav icon
    app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));

    //Express Messages
    app.use(require('connect-flash')());
    app.use(function(req, res, next) {
        res.locals.messages = require('express-messages')(req, res);
        next();
    });

    // Routes: (Transfering to routes/route)
    // Functions: (Transfering to controllers/controller)
    // Need to create objects for db, so the select functions can be moved to controller.js
    // and the routes to route.js


    // http://localhost:3000/home
    router.get('/home', function(req, res) {

        // If the user is loggedin
        if (loggedin) {

            // Output username
            req.flash('success', 'Logged in as ' + req.session.username);

            //Query records from item table
            const sql = 'SELECT * FROM items where username = ? ORDER BY item_name';

            db.all(sql, [loggedin_username], (err, rows) => {
                if (err) return console.error(err.message);

                items = [];
                rows.forEach(row => {
                    items.push(row);
                })

                res.render('home', {
                    title: 'Welcome back, ' + firstname + '!',
                    loggedin: loggedin,
                    items: items,
                });
            })
        } else {
            // Not logged in
            req.flash('danger', 'Please login to view the home page');
            //        res.send('Please login to view this page!');
            res.redirect('/');
        }
        //    res.end();
    });


    // http://localhost:3000/checkcex
    router.get('/checkcex', function(req, res) {

        // If the user is loggedin
        if (req.session.loggedin) {

            //    Output username
            req.flash('success', 'Logged in as ' + req.session.username);

            //Query records from item table
            const sql = 'SELECT * FROM cex ORDER BY sellPrice DESC';

            db.all(sql, [], (err, rows) => {
                if (err) return console.error(err.message);

                items = [];

                rows.forEach(row => {
                    items.push(row);
                })

                items.sort((a, b) => parseFloat(a.SellPrice) - parseFloat(b.SellPrice));
                res.render('cex', {
                    title: 'Welcome back, ' + firstname + '!',
                    loggedin: loggedin,
                    items: items,
                });
            })
        } else {
            // Not logged in
            req.flash('danger', 'Please login to view the CEX Check page');
            //        res.send('Please login to view this page!');
            res.redirect('/');
        }
    });


    // Delete Item Row
    router.get('/deleteItem/:id', function(req, res) {
        const sql = 'DELETE FROM items WHERE ID = ?';
        var id = req.params.id;
        db.run(sql, [id], (err) => {
            if (err) return console.error(err.message);
            console.log(id + " deleted");
            req.flash(id + " deleted");
            res.redirect('/home');
        });
    });

    //Refresh
    router.post('/refresh', async function(req, res) {

        try {
            console.log("1", loggedin_username);
            await websitesearch.searchAll(loggedin_username).then((response) => console.log(response));

        } catch (error) {
            console.error(error);
        }

        //  // not sure it is waiting for the async to finish updating
        res.redirect('/home');
    });

    //Addsearch POST
    router.post('/addsearch', function(req, res) {

        //Insert into Table
        const sql = 'INSERT INTO items (item_name, website_name, item_url, item_price, username) VALUES(?,?,?,?,?)';
        db.run(sql, [req.body.InputName, req.body.InputWebsite, req.body.InputUrl, "0", loggedin_username], (err) => {

            if (err) return console.error(err.message);
            req.flash('success search added ');
        });

        req.flash('success search added ');
        res.redirect('/home');

    });

    //Register/Add User
    router.post('/register/add', function(req, res) {


        req.session.loggedin = false;
        loggedin = false;

        //Add the user to the database
        const sql = 'INSERT INTO users (first_name, last_name, username, password, email, id) VALUES(?,?,?,?,?,?)';

        db.run(sql, [req.body.InputFirstName, req.body.InputLastName, req.body.InputUsername, req.body.InputPassword, req.body.InputEmail], (err) => {

            if (err) {
                console.error(err.message)
                res.redirect('/register');
            };
            req.flash('success', 'Username ' + req.body.InputUsername + ' has been created. Now please login ');
            res.redirect('/login');
        });

    });

    // http://localhost:3000/auth
    router.post('/auth', function(req, res) {

        // Capture the input fields
        let username = req.body.InputUsername;
        let password = req.body.InputPassword;
        loggedin = false;
        req.session.loggedin = false;

        // Execute SQL query that'll select the account from the database based on the specified username and password

        const sql = 'SELECT * FROM users where username = ? AND password = ? LIMIT 1';


        db.all(sql, [username, password], (err, rows) => {

            if (err) {
                return console.error(err.message)
                req.flash('danger', 'Database Error with user');
                res.redirect('/login');
            }

            if (rows.length == 0) {
                //            console.log('nothing returned');
                req.session.loggedin = false;
                loggedin = false;
                req.flash('danger', 'Incorrect User or Password');
                res.redirect('/login');
            }

            rows.forEach(row => {
                firstname = row.first_name;
                loggedin_username = row.username;
                req.session.loggedin = true;
                loggedin = true;
                req.session.username = username;

                res.redirect('/home');

            })
        })

        if (req.session.loggedin = false) {
            console.log('after send');
            res.send('/');
        };

        // db.close((err) => {
        //     if (err) return console.error(err.message);
        //     //     console.log('DB Connection closed')
        // });
    });

    //Cex Refresh
    router.post('/cexrefresh', async function(req, res) {

        //Open Database Items
        const db = new sqlite3.Database("./db/app.db", sqlite3.OPEN_READWRITE, (err) => {
            if (err) return console.error(err.message);
            console.log("connection sucessful to app db");
        });
        // ~Delete from Table
        //delete by id number
        const sql = 'DELETE FROM cex';
        db.run(sql, (err) => {
            if (err) return console.error(err.message);
            console.log("deleted");
        });
        try {
            console.log("Calling getAllCEX")
            await cexsearch.getAllCEX().then((response) => console.log(response));

        } catch (error) {
            console.error(error);
        }
        res.redirect('/checkcex');
        // return next();

    });

    //Use Express router
    routes(router);
    app.use('/', router);

    //Start Server http://localhost:3000/
    const port = process.env.PORT || 3000;

    app.listen(port, function() {
        console.log('Your application is running on http://localhost:3000');
    });
}

// ////////////////////////////
// //Search Website Functions//
// ////////////////////////////
// Moved to Controller JS
// Apart from search function as it doesn't work for some reason?

// //Search All Websites for Prices 
// searchAll = async(username) => {
//     search(username).then((response) => console.log(response));
// };

// //Search Websites for Price
// search = async(username) => {
//     //Query records from item table
//     const sql = 'SELECT * FROM items where username = ?';
//     console.log("2", username);
//     db.serialize(() => {
//         db.all(sql, [username], (err, rows) => {
//             if (err) return console.error(err.message);
//             items = [];
//             rows.forEach(row => {
//                 items.push(row);
//             })

//         })
//     });

//     items.forEach(async(val) => {
//         const price = await controller.fetchFromWeb(val.item_url, true, val.website_name)
//             .then((price) => {
//                 console.log(price);
//                 //  //Query records from item table
//                 const sql = 'UPDATE items SET item_price = ? where id = ?';

//                 db.run(sql, [price, val.id], (err, rows) => {
//                     if (err)
//                         return console.error(err.message);
//                 });

//             });
//     });
// };