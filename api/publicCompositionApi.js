const express = require('express')
const router = express.Router()
const publicCompositionController = require('../controllers/publicCompositionController')

router.get('/getFullCompositionList/',publicCompositionController.getFullPublicCompList)
router.get('/getCompositionListByUser/:user',publicCompositionController.getPublicCompListByUser)
router.get('/getOneComp/:user/:composition/',publicCompositionController.getOneCompPublic)
router.get('/getImage/:user/:composition/:image',publicCompositionController.getImagePublic)

module.exports = router;
