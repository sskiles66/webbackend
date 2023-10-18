const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}
baseController.causeError = async function(req, res){
  const nav = await utilities.getNav()
  throw {status: 500, message: 'Internal Server Error'}
  
}

module.exports = baseController