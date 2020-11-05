'use strict'

var models = require('../models');
var responses = require('../helpers/responses');

module.exports = {
  checkOwnership: async function(req, res, next) {
    try {
      var contact = await models.Contact.findOne({
        where: {
          contact_id: req.params.id
        }
      });
      if (contact) {
        if (contact.user_id === req.user.user_id) {
          req.contact = contact;
          next();
        } else {
          return responses.returnForbiddenResponse(req, res, "Unauthorized access to requested resource");
        }
      } else {
        return responses.returnBadRequest(req, res, "Unable to find specified contact");
      }
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong, please try again");
    }
  }
}