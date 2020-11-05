'use strict'

var express = require('express');
var router = express.Router();
const bodyValidator = require('express-validation');
const { v4: uuid } = require('uuid');

var models = require('../models');
var cleaner = require('../cleaner');
var responses = require('../helpers/responses');
var authMiddleware = require('../middlewares/auth');
var contactMiddleware = require('../middlewares/contact');
var contactSchema = require('../validation/new_contact');

router.get('',
  authMiddleware.verifyAccessToken,
  async function(req, res) {
    try {
      var contacts = await models.Contact.findAll({
        where: {
          user_id: req.user.user_id
        }
      });
      return responses.returnSuccessResponse(req, res, true, contacts);
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong, please try again");
    }
  }
);

router.post('', 
  authMiddleware.verifyAccessToken,
  bodyValidator(contactSchema),
  async function(req, res) {
    try {
      var contact = await models.Contact.create({
        contact_id: uuid(),
        user_id: req.user.user_id,
        phone_number: req.body.phone_number,
        label: req.body.label,
        is_default: req.body.is_default,
      });
      return responses.returnSuccessResponse(req, res, true, contact);
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong while trying to create contact");
    }
  }
);

router.put('/:id',
  authMiddleware.verifyAccessToken,
  contactMiddleware.checkOwnership,
  async function(req, res) {
    try {
      var contact = req.contact;
      let contactUpdate = {
        phone_number: req.body.phone_number,
        label: req.body.label,
        is_default: req.body.is_default
      };
      let clean = cleaner.clean(contactUpdate);
      contact = await contact.update(clean);
      return responses.returnSuccessResponse(req, res, true, contact); 
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong while trying to update contact");
    }
  }
);

router.delete('/:id',
  authMiddleware.verifyAccessToken,
  contactMiddleware.checkOwnership,
  async function(req, res) {
    try {
      var contact = req.contact;
      await contact.destroy();
      return responses.returnSuccessResponse(req, res, false);
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong while trying to delete contact");
    }
  }
)

module.exports = router;