var express=require('express')
var router=express.Router()
const {adminController}=require('./../controllers')

router.get('/getAllcategoies',adminController.getAllCategories)
router.post('/addCatPenCategory',adminController.addCatPenCategory)
router.post('/addCatProdCategory',adminController.addCatProdCategory)


module.exports=router