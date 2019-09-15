var {db}=require('../database')


module.exports={
    // category section
    getAllCategories:(req,res)=>{
        var sql=`Select cp.*,cpen.nama from category_products cp join category_penjual cpen on cp.catpenjualid=cpen.id `
        db.query(sql,(err,resultprod)=>{
            if(err) return res.status(500).send({status:'error1',err})
            sql=`Select * from category_penjual`
            db.query(sql,(err,resulpen)=>{
                if(err) return res.status(500).send({status:'error1',err})
                return res.status(200).send({prod:resultprod,pen:resulpen})
            })
        })
    },
    addCatPenCategory:(req,res)=>{
        var sql='insert into category_penjual set ?'
        db.query(sql,req.body,(err,result1)=>{
            if(err) return res.status(500).send({status:'error1',err})
            sql=`Select cp.*,cpen.nama from category_products cp join category_penjual cpen on cp.catpenjualid=cpen.id `
            db.query(sql,(err,resultprod)=>{
                if(err) return res.status(500).send({status:'error1',err})
                sql=`Select * from category_penjual`
                db.query(sql,(err,resulpen)=>{
                    if(err) return res.status(500).send({status:'error1',err})
                    return res.status(200).send({prod:resultprod,pen:resulpen})
                })
            })
        })
    },
    addCatProdCategory:(req,res)=>{
        var sql='insert into category_products set ?'
        db.query(sql,req.body,(err,result1)=>{
            if(err) return res.status(500).send({status:'error1',err})
            sql=`Select cp.*,cpen.nama from category_products cp join category_penjual cpen on cp.catpenjualid=cpen.id `
            db.query(sql,(err,resultprod)=>{
                if(err) return res.status(500).send({status:'error1',err})
                sql=`Select * from category_penjual`
                db.query(sql,(err,resulpen)=>{
                    if(err) return res.status(500).send({status:'error1',err})
                    return res.status(200).send({prod:resultprod,pen:resulpen})
                })
            })
        })
    }
}