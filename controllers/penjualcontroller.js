var {db}=require('../database')


module.exports={
    addPenjual:(req,res)=>{
        var sql='insert into penjual set ?'
        db.query(sql,req.body,(err,results)=>{
            if(err) res.status(500).send(err)
            console.log(results)
            console.log(req.body.userid)
            sql= `select u.*,p.id as penjualid from users u left join penjual p on u.id=p.userid where userid=${req.body.userid};`
            db.query(sql,(err,result1)=>{
                if (err) res.status(404).send(err)
                console.log(result1[0].id)
                res.status(200).send(result1)
            })
        })
    }    
}