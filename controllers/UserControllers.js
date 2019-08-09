var {db}=require('../database')


module.exports={
    getCekUser:(req,res)=>{
        if(!req.query.username){
            req.query.username ='' 
        }
        var sql= `select u.*,p.id as penjualid from users u left join penjual p on u.id=p.userid where u.username=
                '${req.query.username}' or u.email='${req.query.username}' `
        db.query(sql,(err,result)=>{
            if (err) res.status(500).send(err)
            console.log(result)
            res.status(200).send(result)
        })
    },
    addRegister:(req,res)=>{
        console.log(req.body)
        var sql='insert into users set ?'
        db.query(sql,req.body,(err,result)=>{
            if(err) res.status(500).send(err)
            sql= `select u.*,p.id as penjualid from users u left join penjual p on u.id=p.userid where username='${req.body.username}';`
            db.query(sql,(err,result)=>{
                if (err) res.status(500).send(err)
                console.log(result)
                res.status(200).send(result)
            })
        })
    },
    getuser:(req,res)=>{
        var sql= `select u.*,p.id as penjualid from users u left join penjual p on u.id=p.userid`
        db.query(sql,(err,result)=>{
            if (err) res.status(500).send(err)
            console.log(result)
            res.status(200).send(result)
        })
    }
}