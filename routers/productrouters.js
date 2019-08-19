var express=require('express')
var router=express.Router()
const {productController}=require('./../controllers')

router.post('/addproduct/:id',productController.addproduct)
router.get('/getproductpen/:id',productController.getProductpenjual)
router.delete('/deleteproductpen/:id',productController.deleteproduct)
router.put('/editproduct/:id',productController.editproduct)
router.get('/getcategory/:catpenjualid',productController.pilihancategory)

module.exports=router