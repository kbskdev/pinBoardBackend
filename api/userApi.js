const express = require('express')
const router = express.Router()

const UserController = require('../controllers/userController')
const authorization = require('../controllers/authController')


router.post('/register/',UserController.addUser)
router.get('/isAuthor/', authorization.isAuthor)

module.exports = router
