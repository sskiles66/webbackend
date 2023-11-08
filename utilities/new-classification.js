const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */

validate.newClassificationRules = () => {
  return [
    body("classification_name")
      .escape() // Escape special characters
      .custom((value) => {
        // Check if the value matches the desired pattern
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
          throw new Error("Please provide a valid classification name.");
        }
        return true; // Validation passed
      }),
  ];
};



/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        // classification_name         Test for now, don't have locals set up anyway.
      })
      return
    }
    next()
  }

  validate.newInventoryItemRules = () => {
    return [
        body("inv_make")
        .trim()
        .escape() // Escape special characters
        .isLength({ min: 3 })
        .withMessage("Make needs minimum of 3 characters"),
        body("inv_model")
        .trim()
        .escape() // Escape special characters
        .isLength({ min: 3 })
        .withMessage("Model needs minimum of 3 characters"),
        body("inv_description")
        .trim()
        .escape() // Escape special characters
        .isLength({ min: 1 })
        .withMessage("Description is required"),
        body("inv_image")
        .trim()
        .escape() // Escape special characters
        .isLength({ min: 1 })
        .withMessage("Image path is required"),
        body("inv_thumbnail")
        .trim()
        .escape() // Escape special characters
        .isLength({ min: 1 })
        .withMessage("Thumbnail path is required"),
        body("inv_price")
        .trim()
        .escape() // Escape special characters
        .isLength({ min: 1 })
        .matches(/^[0-9]+(\.[0-9]{1,2})?$/)
        .withMessage("Price is only integers and decimals."),
        body("inv_year")
        .trim()
        .escape() // Escape special characters
        .matches(/^[0-9]{4}$/)
        .withMessage("Year needs 4 digit number"),
        body("inv_miles")
        .trim()
        .escape() // Escape special characters
        .matches(/^[0-9]+$/)
        .withMessage("Miles requires only numbers"),
        body("inv_color")
        .trim()
        .escape() // Escape special characters
        .isLength({ min: 1 })
        .withMessage("Color is required"),
        

    ];
  };
  
  validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let dropDown = await utilities.buildClassDropDown();
      res.render("inventory/add-inventory", {
        errors,
        title: "Add Inventory Item",
        nav,
        dropDown,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles, 
        inv_color,

        // classification_name         Test for now, don't have locals set up anyway.
      })
      return
    }
    next()
  }

  module.exports = validate