var Joi = require('joi');

module.exports = {
  body: {
    label: Joi.string().required(),
    address_1: Joi.string().required(),
    address_2: Joi.string().allow(null).allow(""),
    city: Joi.string().required(),
    state: Joi.string().max(2).required(),
    zip: Joi.string().max(9).required(),
    country: Joi.string().max(2).allow(null).allow(""),
    latitude: Joi.number().min(-90).max(90).allow(null).allow(""),
    longitude: Joi.number().min(-180).max(180).allow(null).allow(""),
    is_default: Joi.boolean().allow(null)
  }
}