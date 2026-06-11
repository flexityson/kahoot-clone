// backend/src/routes/qr.routes.js
const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qr.controller');

// QR code generation endpoint
router.get('/sessions/:pin/qr.png', qrController.generateQR);

module.exports = router;
