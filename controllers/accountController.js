const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/index", {
    title: "Account Management",
    nav,
    errors: null, //Errors may not be necessary here
  })
}



/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }


  /* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegisteration(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/registeration", {
      title: "Register",
      nav,
      errors: null,
    })
  }


  /* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/registeration", {
        title: "Registration",
        nav,
        errors: null,
        })
    }
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/registeration", {
        title: "Registration",
        nav,
        errors: null
      })
    }
  }

  /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }else{
    // If wrong password was entered. Page loads endlessly
    req.flash("notice", "Wrong password.")
    res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

 async function buildUpdateView(req, res, next) {
  
  let nav = await utilities.getNav();
  
  const account_id = parseInt(req.params.account_id);

  const accountData = await accountModel.getAccountById(account_id);

  
  res.render("./account/update", {
    title: "Update Account",
    nav,
    errors: null, 
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email
  })
}

async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    // const itemName = updateResult.inv_make + " " + updateResult.inv_model
    res.locals.accountData.account_firstname = account_firstname;
    req.flash("notice", `Your account was successfully updated.`)
    res.redirect("/account/")
  } else {
    // const classificationSelect = await utilities.buildClassDropDown(classification_id)
    // const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render(`./account/update`, {
      title: "Update Account",
      nav,
      errors: null, 
      account_id: account_id,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email
    })
  }

  
}

async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  console.log(account_password)

  // Hash the password before storing
  let hashedPassword
  try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
      // console.log(hashedPassword)
  } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the new password.')
      res.status(501).render(`./account/update`, {
        title: "Update Account",
        nav,
        errors: null, 
        account_id: account_id
      })
  }

  const regResult = await accountModel.updatePassword(
    hashedPassword, account_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you have updated your password`
    )
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update password process failed")
    res.status(501).render(`./account/update`, {
      title: "Update Account",
      nav,
      errors: null, 
      account_id: account_id
    })
  }
}

  module.exports = { buildLogin, buildRegisteration, registerAccount, accountLogin, buildAccountManagement, buildUpdateView, updateAccount, updatePassword }