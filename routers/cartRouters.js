var express=require('express')
var router=express.Router()
const {cartController}=require('./../controllers')
const {auth}=require('./../helpers/auth')


router.post('/addtocart',auth,cartController.addtocart)
router.get('/getcart/:id',cartController.getcartdata)
router.put('/updateqty',cartController.updateQtycart)
router.get('/getcountcart/:id',cartController.countcart)
router.get('/getcountNotif/:id',cartController.countNotif)
router.delete('/deletecart/:id',cartController.deletecart)


module.exports=router