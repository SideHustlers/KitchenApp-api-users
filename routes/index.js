'use strict'

var express = require('express');
var router = express.Router();
var cors = require('cors');

var authRoutes = require('./auth');
var contactRoutes = require('./contact');
var addressRoutes = require('./address');
var userRoutes = require('./user');
var clientRoutes = require('./client');

router.use('/auth', authRoutes);
router.use('/contacts', contactRoutes);
router.use('/addresses', addressRoutes);
router.use('/user', userRoutes);
router.use('/clients', clientRoutes);

module.exports = router;