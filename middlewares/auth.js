const fs = require('fs');
const jwt = require('jsonwebtoken');
const responses = require('../helpers/responses');

const accessTokenPublicKey = fs.readFileSync('keys/jwtRS512.key');
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
      jwt.verify(token, accessTokenPublicKey, function(err, decoded) {
        if (err) {
          return responses.returnForbiddenResponse(req, res, err);
        } else {
          next();
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
      jwt.verify(token, refreshTokenPublicKey, function(err, decoded) {
        if (err) {
          return responses.returnForbiddenResponse(req, res, err);
        } else {
          var [accessToken, refreshToken] = tokenHelper.createTokens(null, null);
          req.accessToken = accessToken;
          req.refreshToken = refreshToken;
          next();
        }
      });
    } else {
      return responses.returnForbiddenResponse(req, res, "Missing authorization header");
    }
  }
}