'use strict'

var express = require('express');
var router = express.Router();
const { v4: uuid } = require('uuid');

var models = require('../models');
var cleaner = require('../cleaner');
var authMiddleware = require('../middlewares/auth');
var responses = require('../helpers/responses');

router.put('',
  authMiddleware.verifyAccessToken,
  async function(req, res) {
    try {
      var user = req.user;
      let userUpdate = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        dob: req.body.dob
      };
      let clean = cleaner.clean(userUpdate);
      user = await user.update(clean);
      return responses.returnSuccessResponse(req, res, true, user); 
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong while trying to update contact");
    }
  }
);

module.exports = router;