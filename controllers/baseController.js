const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

baseController.throwError = async function(req, res, next) {
  const error = new Error("500 error");
  error.status = 500;
  next(error);
}

module.exports = baseController;