var express=require('express')
var router=express.Router()
const {adminController}=require('./../controllers')

router.get('/getAllcategoies',adminController.getAllCategories)
router.post('/addCatPenCategory',adminController.addCatPenCategory)
router.post('/addCatProdCategory',adminController.addCatProdCategory)
router.put('/SaveEditCatProdCategory/:id',adminController.SaveEditCatProdCategory)
router.put('/SaveEditCatPenCategory/:id',adminController.SaveEditCatPenCategory)
router.put('/SaveEditImageHome',adminController.SaveEditImageHome)
router.put('/SaveEditJumbotron',adminController.SaveEditJumbotron)
router.get('/getHomedata',adminController.getHomedata)
router.post('/addIklanhome',adminController.addIklanhome)
router.put('/updateMaintext',adminController.updateMaintext)
router.delete('/DeleteIklanhome',adminController.DeleteIklanhome)
router.put('/DeleteCatprod/:id',adminController.DeleteCatprod)
router.put('/DeleteCatpen/:id',adminController.DeleteCatpen)
router.put('/SaveEditIklanhome',adminController.SaveEditIklanhome)


module.exports=router