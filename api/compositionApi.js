const express = require('express')
const router = express.Router()
const compositionController = require('../controllers/compositionController')

router.post('/addImage/:composition',compositionController.addImage)
router.post('/addComposition/',compositionController.addComposition)
router.delete('/deleteComposition/:composition',compositionController.deleteComposition)
router.delete('/deleteImage/:composition/:image',compositionController.deleteImage)
router.patch('/updateImageOrder/:composition/:image/:order',compositionController.changeImageOrder)
router.get('/getCompositionList/',compositionController.getCompositionList)
router.get('/getOneComp/:composition',compositionController.getOneComp)

module.exports = router;
