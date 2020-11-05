'use strict'

var express = require('express');
var router = express.Router();
var cors = require('cors');

var authRoutes = require('./auth');

router.use('/auth', authRoutes);

module.exports = router;