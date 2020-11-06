'use strict'

var express = require('express');
var router = express.Router();
const { v4: uuid } = require('uuid');
const crypto = require('crypto-js');

var models = require('../models');
var cleaner = require('../cleaner');
var authMiddleware = require('../middlewares/auth');
var responses = require('../helpers/responses');
var passwordHelper = require('../helpers/password');

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

router.put('/change-password',
  authMiddleware.verifyAccessToken,
  async function(req, res) {
    try {
      var user = req.user;
      let isVerified = await passwordHelper.verifyHashPassword(req.body.password, user.password);
      if (isVerified) {
        let newHashedPassword = await passwordHelper.hashPassword(req.body.new_password);
        let passwordUpdate = {
          password: newHashedPassword
        };
        user = await user.update(passwordUpdate);
        return responses.returnSuccessResponse(req, res, false);
      } else {
        return responses.returnForbiddenResponse(req, res, "Incorrect password");
      }
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong, please try again");
    }
  }
);

router.post('/reset-password',
  async function (req, res) {
    try {
      let user = await models.User.findOne({
        where: {
          email: req.body.email
        }
      });
      if (user) {
        var expires_at = new Date(); 
        expires_at.setDate(expires_at.getDate()+1);
        var resetRequest = await models.PasswordReset.create({
          reset_id: uuid(),
          user_id: user.user_id,
          expires_at: expires_at,
          is_complete: false
        });
        // TODO: Send email
        var aesID = crypto.AES.encrypt(resetRequest.reset_id, process.env.DB_HOST).toString();
        return responses.returnSuccessResponse(req, res, true, {key: aesID});
      } else {
        return responses.returnBadRequest(req, res, "No user found");
      }
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong, please try again");
    }
  }
);

router.post('/verify-reset-password',
  async function(req, res) {
    try {
      let decryptedKey = crypto.AES.decrypt(req.body.key, process.env.DB_HOST).toString(crypto.enc.Utf8);
      var resetRequest = await models.PasswordReset.findOne({
        where: {
          reset_id: decryptedKey
        }
      });
      if (resetRequest) {
        var expiresAt = new Date(resetRequest.expires_at);
        if (expiresAt < new Date(Date.now()) || resetRequest.is_complete) {
          return responses.returnUnacceptableResponse(req, res, "Reset link expired");
        } else {
          let newHashedPassword = await passwordHelper.hashPassword(req.body.new_password);
          let passwordUpdate = {
            password: newHashedPassword
          };
          let requestUpdate = {
            is_complete: true
          };
          let user = await models.User.findOne({
            where: {
              user_id: resetRequest.user_id
            }
          });
          user = await user.update(passwordUpdate);
          await resetRequest.update(requestUpdate);
          return responses.returnSuccessResponse(req, res, false);
        }
      } else {
        return responses.returnBadRequest(req, res, "Invalid reset link");
      }
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong");
    }
  }
)

module.exports = router;