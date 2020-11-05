'use strict'

var express = require('express');
var router = express.Router();
const bodyValidator = require('express-validation');
const { v4: uuid } = require('uuid');

var models = require('../models');
var cleaner = require('../cleaner');
var responses = require('../helpers/responses');
var authMiddleware = require('../middlewares/auth');
var addressMiddleware = require('../middlewares/address');
var addressSchema = require('../validation/new_address');

router.get('',
  authMiddleware.verifyAccessToken,
  async function(req, res) {
    try {
      var addresses = await models.Address.findAll({
        where: {
          user_id: req.user.user_id
        }
      });
      return responses.returnSuccessResponse(req, res, true, addresses);
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong, please try again");
    }
  }
);

router.post('', 
  authMiddleware.verifyAccessToken,
  bodyValidator(addressSchema),
  async function(req, res) {
    try {
      var address = await models.Address.create({
        address_id: uuid(),
        user_id: req.user.user_id,
        label:req.body.label, 
        address_1:req.body.address_1, 
        address_2:req.body.address_2,
        city:req.body.city, 
        state:req.body.state, 
        zip:req.body.zip, 
        country:req.body.country, 
        latitude: req.body.latitude,
        longitude:req.body.longitude, 
        is_default: req.body.is_default,
      });
      return responses.returnSuccessResponse(req, res, true, address);
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong while trying to create address");
    }
  }
);

router.put('/:id',
  authMiddleware.verifyAccessToken,
  addressMiddleware.checkOwnership,
  async function(req, res) {
    try {
      var address = req.address;
      let addressUpdate = {
        label:req.body.label, 
        address_1:req.body.address_1, 
        address_2:req.body.address_2,
        city:req.body.city, 
        state:req.body.state, 
        zip:req.body.zip, 
        country:req.body.country, 
        latitude: req.body.latitude,
        longitude:req.body.longitude, 
        is_default: req.body.is_default,
      };
      let clean = cleaner.clean(addressUpdate);
      address = await address.update(clean);
      return responses.returnSuccessResponse(req, res, true, address); 
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong while trying to update address");
    }
  }
);

router.delete('/:id',
  authMiddleware.verifyAccessToken,
  addressMiddleware.checkOwnership,
  async function(req, res) {
    try {
      var address = req.address;
      await address.destroy();
      return responses.returnSuccessResponse(req, res, false);
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong while trying to delete address");
    }
  }
)

module.exports = router;