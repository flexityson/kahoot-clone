const express = require('express')
const router = express.Router()
const multer = require('../middleware/upload.middleware')
const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')
const pdfController = require('../controllers/pdf.controller')

router.post('/upload', authMiddleware, roleMiddleware('TEACHER'), multer.single('pdf'), pdfController.uploadAndGenerateQuiz)

module.exports = router