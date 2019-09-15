var userRouter=require('./userRouter')
var penjualRouter=require('./penjualRouters')
var productRouter=require('./productrouters')
var cartRouter=require('./cartRouters')
var transaksiRouter=require('./transaksiRouter')
const adminRouter=require('./adminRouter')

module.exports={
    userRouter,
    penjualRouter,
    productRouter,
    cartRouter,
    transaksiRouter,
    adminRouter
}