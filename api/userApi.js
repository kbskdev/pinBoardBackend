const express = require('express')
const router = express.Router()

const UserController = require('../controllers/userController')
const AuthController = require('../controllers/authController')

router.post('/register/',UserController.addUser,AuthController.login)

module.exports = router
