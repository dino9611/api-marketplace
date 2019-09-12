var {db}=require('../database')


module.exports={
    addtocart:(req,res)=>{
        const {userid,productid,penjualid,quantity}=req.body
        var sql=`select * from transaksi where userid=${userid} and productid=${productid} and status='oncart' and deleted=0`
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
        var sql=`select t.*,p.nama,p.image,p.harga,pj.namatoko from transaksi t 
                join products p on t.productid=p.id join penjual pj on t.penjualid=pj.id where t.userid=${id} and status='oncart' and deleted=0`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send({err,message:'gagal get',err})
            return res.status(200).send(result)
        })

    },
    updateQtycart:(req,res)=>{
        let {quantity,id}=req.body
        var sql=`update transaksi set ? where id=${id}`
        var data={
            quantity
        }
        db.query(sql,data,(err,result)=>{
            if(err) res.status(500).send({err,message:'gagal updatecart',err})
            return res.status(200).send(result)
        })
    },
    countcart:(req,res)=>{
        const {id}=req.params
        var sql=`select count(*)as jumlahcart from transaksi where userid=${id} and status='oncart' and deleted=0`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send({err,message:'gagal countcart',err})
            return res.status(200).send(result[0])
        })
    },
    countNotif:(req,res)=>{
        const {id}=req.params
        var sql=`select count(*)as jumlahnotif from notif where userid=${id} and opened=0`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send({err,message:'gagal countnotif',err})
            return res.status(200).send(result[0])
        })
    },
    deletecart:(req,res)=>{//edit 
        const{id}=req.params
        const{userid}=req.query
        var sql=`update transaksi set deleted=1 where id=${id}`
        db.query(sql,(err,result1)=>{
            if(err) res.status(500).send({err,message:'gagal delete cart',err})
            sql=`select t.*,p.nama,p.image,p.harga,pj.namatoko from transaksi t 
                    join products p on t.productid=p.id join penjual pj on t.penjualid=pj.id 
                    where t.userid=${userid} and status='oncart' and deleted=0`
            db.query(sql,(err,result)=>{
                if(err) res.status(500).send({err,message:'gagal updatecart'})
                return res.status(200).send(result)
            })
        })
    }
}