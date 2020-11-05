'use strict'

const bcrypt = require('bcrypt');
const SALT = 12;

module.exports = {
  hashPassword: async function(password) {
    let hashedPassword = await bcrypt.hash(password, SALT);
    return hashedPassword;
  },
  verifyHashPassword: async function(password, hashedPassword) {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  }
}