'use strict'

var express = require('express');
var router = express.Router();
const bodyValidator = require('express-validation');
const { v4: uuid } = require('uuid');

var models = require('../models');
var responses = require('../helpers/responses');
var tokenHelper = require('../helpers/token');
var authMiddleware = require('../middlewares/auth');
var userMiddleware = require('../middlewares/user');
var userSchema = require('../validation/new_user');
var loginSchema = require('../validation/login');
const passwordHelper = require('../helpers/password');

router.post('/register', 
  bodyValidator(userSchema), 
  userMiddleware.checkIfEmailExists, 
  async function(req, res) {
    try {
      var hashedPassword = await passwordHelper.hashPassword(req.body.password);
      var user = await models.User.create({
        user_id: uuid(),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword,
        dob: req.body.dob,
      });
      return responses.returnSuccessResponse(req, res, true, user);
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong while trying to create user account");
    }
  }
);

router.post('/login',
  bodyValidator(loginSchema),
  async function(req, res) {
    try {
      let user = await models.User.findOne({
        where: {
          email: req.body.email
        }
      });
      if (user) {
        var isPasswordValid = await passwordHelper.verifyHashPassword(req.body.password, user.password);
        if (isPasswordValid) {
          var [accessToken, refreshToken] = tokenHelper.createTokens(null, null);
          return responses.returnSuccessResponse(req, res, true, {user: user, access_token: accessToken, refresh_token: refreshToken});
        } else {
          return responses.returnForbiddenResponse(req, res, "Invalid login credentials");
        }
      } else {
        return responses.returnForbiddenResponse(req, res, "Invalid login credentials");
      }
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong, please try again");
    }
  }
);

router.post('/token/refresh', authMiddleware.verifyRefreshToken, function(req, res) {
  return responses.returnSuccessResponse(req, res, true, {accessToken: req.accessToken, refreshToken: req.refreshToken});
});

module.exports = router;
