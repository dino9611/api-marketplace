var express=require('express')
var router=express.Router()
const {cartController}=require('./../controllers')

router.post('/addtocart',cartController.addtocart)
router.get('/getcart/:id',cartController.getcartdata)
router.put('/updateqty',cartController.updateQtycart)
router.get('/getcountcart/:id',cartController.countcart)
router.get('/getcountNotif/:id',cartController.countNotif)
router.delete('/deletecart/:id',cartController.deletecart)


module.exports=router