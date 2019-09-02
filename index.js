var express=require('express')
var cors=require('cors')
var BodyParser=require('body-parser')
var app =express()
var rajaapi=require('rajaongkir-nodejs').Starter('a69e60a290c4bd5e92b679513277e54f')
// var mysql=require('mysql')
var port=2001
var {hashcrypt}=require('./helpers/cryptpass')

app.use(BodyParser.json())
app.use(cors())//pemeberian izin api

const {penjualRouter,userRouter,productRouter,cartRouter,transaksiRouter}=require('./routers')

app.use('/users',userRouter)
app.use('/product',productRouter)
app.use('/penjual',penjualRouter)
app.use('/cart',cartRouter)
app.use('/transaksi',transaksiRouter)
app.use(BodyParser.urlencoded({extended:false}))
app.use(express.static('public'))
app.get('/',(req,res)=>{
    res.status(200).send('<h1>API AKTIF </h1>')
})

app.get('/testcrypt',(req,res)=>{
    var hashpassword=hashcrypt(req.query.password)
    console.log(hashpassword)
    res.send(`Panjang=${hashpassword.length} password anda ${req.query.password} di encript menjadi ${hashpassword} `)
    
})
app.get('/getcity',(req,res)=>{
    var params = {
        origin: 501, // ID Kota atau Kabupaten Asal
        destination: 114, // ID Kota atau Kabupaten Tujuan
        weight: 1700 // Berat Barang dalam gram (gr)
    };
    // rajaapi.getProvince(1)
    // .then((res1)=>{
    //     res.send(res1.rajaongkir.results)
    // })

    rajaapi.getCities()
    .then((res2)=>{
        var baru=res2.rajaongkir.results.filter((item)=>{
            return item.province_id==1
        })
        return res.send(baru)
    })
    // rajaapi.getJNECost(params).then(function (result){
    //     res.send(result)
    // }).catch(function (error){
    //     console.log(error)
    // });
    
})





app.listen(port,()=>console.log('API aktif di port '+port))
// var db=mysql.createConnection({
//     host:'localhost',
//     user:'dino9611',
//     password:'tungkal01',
//     database:'marketplaceproject',
//     port:'3306'
// })
// app.get('/users',(req,res)=>{
//     var sql= `select u.*,p.id as penjualid from users u left join penjual p on u.id=p.userid`
    // if(req.query.username){
    //     sql+=`where username='${req.query.username}`
    //  }
    // var sql= `select * from users where username='${req.query.username}';`
//     db.query(sql,(err,result)=>{
//         if (err) res.status(500).send(err)
//         console.log(result)
//         res.status(200).send(result)
//     })
// })
// api login database//
// app.get('/cekuser',(req,res)=>{
//     if(!req.query.username){
//         req.query.username ='' 
//     }
//     var sql= `select u.*,p.id as penjualid from users u left join penjual p on u.id=p.userid where u.username=
//             '${req.query.username}' or u.email='${req.query.username}' `
//     db.query(sql,(err,result)=>{
//         if (err) res.status(500).send(err)
//         console.log(result)
//         res.status(200).send(result)
//     })
// })
// app.post('/register',(req,res)=>{
//     console.log(req.body)
//     var sql='insert into users set ?'
//     db.query(sql,req.body,(err,result)=>{
//         if(err) res.status(500).send(err)
//         sql= `select u.*,p.id as penjualid from users u left join penjual p on u.id=p.userid where username='${req.body.username}';`
//         db.query(sql,(err,result)=>{
//             if (err) res.status(500).send(err)
//             console.log(result)
//             res.status(200).send(result)
//         })
//     })
// })
// app.put('/Regjual/:id',(req,res)=>{
//     var sql=`update users set ? where id=${req.params.id}`
//     db.query(sql,req.body,(err,result1)=>{
//         if (err) res.status(500).send(err)
//         sql=`select * from users where id=${req.params.id}`
//         db.query(sql,(err,result2)=>{
//             if (err) res.status(404).send(err)
//             res.status(200).send(result2)
//         })
//     })
// })

// app.post('/Regjual',(req,res)=>{
//     var sql='insert into penjual set ?'
//     // var sql=`update penjual set ? where id=${req.params.id}`
//     db.query(sql,req.body,(err,results)=>{
//         if(err) res.status(500).send(err)
//         console.log(results)
//         console.log(req.body.namatoko)
//         sql= `select u.*,p.id as penjualid from users u left join penjual p on u.id=p.userid where userid=${req.body.userid};`
//         db.query(sql,(err,result1)=>{
//             if (err) res.status(404).send(err)
//             console.log(result1[0].id)
//             res.status(200).send(result1)
            // sql=`update users set penjualid=${result1[0].id} where id=${req.params.id}`
            // db.query(sql,(err,result1)=>{
            //     if (err) res.status(500).send(err)
            //     sql=`select * from users where id=${req.params.id}`
            //     db.query(sql,(err,result2)=>{
            //         if (err) res.status(404).send(err)
            //         res.status(200).send(result2)
            //     })
            // })
//         })    
//     })
// })