//Link with main App file, so variables can be used.
const mainApp = require("../app.js");


// Addsearch function
exports.addsearch = (req, res) => {
    if (loggedin) {
        res.render('addsearch', {
            title: 'Add Search',
        });
    } else {
        // Not logged in
        req.flash('danger', 'Please login to view the home page');
        //        res.send('Please login to view this page!');
        res.redirect('/');
    }
};

//Login Function
exports.login = (req, res) => {

    res.render('login', {
        title: 'JTO Compare - User Login',
        loggedin: loggedin
    });
};

//Logout Function
exports.logout = (req, res) => {

    loggedin = false;
    req.flash('success', req.session.username + ' you are now logged out ');
    res.redirect('/login');
};

//Root/Default Function
exports.root = (req, res) => {

    if (loggedin == true) {
        //    Output username
        req.flash('success', 'Logged in as ' + req.session.username);
    }
    res.render('index', {
        title: 'JTO Compare',
        loggedin: loggedin
    });
};

exports.reqister = (req, res) => {
    res.render('register', {
        title: 'Register',
        loggedin: loggedin
    });
};


// //Refresh
// exports.searchrefresh = async(req, res) => {

//     try {
//         console.log("1", loggedin_username);
//         await controller.searchAll(loggedin_username).then((response) => console.log(response));

//     } catch (error) {
//         console.error(error);
//     }

//     //  // not sure it is waiting for the async to finish updating
//     res.redirect('/home');
// };