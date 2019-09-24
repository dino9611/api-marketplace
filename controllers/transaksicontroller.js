var {db}=require('../database')
var moment=require('moment')
const {uploader}=require('./../helpers')
const fs=require('fs')

module.exports={
    AfterCheckout:(req,res)=>{//ini diupdate
        var {id}=req.params
        console.log('masuk after checkout')
        // console.log(req.body)
        var datainsert={
            totalharga:req.body.totalharga,
            userid:id,
            status:'waitingpayment',
            tanggaltransaksi:moment().format("YYYY-MM-DD HH:mm:ss"),
            tglexp:moment().add(1,'days').format("YYYY-MM-DD HH:mm:ss")
        }
        var sql=`insert into userpayment set ?`
        db.query(sql,datainsert,(err,result)=>{
            if(err) res.status(500).send(err)
            // console.log(result.insertId)
            var newarr=req.body.cart
            // masukkan event sql disini 
            sql=``
            for(var i=0;i<newarr.length;i++){
                sql+=`update transaksi set hargabeli=${newarr[i].harga},lastupdate=now(),status='waitingpayment',paymentid=${result.insertId} where id=${newarr[i].id};`
            }
            // console.log(sql)
            db.query(sql,(err,result1)=>{
                if(err) res.status(500).send(err)
                sql=`select t.*,p.nama,p.image,p.harga,pj.namatoko from transaksi t 
                join products p on t.productid=p.id join penjual pj on t.penjualid=pj.id 
                where t.userid=${id} and status='oncart' and t.deleted=0`
                db.query(sql,(err,result2)=>{
                    if(err) res.status(500).send(err)
                    return res.status(200).send(result2)
                })
            })        
        })
    },
    getwaitingpayment:(req,res)=>{
        var {userid}=req.params
        var sql=`select * from userpayment where userid=${userid} and status='waitingpayment'`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    getwaitingpaymentadmin:(req,res)=>{
        var {userid}=req.params
        var sql=`select * from userpayment where userid=${userid} and status='konfirmasi Admin'`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    getAdminConfirmedPayment:(req,res)=>{
        var {userid}=req.params
        var sql=`select * from userpayment where userid=${userid} and status='admin confirmed'`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    getpesananBelumproses:(req,res)=>{
        var {userid}=req.params
        var sql=`select t.*,p.nama,p.image,p.harga,pj.namatoko from transaksi t 
                join products p on t.productid=p.id join penjual pj on t.penjualid=pj.id 
                where t.userid=${userid} and  t.deleted=0 and t.status in('admin confirmed','konfirmasi admin')`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    getpesananonProsess:(req,res)=>{
        var {userid}=req.params
        var sql=`select t.*,p.nama,p.image,p.harga,pj.namatoko from transaksi t 
                join products p on t.productid=p.id join penjual pj on t.penjualid=pj.id 
                where t.userid=${userid} and  t.deleted=0 and t.status='Onproses'`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    getpesananOnSent:(req,res)=>{
        var {userid}=req.params
        var sql=`select t.*,p.nama,p.image,p.harga,pj.namatoko from transaksi t 
                join products p on t.productid=p.id join penjual pj on t.penjualid=pj.id 
                where t.userid=${userid} and  t.deleted=0 and t.status='onSent'`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    getPesananFinished:(req,res)=>{
        var {userid}=req.params
        var sql=`select t.*,p.nama,p.image,p.harga,pj.namatoko from transaksi t 
                join products p on t.productid=p.id join penjual pj on t.penjualid=pj.id 
                where t.userid=${userid} and  t.deleted=0 and t.status='Finished'`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    PutStatusPesananSampai:(req,res)=>{
        var {userid,transaksiid}=req.body
        var sql=`Update transaksi set status='Finished' where id = ${transaksiid}`
        db.query(sql,(err,result1)=>{
            if(err) res.status(500).send(err)
            sql=`select t.*,p.nama,p.image,p.harga,pj.namatoko from transaksi t 
            join products p on t.productid=p.id join penjual pj on t.penjualid=pj.id 
            where t.userid=${userid} and  t.deleted=0 and t.status='onSent'`
            db.query(sql,(err,result)=>{
                if(err) res.status(500).send(err)
                return res.status(200).send(result)
            })
        })
    },
    getDetailsaftercheckout:(req,res)=>{
        var {userid,paymentid}=req.query
        var sql=`select t.*,p.nama,p.image,p.harga,pj.namatoko from transaksi t 
                join products p on t.productid=p.id join penjual pj on t.penjualid=pj.id 
                where t.userid=${userid} and  t.deleted=0 and paymentid=${paymentid}`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    UpdateOvertime:(req,res)=>{
        var {userid}=req.query
        var sql= `select * from userpayment where tglexp<now() and userid=${userid} and status='waitingpayment' and image is null`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            if(result.length>0){
                sql=`Update userpayment set status='CanceledPayment' where tglexp<now() and userid=${userid} and status='waitingpayment' and image is null`
                db.query(sql,(err,results1)=>{
                    if(err) res.status(500).send(err)
                    var newarr=result
                    sql=``
                    for(var i=0;i<newarr.length;i++){
                        sql+=`update transaksi set status='CanceledPayment'where paymentid=${newarr[i].id};`
                    }
                    db.query(sql,(err,results2)=>{
                        if(err) res.status(500).send(err)
                        sql=`INSERT INTO notif (message,userid,paymentid,opened) VALUES ?`
                        var values=[]
                        for(var i=0;i<newarr.length;i++){
                            values.push([`Pembayaran dengan id ${newarr[i].id} dibatalkan karena sudah melebihi batas waktu`,parseInt(userid) ,newarr[i].id,0])
                        }
                        console.log(values)
                        db.query(sql,[values],(err,results3)=>{
                            if(err) res.status(500).send(err)
                            return res.status(200).send(results3)
                        })
                    })
                })
            }
        })

    },
    editUploadPay:(req,res)=>{
        var {paymentid}=req.params
        var {userid}=req.query
        var sql = `select * from userpayment where id=${paymentid}`;
        db.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                const path = '/payment/images'; //file save path
                const upload = uploader(path, 'PAYMENT').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Upload post picture failed !', error: err.message });
                    }
    
                    const { image } = req.files;
                    // console.log(image)
                    const imagePath = image ? path + '/' + image[0].filename : null;
                    const data = JSON.parse(req.body.data);
                    try {
                        if(imagePath) {
                            data.image = imagePath;
                            
                        }
                        sql = `Update userpayment set ? where id = ${paymentid};update transaksi set status='konfirmasi Admin' where paymentid=${paymentid} and userid=${userid}`
                        db.query(sql,data, (err1,results1) => {
                            if(err1) {
                                if(imagePath) {
                                    fs.unlinkSync('./public' + imagePath);
                                }
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                            }
                            if(imagePath) {
                                if(results[0].image){
                                    fs.unlinkSync('./public' + results[0].image);
                                }
                            }
                            sql = `select * from userpayment where userid=${userid} and status='waitingpayment'`;
                            db.query(sql, (err2,results2) => {
                                if(err2) {
                                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                                }

                                return res.status(200).send(results2);
                            })
                        })
                    }
                    catch(err){
                        console.log(err.message)
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                })
            }
        })
    },
    getAdminconfirmlist:(req,res)=>{
        var sql=`select * from userpayment where status='konfirmasi Admin'`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    getadminconfirmedlist:(req,res)=>{
        var sql=`select * from userpayment where status='admin confirmed'`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    Postadminconfirmed:(req,res)=>{
        var {userid,paymentid}=req.body
        var datainsert={
            message:`Pembayaran dengan nomer ${paymentid} Sudah dikonfirmasi oleh admin dan akan diteruskan ke penjual`,
            userid,
            paymentid,
            opened:0
        }
        var sql=`INSERT INTO notif SET ?`
        db.query(sql,datainsert,(err,result)=>{
            if(err) res.status(500).send(err)
            sql = `Update userpayment set status='admin confirmed' where id = ${paymentid};update transaksi set status='admin confirmed' where paymentid=${paymentid} and userid=${userid}`
            db.query(sql,(err,result1)=>{
                if(err) res.status(500).send(err)
                sql=`select * from userpayment where status='konfirmasi Admin'`
                db.query(sql,(err,result2)=>{
                    if(err) res.status(500).send(err)
                    return res.status(200).send(result2)
                })
            })
        })
    },
    getMasukpenjualdata:(req,res)=>{
        var {penjualid}=req.query
        var sql=`select t.*,p.nama,p.harga,u.username,u.alamat,pen.namatoko from transaksi t 
                join products p on t.productid=p.id join users u on t.userid=u.id join  penjual pen on t.penjualid=pen.id where t.penjualid=${penjualid} 
                and status='admin confirmed' and t.deleted=0 group by paymentid `
        db.query(sql,(err,result1)=>{
            if(err) res.status(500).send(err)
            sql=`select t.*,p.nama,p.harga,u.username,u.alamat,pen.namatoko from transaksi t 
            join products p on t.productid=p.id join users u on t.userid=u.id join  penjual pen on t.penjualid=pen.id where t.penjualid=${penjualid} 
            and status='admin confirmed' and t.deleted=0 `
            db.query(sql,(err,result2)=>{
                if(err) res.status(500).send(err)
                return res.status(200).send({payment:result1,detail:result2})
            })

        })
    },
    
    PutonProsestransaksi:(req,res)=>{
        var {penjualid,transaksiid,paymentid,userid}=req.body
        var sql=`Update transaksi set status='Onproses' where paymentid=${paymentid}`
        db.query(sql,(err,result1)=>{
            if(err) res.status(500).send(err)
            var data={
                transaksiid:transaksiid,
                paymentid:paymentid,
                userid:userid,
                message:`Pesanan dengan nomer paymentid = ${paymentid} sudah diproses di penjual`,
                opened:0
            }
            sql=`INSERT INTO notif SET ?`
            db.query(sql,data,(err,result3)=>{
                if(err) res.status(500).send(err)
                sql=`select t.*,p.nama,p.harga,u.username from transaksi t 
                    join products p on t.productid=p.id join users u on t.userid=u.id where t.penjualid=${penjualid} 
                    and status='admin confirmed' and t.deleted=0`
                db.query(sql,(err,result2)=>{
                    if(err) res.status(500).send(err)
                    sql=`select t.*,p.nama,p.harga,u.username,u.alamat,pen.namatoko from transaksi t 
                    join products p on t.productid=p.id join users u on t.userid=u.id join  penjual pen on t.penjualid=pen.id where t.penjualid=${penjualid} 
                    and status='admin confirmed' and t.deleted=0 group by paymentid `
                    db.query(sql,(err,result4)=>{
                        if(err) res.status(500).send(err)
                        return res.status(200).send({payment:result4,detail:result2})
                    })
                })
            })
        })
    },
    putOnsentTransaksi:(req,res)=>{
        var {penjualid,transaksiid,paymentid,userid}=req.body
        var sql=`Update transaksi set status='onSent' where id=${transaksiid}`
        db.query(sql,(err,result1)=>{
            if(err) res.status(500).send(err)
            var data={
                transaksiid:transaksiid,
                paymentid:paymentid,
                userid:userid,
                message:`Pesanan dengan nomer trasaksi = ${transaksiid} sudah dalam pengiriman dari penjual`,
                opened:0
            }
            sql=`INSERT INTO notif SET ?`
            db.query(sql,data,(err,result3)=>{
                if(err) res.status(500).send(err)
                sql=`select t.*,p.nama,p.harga,u.username from transaksi t 
                    join products p on t.productid=p.id join users u on t.userid=u.id where t.penjualid=${penjualid} 
                    and status='Onproses' and t.deleted=0`
                db.query(sql,(err,result2)=>{
                    if(err) res.status(500).send(err)
                    return res.status(200).send(result2)
                })
            })
        })
    },
    PutCancelProsesTransaksi:(req,res)=>{
        var {penjualid,transaksiid,paymentid,userid}=req.body
        var sql=`Update transaksi set status='CanceledProses' where paymentid=${paymentid}`
        db.query(sql,(err,result1)=>{
            if(err) res.status(500).send(err)
            var data={
                transaksiid:transaksiid,
                paymentid:paymentid,
                userid:userid,
                message:`Pesanan dengan nomer paymentid = ${paymentid} tidak diproses oleh penjual dan uang akan dikembalikan ke rekening pengiriman`,
                opened:0
            }
            sql=`INSERT INTO notif SET ?`
            db.query(sql,data,(err,result3)=>{
                if(err) res.status(500).send(err)
                sql=`select t.*,p.nama,p.harga,u.username from transaksi t 
                    join products p on t.productid=p.id join users u on t.userid=u.id where t.penjualid=${penjualid} 
                    and status='admin confirmed' and t.deleted=0`
                db.query(sql,(err,result2)=>{
                    if(err) res.status(500).send(err)
                    sql=`select t.*,p.nama,p.harga,u.username,u.alamat,pen.namatoko from transaksi t 
                    join products p on t.productid=p.id join users u on t.userid=u.id join  penjual pen on t.penjualid=pen.id where t.penjualid=${penjualid} 
                    and status='admin confirmed' and t.deleted=0 group by paymentid `
                    db.query(sql,(err,result4)=>{
                        if(err) res.status(500).send(err)
                        return res.status(200).send({payment:result4,detail:result2})
                    })
                })
            })
        })
    },
    AdminCanceledPayment:(req,res)=>{
        var {userid,paymentid}=req.body
        var datainsert={
            message:`Pembayaran dengan nomer ${paymentid} dibatalkan karena uang yang dikirimkan kurang/foto tidak jelas mohon untuk berbelanja lagi`,
            userid,
            paymentid,
            opened:0
        }
        var sql=`INSERT INTO notif SET ?`
        db.query(sql,datainsert,(err,result)=>{
            if(err) res.status(500).send(err)
            sql = `Update userpayment set status='CanceledPayment' where id = ${paymentid};update transaksi set status='CanceledPayment' where paymentid=${paymentid} and userid=${userid}`
            db.query(sql,(err,result1)=>{
                if(err) res.status(500).send(err)
                sql=`select * from userpayment where status='konfirmasi Admin'`
                db.query(sql,(err,result2)=>{
                    if(err) res.status(500).send(err)
                    return res.status(200).send(result2)
                })
            })
        })
    },
    getlistOnproses:(req,res)=>{
        var {penjualid}=req.query
        var sql=`select t.*,p.nama,p.harga,u.username,u.alamat from transaksi t 
                join products p on t.productid=p.id join users u on t.userid=u.id where t.penjualid=${penjualid} 
                and status='Onproses' and t.deleted=0`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            return res.status(200).send(result)
        })

    },
    getlistFinished:(req,res)=>{
        var {penjualid}=req.query
        var sql=`select t.*,p.nama,p.harga,u.username,u.alamat from transaksi t 
                join products p on t.productid=p.id join users u on t.userid=u.id where t.penjualid=${penjualid} 
                and status='Finished' and t.deleted=0`
        db.query(sql,(err,result)=>{
            if(err) res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    getNotifList:(req,res)=>{
        var {limit,userid}=req.query
        var sql=`update notif set opened=1 where userid=${userid}`
        db.query(sql,(err,result1)=>{
            if(err) res.status(500).send(err)
            sql=`select * from notif where userid=${userid} order by id desc Limit ${limit}`
            db.query(sql,(err,result)=>{
                if(err) res.status(500).send(err)
                return res.status(200).send(result)
            })
        })
    }
}