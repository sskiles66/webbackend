/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
//const accountController = require("./controllers/accountController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


/* ***********************
 * View Engine and Templates
 *************************/


//There are many different view engines
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use("/inv", inventoryRoute)
app.use("/account", require("./routes/accountRoute")) //could also be required above and be a variable


// Index Route
//The route will lead to a controller
app.get("/", utilities.handleErrors(baseController.buildHome))

app.get("/500error", utilities.handleErrors(baseController.causeError));

//app.get("/login", utilities.handleErrors(accountController.buildLogin))

// app.get("/inv", utilities.handleErrors())


app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

// app.use(async (req, res, next) => {
//   next({status: 500, message: 'Internal Server Error'})
// })




/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  // let test = await utilities.buildClassificationGrid();
  // let test2 = await utilities.buildInvItem();

  console.error(`Error at: "${req.originalUrl}": ${err.message}`) // Used to have message included with 500 error
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
