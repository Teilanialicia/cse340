// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController");
const Util = require("../utilities");
const regValidate = require('../utilities/account-validation')
const jwt = require("jsonwebtoken")
require("dotenv").config()

// Route to build inventory by classification view
router.get("/login", Util.handleErrors(accountController.buildLogin));

// Route to build inventory by classification view
router.get("/register", Util.handleErrors(accountController.buildRegister));

// Route to the account management page
router.get("/", 
  Util.checkLogin,
  Util.handleErrors(accountController.accountManagement)
);

// Route to handle registering a new account
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  Util.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    Util.handleErrors(accountController.loginAccount)
)

module.exports = router;