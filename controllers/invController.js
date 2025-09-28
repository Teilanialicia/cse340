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
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav: nav,
    errors: null,
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

invCont.addVehicle = async function(req, res, next){
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

module.exports = invCont