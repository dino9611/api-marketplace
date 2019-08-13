var express=require('express')
var router=express.Router()
const {productController}=require('./../controllers')

router.post('/addproduct/:id',productController.addproduct)
router.get('/getproductpen/:id',productController.getProductpenjual)


module.exports=router