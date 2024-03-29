const express = require('express')
const router = express.Router()
const compositionController = require('../controllers/compositionController')

const multer = require('multer')


router.post('/addImage/:composition',compositionController.addImage)
router.post('/addComposition/',compositionController.addComposition)

router.delete('/deleteComposition/:composition',compositionController.deleteComposition)
router.delete('/deleteImage/:composition/:image',compositionController.deleteImage)

router.patch('/updateImageOrder/:composition/:image/:order',compositionController.changeImageOrder)
router.patch('/updateImagePosition/:composition/:image/:x/:y',compositionController.changeImagePosition)
router.patch('/updateImageSize/:composition/:image/:width/:height',compositionController.changeImageSize)
router.patch('/updateImageInfo/:composition/:image/',compositionController.changeImageInfo)

router.get('/getCompositionList/',compositionController.getCompositionList)
router.get('/getOneComp/:composition/',compositionController.getOneComp)
router.get('/getImage/:composition/:image',compositionController.getImage)

module.exports = router;
