const fs = require('fs');
const jwt = require('jsonwebtoken');

const accessTokenPrivateKey = fs.readFileSync('keys/jwtRS512.key');
const refreshTokenPrivateKey = fs.readFileSync('keys/jwtRS512_refresh.key');

module.exports = {
  createTokens: function(user) {
    var payload = {
      user_id: user.user_id,
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": "" + user.role,
        "x-hasura-allowed-roles": [
          "0",
          "100"
        ],
        "x-hasura-user-id": user.user_id
      },
      iat: Math.floor(Date.now() / 1000) - 30,
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // Expire 1 hour from now
    }

    var refreshPayload = {
      user_id: user.user_id,
      iat: Math.floor(Date.now() / 1000) - 30,
      exp: Math.floor(Date.now() / 1000) + (730 * (60 * 60)) // Expire one month from now
    };

    try {
      let accessToken = jwt.sign(payload, accessTokenPrivateKey, {algorithm: 'RS512'});
      let refreshToken = jwt.sign(refreshPayload, refreshTokenPrivateKey, {algorithm: 'RS512'});
      return [accessToken, refreshToken];
    } catch (err) {
      throw err;
    }
    
  }
}
