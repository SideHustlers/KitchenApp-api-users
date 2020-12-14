var Joi = require('joi');

module.exports = {
  body: {
    client_id: Joi.string().required(),
    client_secret: Joi.string().required()
  }
}