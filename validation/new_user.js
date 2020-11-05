var Joi = require('joi');

module.exports = {
  body: {
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    dob: Joi.date().allow(null).allow("")
  }
}