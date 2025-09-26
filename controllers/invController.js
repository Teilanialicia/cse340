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
  })
}


module.exports = invCont