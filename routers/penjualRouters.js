var express=require('express')
var router=express.Router()
const {penjualcontroller}=require('./../controllers')

router.post('/Regjual',penjualcontroller.addPenjual)


module.exports=router