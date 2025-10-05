const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}


/* ***************************
 * Build details view
 * ************************** */
invCont.buildDetailsViewBy = async function (req, res, next) {
  const inv_id = req.params.inventoryId;
  const data = await invModel.getInventoryByInventoryId(inv_id);

  // Set up the data to send to the inventory view
  const vehicleName = data[0].inv_make + " " + data[0].inv_model;
  const vehicleYear = data[0].inv_year;
  const vehicleDescription = data[0].inv_description;
  const vehiclePrice = new Intl.NumberFormat().format(data[0].inv_price);
  const vehicleColor = data[0].inv_color;
  const vehicleMiles = new Intl.NumberFormat().format(data[0].inv_miles);
  const vehicleImage = data[0].inv_image;

  let nav = await utilities.getNav()
  
  res.render("./inventory/detail", {
    title: vehicleYear + " " + vehicleName,
    vehicleName: vehicleName,
    vehicleYear: vehicleYear,
    vehicleDescription: vehicleDescription,
    vehiclePrice: vehiclePrice,
    vehicleColor: vehicleColor,
    vehicleMiles: vehicleMiles,
    vehicleImage: vehicleImage,
    nav: nav,
    errors: null,
  })
}

invCont.serveVehicleManagement = async function(req, res){
  let nav = await utilities.getNav();
  let classifications = await invModel.getClassifications();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav: nav,
    errors: null,
    classifications: classifications.rows,
  });
}

invCont.buildAddClassification = async function(req, res){
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav: nav,
    errors: null,
  });
}

invCont.buildAddVehicle = async function(req, res){
  let nav = await utilities.getNav()
  let data = await invModel.getClassifications();
  classification_options = data.rows;
  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav: nav,
    errors: null,
    classification_options,
  });
}

invCont.addInventory = async function(req, res, next){
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body;
  const result = await invModel.insertInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color);

  if (result){
    req.flash(
      "notice",
      `You've successfully added a new vehicle.`
    )
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav: nav,
      errors: null,
      classifications: classificationSelect
    });

  }
}

invCont.addClassification = async function(req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  const result = invModel.insertClassification(classification_name);
  if (result){
    req.flash(
      "notice",
      `You've successfully added a new classification.`
    )
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav: nav,
      errors: null,
    });
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Edit existing inventory
 * ************************** */
invCont.editInventory = async function(req, res, next){
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  
  // Get classification data
  let data = await invModel.getClassifications();
  let classification_options = data.rows;

  // Get the inventory by its id
  const itemData = await invModel.getInventoryByInventoryId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classification_options: classification_options,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont