const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")


router.get("/login", utilities.handleErrors(accountController.buildLogin))


router.get("/registeration", utilities.handleErrors(accountController.buildRegisteration))

module.exports = router