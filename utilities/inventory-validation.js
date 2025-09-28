const utilities = require("./index")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
*  Classification Data Validation Rules
* ********************************* */
validate.classificationRules = () => {
    return [
        // valid name is required and cannot already exist in the DB
        body("classification_name")
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty.")
        .not().contains(" ")
        .withMessage("Name cannot have spaces.")
        .isLength({min:3, max:20})
        .withMessage("A valid name is required.")
        .custom(async (classification_name) => {
            try {
                const classificationExists = await invModel.classificationExists(classification_name);
                if (classificationExists){
                    throw new Error("Classification already exists. Please try a different name.")
                }
            }catch(err){
                // There's no need to throw an error if we get here because it's only going to get here if
                // the classification_name is empty which will already have an error reported about it
                // throw new Error("Invalid Classification Name.")
            }
        })
    ]
}

validate.inventoryRules = () => {
    return [
        body("inv_make").trim()
        .notEmpty()
        .withMessage("Make cannot be empty.")
        .not().contains(" ")
        .withMessage("Make cannot have spaces.")
        .isLength({min:3, max:20})
        .withMessage("Make must be between 3 and 20 characters"),

        body("inv_model").trim()
        .notEmpty()
        .withMessage("Model cannot be empty.")
        .not().contains(" ")
        .withMessage("Model cannot have spaces.")
        .isLength({min:3, max:20})
        .withMessage("Model must be between 3 and 20 characters."),

        body("inv_description").trim()
        .notEmpty()
        .withMessage("Description cannot be empty.")
        .isLength({min:3})
        .withMessage("Description must be long than 3 characters."),

        body("inv_image").trim()
        .notEmpty()
        .withMessage("Image cannot be empty.")
        .not().contains(" ")
        .withMessage("Image cannot have spaces.")
        .isLength({min:3})
        .withMessage("A valid name is required."),

        body("inv_thumbnail").trim()
        .notEmpty()
        .withMessage("Thumbnail cannot be empty.")
        .not().contains(" ")
        .withMessage("Thumbnail cannot have spaces.")
        .isLength({min:3})
        .withMessage("A valid name is required."),

        body("inv_price").trim()
        .notEmpty()
        .withMessage("Price cannot be empty.")
        .not().contains(" ")
        .withMessage("Price cannot have spaces.")
        .isNumeric()
        .withMessage("Price can only be a number"),

        body("inv_year").trim()
        .notEmpty()
        .withMessage("Year cannot be empty.")
        .not().contains(" ")
        .withMessage("Year cannot have spaces.")
        .isLength({min:4, max:4})
        .withMessage("A year consists of 4 digits."),

        body("inv_miles").trim()
        .notEmpty()
        .withMessage("Miles cannot be empty.")
        .not().contains(" ")
        .withMessage("Miles cannot have spaces.")
        .isNumeric()
        .withMessage("Miles can only be a number"),

        body("inv_color").trim()
        .notEmpty()
        .withMessage("Color cannot be empty.")
        .not().contains(" ")
        .withMessage("Color cannot have spaces.")
        .isLength({min:3, max:20})
        .withMessage("Color must be between 3 and 20 characters."),
    ]
}

/* ******************************
 * Check data and return errors or continue to classifications
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

validate.checkInventoryData = async function(req, res, next) {
  const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      inv_make, 
      inv_model, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_year, 
      inv_miles, 
      inv_color,
    })
    return
  }
  next()
}

module.exports = validate