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

router.get("/management", utilities.handleErrors(invController.buildManagement))

router.get("/newClassification", utilities.handleErrors(invController.buildNewClassification))

router.post(
    "/newClassification",
    classValidate.newClassificationRules(),
    classValidate.checkClassificationData,
    utilities.handleErrors(invController.addNewClassification),
    
  )

// router.use(async (req, res, next) => {
//     next({status: 404, message: 'Sorry, we appear to have lost that page.'})
//   })

module.exports = router;

