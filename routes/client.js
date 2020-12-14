'use strict'

var express = require('express');
var router = express.Router();
const bodyValidator = require('express-validation');
var authMiddleware = require('../middlewares/auth');
const { v4: uuid } = require('uuid');

var models = require('../models');
const responses = require('../helpers/responses');
var tokenHelper = require('../helpers/token');
var clientSchema = require('../validation/client');
const { verifyIsAdmin } = require('../middlewares/auth');

router.get('',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyIsAdmin,
  async function(req, res) {
    try {
      let clients = await models.Client.findAll();
      return responses.returnSuccessResponse(req, res, true, clients);
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong while trying to fetch clients");
    }
  }
);

router.get('/:id',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyIsAdmin,
  async function(req, res) {
    try {
      let client = await models.Client.findOne({
        where: {
          client_uuid: req.params.id
        }
      });
      return responses.returnSuccessResponse(req, res, true, client);
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Unable to fetch specified client");
    }
  }
);

router.post('',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyIsAdmin,
  bodyValidator(clientSchema),
  async function(req, res) {
    try {
      var [clientId, clientSecret] = tokenHelper.createClientIdAndSecret();
      let client = await models.Client.create({
        client_uuid: uuid(),
        name: req.body.name,
        client_id: clientId,
        client_secret: clientSecret,
      });
      return responses.returnSuccessResponse(req, res, true, client);
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong while trying to create the client");
    }
  }
);

router.put('/:id/refresh',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyIsAdmin,
  async function(req, res) {
    try {
      let client = await models.Client.findOne({
        where :{
          client_uuid: req.params.id
        }
      });
      var [clientId, clientSecret] = tokenHelper.createClientIdAndSecret();
      let clientUpdate = {
        clientId: clientId,
        clientSecret: clientSecret
      };
      client = await client.update(clientUpdate);
      return responses.returnSuccessResponse(req, res, true, client);
    } catch (err) {
      console.log(err);
      return responses.returnBadRequest(req, res, "Something went wrong while trying to refresh specified client");
    }
  }
);

module.exports = router;
