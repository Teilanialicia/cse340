// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const Util = require("../utilities/index")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to display inventory details view
router.get("/detail/:inventoryId", invController.buildDetailsViewBy);

// Route to display vehicle management page
router.get("/", invController.serveVehicleManagement);

// Route to display classification add page
router.get("/add-classification", invController.buildAddClassification);


router.get("/getInventory/:classification_id",
    Util.handleErrors(invController.getInventoryJSON)
)

// Route to edit inventory
router.get('/edit/:inv_id',
    Util.handleErrors(invController.editInventory)
)

// Route to edit inventory
router.post('/update',
    invValidate.newInventoryRules(),
    invValidate.checkUpdateInventoryData,
    Util.handleErrors(invController.updateInventory)
)

// Route to add a classification to the database
router.post("/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    Util.handleErrors(invController.addClassification)
)

// Route to display vehicle (inventory) add page
router.get("/add-inventory", invController.buildAddVehicle);

// Route to add a vehicle (inventory) to the database
router.post("/add-inventory", 
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    Util.handleErrors(invController.addInventory)
)

module.exports = router;