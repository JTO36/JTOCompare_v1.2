const controller = require('../controllers/controller');
const mainApp = require("../app.js");


module.exports = function(router) {

    // Root/Default GET
    router.get('/', controller.root);

    // Login GET
    router.get('/login', controller.login);

    //Login POST
    router.post('/login', controller.login);

    // Add Search GET 
    router.get('/addsearch', controller.addsearch);

    //Logout POST
    router.post('/logout', controller.logout);

    //Register POST
    router.post('/register', controller.reqister);

    // //Refresh (WebSearch) POST 
    // router.post('/refresh', controller.searchrefresh)


}