'use strict'

var models = require('../models');
var responses = require('../helpers/responses');

module.exports = {
  checkIfEmailExists: async function(req, res, next) {
    try {
      var user = await models.User.findOne({
        where: {
          email: req.body.email
        }
      });
      if (user) {
        return responses.returnBadRequest(req, res, "User with that email already exists");
      } else {
        next();
      }
    }
    catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong, please try again");
    }
  }
}
