// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require("../utilities/new-classification")

// Route to build inventory by classification view
//router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))


//router.get("/detail/:inv_id", invController.buildInvItem);
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildInvItem))

router.get("/", utilities.checkLogin, utilities.handleErrors(invController.buildManagement)) // Needs to be protected, for admin and employee

router.get("/newClassification", utilities.checkLogin, utilities.handleErrors(invController.buildNewClassification)) // Needs to be protected, for admin and employee

router.get("/newInvItem", utilities.checkLogin, utilities.handleErrors(invController.buildNewInventoryItem)) // Needs to be protected, for admin and employee

router.get("/getInventory/:classification_id", utilities.checkLogin, utilities.handleErrors(invController.getInventoryJSON)) // Needs to be protected, for admin and employee


//Builds edit view for chosen inventory item
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInvView))

//Builds delete view for chosen inventory item
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInvView))

router.post(
    "/newClassification",
    classValidate.newClassificationRules(),
    classValidate.checkClassificationData,
    utilities.handleErrors(invController.addNewClassification),
    
  )

router.post(
    "/newInvItem",
    classValidate.newInventoryItemRules(),
    classValidate.checkInventoryData,
    utilities.handleErrors(invController.addNewInventoryItem),
    
  )

// For submit form on the edit inventory view
router.post(
  "/update/", 
  classValidate.newInventoryItemRules(),  //Specific middleware
  classValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory),
  );

router.post(
  "/delete/", 
  utilities.handleErrors(invController.deleteInventoryItem),
  );

// router.use(async (req, res, next) => {
//     next({status: 404, message: 'Sorry, we appear to have lost that page.'})
//   })

module.exports = router;

