var express=require('express')
var router=express.Router()
const {transaksiController}=require('./../controllers')


router.put('/aftercheckout/:id',transaksiController.AfterCheckout)
router.get('/getwaitingpayment/:userid',transaksiController.getwaitingpayment)
router.get('/getDetailsaftercheckout',transaksiController.getDetailsaftercheckout)
router.get('/getAdminconfirmlist',transaksiController.getAdminconfirmlist)
router.get('/getadminconfirmedlist',transaksiController.getadminconfirmedlist)
router.put('/editUploadPay/:paymentid',transaksiController.editUploadPay)
router.post('/Postadminconfirmed',transaksiController.Postadminconfirmed)
router.get('/getMasukpenjualdata',transaksiController.getMasukpenjualdata)
router.put('/PutonProsestransaksi',transaksiController.PutonProsestransaksi)
router.put('/AdminCanceledPayment',transaksiController.AdminCanceledPayment)
router.get('/getlistOnproses',transaksiController.getlistOnproses)
router.get('/getlistFinished',transaksiController.getlistFinished)
router.put('/PutCancelProsesTransaksi',transaksiController.PutCancelProsesTransaksi)
router.put('/putOnsentTransaksi',transaksiController.putOnsentTransaksi)
router.get('/getwaitingpaymentadmin/:userid',transaksiController.getwaitingpaymentadmin)
router.get('/getAdminConfirmedPayment/:userid',transaksiController.getAdminConfirmedPayment)
router.get('/getpesananBelumproses/:userid',transaksiController.getpesananBelumproses)
router.get('/getpesananonProsess/:userid',transaksiController.getpesananonProsess)
router.get('/getpesananOnSent/:userid',transaksiController.getpesananOnSent)
router.get('/getPesananFinished/:userid',transaksiController.getPesananFinished)
router.put('/PutStatusPesananSampai',transaksiController.PutStatusPesananSampai)
router.get('/Getnotif',transaksiController.getNotifList)
router.put('/UpdateOvertime',transaksiController.UpdateOvertime)



module.exports=router