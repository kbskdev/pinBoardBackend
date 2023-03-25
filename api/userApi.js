const express = require('express')
const router = express.Router()

const UserController = require('../controllers/userController')


router.post('/register/',UserController.addUser)
router.get('/isAuthor/', UserController.isAuthor)

module.exports = router
