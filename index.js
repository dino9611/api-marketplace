var express=require('express')
var cors=require('cors')
var BodyParser=require('body-parser')
var app =express()
var mysql=require('mysql')

app.use(BodyParser.json())
app.use(cors())//pemeberian izin api
var port=2001

var db=mysql.createConnection({
    host:'localhost',
    user:'dino9611',
    password:'tungkal01',
    database:'marketplaceproject',
    port:'3306'
})

app.get('/users',(req,res)=>{
    var sql= `select * from users;`
    db.query(sql,(err,result)=>{
        if (err) res.status(500).send(err)
        console.log(result)
        res.status(200).send(result)
    })
})
// api login database//
app.get('/cekuser',(req,res)=>{
    if(!req.query.username){
        req.query.username ='' 
    }
    var sql= `select * from users where username=
            '${req.query.username}' or email='${req.query.username}' `
    db.query(sql,(err,result)=>{
        if (err) res.status(500).send(err)
        console.log(result)
        res.status(200).send(result)
    })
})
app.post('/register',(req,res)=>{
    console.log(req.body)
    var sql='insert into users set ?'
    db.query(sql,req.body,(err,result)=>{
        if(err) res.status(500).send(err)
        sql= `select * from users where username='${req.body.username}';`
        db.query(sql,(err,result)=>{
            if (err) res.status(500).send(err)
            console.log(result)
            res.status(200).send(result)
        })
    })
})

app.listen(port,()=>console.log('API aktif di port '+port))