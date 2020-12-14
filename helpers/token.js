const fs = require('fs');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
var models = require('../models');
const { v4: uuid } = require('uuid');

const accessTokenPrivateKey = fs.readFileSync('keys/jwtRS512.key');
// const refreshTokenPrivateKey = fs.readFileSync('keys/jwtRS512_refresh.key');

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

module.exports = {
  createClientToken: async function(client) {
    var payload = {
      type: 'client',
      id: client.uuid,
      client: client.name,
      iat: Math.floor(Date.now() / 1000) - 30,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 60)
    }

    try {
      let accessToken = jwt.sign(payload, accessTokenPrivateKey, {algorithm: 'RS512'});
      return accessToken;
    } catch (err) {
      throw err;
    } 
  },
  createClientIdAndSecret: function() {
    var clientId = randomstring.generate(getRandomArbitrary(100, 125));
    var clientSecret = randomstring.generate(getRandomArbitrary(200, 250));
    return [clientId, clientSecret];
  },
  createTokens: async function(user, client) {
    var payload = {
      type: 'user',
      user_id: user.user_id,
      system_role: 0,
      user_role: 0,
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": "" + user.role,
        "x-hasura-allowed-roles": [
          "0",
          "100"
        ],
        "x-hasura-user-id": user.user_id
      },
      iat: Math.floor(Date.now() / 1000) - 30,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 60) // Expire 1 hour from now
    }

    var refreshString = randomstring.generate(getRandomArbitrary(200, 250));
    var expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    try {
      await models.RefreshToken.destroy({
        where: {
          user_id: user.user_id,
          client_uuid: client.client_uuid
        }
      });
      let RefreshToken = await models.RefreshToken.create({
        token_id: uuid(),
        client_uuid: client.client_uuid,
        user_id: user.user_id,
        token: refreshString,
        expires_at: expiresAt
      });
      let accessToken = jwt.sign(payload, accessTokenPrivateKey, {algorithm: 'RS512'});
      let refreshToken = RefreshToken.token;
      return [accessToken, refreshToken];
    } catch (err) {
      throw err;
    }
    
  }
}
