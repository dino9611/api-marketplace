var express=require('express')
var router=express.Router()
const {userController}=require('./../controllers')

router.get('/semuausers',userController.getuser)
router.get('/cekuser',userController.getCekUser)
router.get('/cekuserregister',userController.getcekuserRegister)
router.post('/register',userController.addRegister)
router.post('/login',userController.login)
router.put('/verifikasiemail',userController.emailverifikasi)
router.post('/resendemailver',userController.resendEmailVer)
router.get('/userSettings',userController.getDataUserSetting)
router.put('/editalamatSetting',userController.editalamatSetting)


module.exports=router