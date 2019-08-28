var express=require('express')
var router=express.Router()
const {cartController}=require('./../controllers')

router.post('/addtocart',cartController.addtocart)
router.get('/getcart/:id',cartController.getcartdata)


module.exports=router