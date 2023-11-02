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

invCont.buildInvItem = async function (req, res, next) {
  const inventory_id = req.params.inv_id; //Has to match the parameter in the route
  const data = await invModel.getInventoryItem(inventory_id);
  const grid = await utilities.buildInvItem(data);
  let nav = await utilities.getNav();
  const itemYear = data[0].inv_year;
  const itemMake = data[0].inv_make;
  const itemModel = data[0].inv_model;
  res.render("./inventory/item", {
    title: itemYear + " " + itemMake + " " + itemModel,
    nav,
    grid,
  })
}

invCont.buildManagement = async function (req, res, next) {
  
  let nav = await utilities.getNav();

  res.render("./inventory/management", {
    title: "Management",
    nav,
    
  })
}

invCont.buildNewClassification = async function (req, res, next) {
  
  let nav = await utilities.getNav();

  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    
  })
}

invCont.addNewClassification = async function (req, res, next){
  let nav = await utilities.getNav()
  const { classification_name } = req.body

   
  const regResult = await invModel.addNewClassification(
    classification_name
  )
  
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you made a new classification. ${classification_name}`
    )
    let nav = await utilities.getNav()
    res.status(201).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the add new classification process failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  }
}

module.exports = invCont