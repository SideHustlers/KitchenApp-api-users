var Joi = require('joi');

module.exports = {
  body: {
    phone_number: Joi.string().required(),
    label: Joi.string().allow(null).allow(""),
    is_default: Joi.boolean().allow(null)
  }
}