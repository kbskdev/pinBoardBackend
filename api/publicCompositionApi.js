const express = require('express')
const router = express.Router()
const publicCompositionController = require('../controllers/publicCompositionController')

router.get('/getCompositionList/:user',publicCompositionController.getPublicCompList)
router.get('/getOneComp/:composition/',publicCompositionController.getOneCompPublic)
router.get('/getImage/:user/:composition/:image',publicCompositionController.getImagePublic)

module.exports = router;
