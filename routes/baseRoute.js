// Needed Resources 
const express = require("express")
const router = new express.Router() 
const baseController = require("../controllers/baseController")

// Route to build the home page
router.get("/", baseController.buildHome);

router.get("/error", baseController.throwError);

module.exports = router;