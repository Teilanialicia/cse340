// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController");
const Util = require("../utilities");
const regValidate = require('../utilities/account-validation')

// Route to build inventory by classification view
router.get("/login", Util.handleErrors(accountController.buildLogin));

// Route to build inventory by classification view
router.get("/register", Util.handleErrors(accountController.buildRegister));

// Route to handle registering a new account
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  Util.handleErrors(accountController.registerAccount)
)

module.exports = router;