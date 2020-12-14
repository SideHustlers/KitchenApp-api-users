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
  verifyRefreshToken: async function(req, res, next) {
    if(req.headers.authorization) {
      var authHeader = req.headers.authorization;
      var token;
      if (authHeader.startsWith("Bearer ")){
        token = authHeader.substring(7, authHeader.length);
      } else {
        return responses.returnForbiddenResponse(req, res, "Invalid token format, must be a Bearer token");
      }
      try {
        let fetchedToken = await models.RefreshToken.findOne({
          where: {
            token: token
          },
          include: [
            {model: models.User, as: 'user'},
            {model: models.Client, as: 'client'}
          ]
        });
        if (fetchedToken) {
          var expiresAt = new Date(fetchedToken.expires_at);
          if (expiresAt < new Date(Date.now())) {
            return responses.returnUnacceptableResponse(req, res, "Token expired");
          } else {
            var [accessToken, refreshToken] = await tokenHelper.createTokens(fetchedToken.user, fetchedToken.client);
            req.accessToken = accessToken;
            req.refreshToken = refreshToken;
            next();
          }
        } else {
          return responses.returnBadRequest(req, res, "Invalid token");
        }
      } catch (err) {
        console.log(err);
        return responses.returnBadRequest(req, res, "Something went wrong");
      }
      
    } else {
      return responses.returnForbiddenResponse(req, res, "Missing authorization header");
    }
  },
  verifyIsAdmin: async function(req, res, next){
    if (req.user) {
      if (req.user.role === 0) {
        next();
      } else {
        return responses.returnForbiddenResponse(req, res, "Insufficient permissions");
      }
    }
  }
}