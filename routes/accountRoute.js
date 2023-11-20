const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')


router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))


router.get("/login", utilities.handleErrors(accountController.buildLogin))


router.get("/registeration", utilities.handleErrors(accountController.buildRegisteration))

router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateView))

// Process the registration data
router.post(
    "/registeration",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin),
    
  )

module.exports = router