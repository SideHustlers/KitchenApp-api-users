'use strict'

var models = require('../models');
var responses = require('../helpers/responses');

module.exports = {
  checkOwnership: async function(req, res, next) {
    try {
      var address = await models.Address.findOne({
        where: {
          address_id: req.params.id
        }
      });
      if (address) {
        if (address.user_id === req.user.user_id) {
          req.address = address;
          next();
        } else {
          return responses.returnForbiddenResponse(req, res, "Unauthorized access to requested resource");
        }
      } else {
        return responses.returnBadRequest(req, res, "Unable to find specified address");
      }
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong, please try again");
    }
  }
}