const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  //req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav})
}
baseController.causeError = async function(req, res){
  const nav = await utilities.getNav()
  throw new Error(); //Used to have message
  
}

module.exports = baseController