const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data.rows[0])
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors"></a>'
        grid += '<div class="namePrice">'
        grid += '<hr>'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }


  Util.buildInvItem = async function(data){
    let grid
    //console.log(data);
    if(data.length > 0){
      grid = '<div id="grid">'
      data.forEach(vehicle => { 
        var formatted_price = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(vehicle.inv_price);
        var formatted_number = vehicle.inv_miles.toLocaleString('en-US');
        grid += '<div id="image-cont">'
        grid += '<img id="car-image" src=' + vehicle.inv_image  +  ' alt= "image of ' + vehicle.inv_year  + ' ' + vehicle.inv_make  + ' ' + vehicle.inv_model + '">';
        grid += '</div>'
        grid += '<div>'
        grid += '<h2>' + vehicle.inv_make + " "+ vehicle.inv_model + " Details" + '</h2>'
        grid += '<p>' + "Price: " + formatted_price + '</p>'
        grid += '<p>' + "Description: " + vehicle.inv_description + '</p>'
        grid += '<p>' + "Color: " + vehicle.inv_color + '</p>'
        grid += '<p>' + "Miles: " + formatted_number + '</p>'
        grid += '</div>'
        grid += '</div>'
      })
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  Util.buildClassDropDown = async function (classification_id = null) {
    let data = await invModel.getClassifications();
    let list = `<select name="classification_id" id="classification_id">`;
  
    data.rows.forEach((row) => {
      list += `<option value="${row.classification_id}"`;
      if (classification_id != null && row.classification_id == classification_id) {
        classification_id = row.classification_id;
        list += ` selected `;
      }
      list += `>${row.classification_name}</option>`;
    });
  
    list += "</select>";
    return list;
  };

  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity, used in server for universal middleware
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


module.exports = Util