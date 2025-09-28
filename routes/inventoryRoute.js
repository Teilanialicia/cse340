// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to display inventory details view
router.get("/detail/:inventoryId", invController.buildDetailsViewBy);

// Route to display vehicle management page
router.get("/", invController.serveVehicleManagement);

// Route to display classification add page
router.get("/add-classification", invController.buildAddClassification);

// Route to display vehicle (inventory) add page
router.get("/add-inventory", invController.buildAddVehicle);

module.exports = router;