const express = require('express')
const router = express.Router()

const UserController = require('../controllers/userController')


router.post('/register/',UserController.addUser)
router.get('/isAuthor/:composition', UserController.isAuthor)

module.exports = router
