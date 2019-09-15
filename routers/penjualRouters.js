var express=require('express')
var router=express.Router()
const {penjualcontroller}=require('./../controllers')

router.post('/Regjual',penjualcontroller.addPenjual)
router.get('/penjualdetail/:id',penjualcontroller.getPenjualDetail)
router.put('/editFotoProfile',penjualcontroller.editFotoProfile)
router.put('/editBgProfile',penjualcontroller.editBgProfile)
router.put('/editAbouttoko',penjualcontroller.editAbouttoko)
router.put('/editAlamattoko',penjualcontroller.editAlamattoko)


module.exports=router