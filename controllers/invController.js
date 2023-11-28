const { localsName } = require("ejs")
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
  
  if (res.locals.accountData.account_type == "Employee" || res.locals.accountData.account_type == "Admin"){
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassDropDown();
    res.render("./inventory/index", {
    title: "Management",
    nav,
    classificationSelect
    
    })
  }else{
    req.flash("Please log in as an employee or admin.")
    return res.redirect("/account/login")
  }
  
}

invCont.buildNewClassification = async function (req, res, next) {
  
  
  if (res.locals.accountData.account_type == "Employee" || res.locals.accountData.account_type == "Admin"){
    let nav = await utilities.getNav();

    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    
  })
  }else{
    req.flash("Please log in as an employee or admin.")
    return res.redirect("/account/login")
  }
}

invCont.addNewClassification = async function (req, res, next){
  let nav = await utilities.getNav()
  const { classification_name } = req.body

   
  const classResult = await invModel.addNewClassification(
    classification_name
  )
  
  if (classResult) {
    req.flash(
      "notice",
      `Congratulations, you made a new classification. ${classification_name}`
    )
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassDropDown()
    res.status(201).render("inventory/index", {
      title: "Management",
      nav,
      errors: null,
      classificationSelect
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

invCont.buildNewInventoryItem = async function (req, res, next) {
  

  if (res.locals.accountData.account_type == "Employee" || res.locals.accountData.account_type == "Admin"){
    let nav = await utilities.getNav();
    let dropDown = await utilities.buildClassDropDown();

    res.render("./inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      errors: null,
      dropDown,
    
  })
  }else{
    req.flash("Please log in as an employee or admin.")
    return res.redirect("/account/login")
  }
  
}

invCont.addNewInventoryItem = async function (req, res, next){
  let nav = await utilities.getNav()
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color  } = req.body

   
  const invResult = await invModel.addNewInventoryItem(
    inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  )
  
  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you made a new item. ${inv_make}`
    )
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassDropDown(classification_id)

    res.status(201).render("inventory/index", {
      title: "Management",
      nav,
      errors: null,
      classificationSelect
    })
  } else {
    req.flash("notice", "Sorry, the add new item process failed.")
    let dropDown = await utilities.buildClassDropDown();
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      errors: null,
      dropDown,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  

  if (res.locals.accountData.account_type == "Employee" || res.locals.accountData.account_type == "Admin"){
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  }else{
    req.flash("Please log in as an employee or admin.")
    return res.redirect("/account/login")
  }
}


//Builds and renders edit view
invCont.buildEditInvView = async function (req, res, next) {
  
  let nav = await utilities.getNav();
  
  const inv_id = parseInt(req.params.inv_id);

  const itemsData = await invModel.getInventoryItem(inv_id);

  // itemsData returns data.rows so [0] is necessary to get the item.

  const itemData = itemsData[0]

  console.log(itemData[0]);

  let dropDown = await utilities.buildClassDropDown(itemData.classification_id);

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  console.log(itemName);

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    dropDown: dropDown,
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
    const classificationSelect = await utilities.buildClassDropDown(classification_id)
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

// Builds delete view for chosen vehicle
invCont.buildDeleteInvView = async function (req, res, next) {
  
  let nav = await utilities.getNav();
  
  const inv_id = parseInt(req.params.inv_id);

  const itemsData = await invModel.getInventoryItem(inv_id);

  // itemsData returns data.rows so [0] is necessary to get the item.

  const itemData = itemsData[0]

  console.log(itemData[0]);


  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  console.log(itemName);

  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,

    classification_id: itemData.classification_id
    
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  // let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInvItem(inv_id);

  if (deleteResult) {
    
    req.flash("notice", `The delete was successful.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).redirect("inventory/delete-confirm/inv_id")
  }
}

module.exports = invCont