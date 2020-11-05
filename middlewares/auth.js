const fs = require('fs');
const jwt = require('jsonwebtoken');
const responses = require('../helpers/responses');

const models = require('../models');
const accessTokenPublicKey = fs.readFileSync('keys/jwtRS512.key.pub');
const refreshTokenPublicKey = fs.readFileSync('keys/jwtRS512_refresh.key.pub');
const tokenHelper = require('../helpers/token');

module.exports = {
  verifyAccessToken: function(req, res, next) {
    if(req.headers.authorization) {
      var authHeader = req.headers.authorization;
      var token;
      if (authHeader.startsWith("Bearer ")){
        token = authHeader.substring(7, authHeader.length);
      } else {
        return responses.returnForbiddenResponse(req, res, "Invalid token format, must be a Bearer token");
      }
      jwt.verify(token, accessTokenPublicKey, async function(err, decoded) {
        if (err) {
          return responses.returnForbiddenResponse(req, res, err);
        } else {
          try {
            var user = await models.User.findOne({
              where: {
                user_id: decoded.user_id
              }
            });
            if (user) {
              req.user = user;
              next();
            } else {
              return responses.returnBadRequest(req, res, "Unable to find specified user");
            }
          } catch (err) {
            console.log(err);
            return responses.returnBadRequest(req, res, "Something went wrong, please try again");
          }
        }
      });
    } else {
      return responses.returnForbiddenResponse(req, res, "Missing authorization header");
    }
  },
  verifyRefreshToken: function(req, res, next) {
    if(req.headers.authorization) {
      var authHeader = req.headers.authorization;
      var token;
      if (authHeader.startsWith("Bearer ")){
        token = authHeader.substring(7, authHeader.length);
      } else {
        return responses.returnForbiddenResponse(req, res, "Invalid token format, must be a Bearer token");
      }
      jwt.verify(token, refreshTokenPublicKey, async function(err, decoded) {
        if (err) {
          return responses.returnForbiddenResponse(req, res, err);
        } else {
          try {
            var user = await models.User.findOne({
              where: {
                user_id: decoded.user_id
              }
            });
            if (user) {
              var [accessToken, refreshToken] = tokenHelper.createTokens(user);
              req.accessToken = accessToken;
              req.refreshToken = refreshToken;
              next();
            } else {
              return responses.returnBadRequest(req, res, "Unable to find specified user");
            }
          } catch (err) {
            console.log(err);
            return responses.returnBadRequest(req, res, "Something went wrong, please try again");
          }
        }
      });
    } else {
      return responses.returnForbiddenResponse(req, res, "Missing authorization header");
    }
  }
}