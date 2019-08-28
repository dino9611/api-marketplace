var {db}=require('../database')


module.exports={
    addtocart:(req,res)=>{
        const {userid,productid,penjualid,quantity}=req.body
        var sql=`select * from transaksi where userid=${userid} and productid=${productid} and status='oncart'`
        db.query(sql,(err,result)=>{
            if(result.length===0){
                var data={
                    userid,
                    productid,
                    penjualid,
                    quantity,
                    status:'oncart',
                    lastupdate:new Date ()
                }
                sql='insert into transaksi set ?'
                db.query(sql,data,(err,results1)=>{
                    if(err) res.status(500).send({err,message:'gagal add'})
                    return res.status(200).send({message:'product berhasil ditambahkan ke cart',results1})
                })
            }else{
                var newqty=result[0].quantity+quantity
                var data={
                    quantity:newqty,
                    lastupdate:new Date ()
                }
                sql=`update transaksi set ? where userid=${userid} and productid=${productid} and status='oncart'`
                db.query(sql,data,(err,result2)=>{
                    if(err) res.status(500).send({err,message:'gagal update'})
                    return res.status(200).send({message:'quantity product berhasil diedit ke cart',result2})
                })
            }
        })
    },
    getcartdata:(req,res)=>{
        var {id}=req.params
        var sql=`select t.*,p.nama,p.image,p.harga from transaksi t 
                join products p on t.productid=p.id where userid=${id} and status='oncart' and deleted=0`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send({err,message:'gagal get',err})
            return res.status(200).send(result)
        })

    }
}