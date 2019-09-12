const {db}=require('./../database')
const {uploader}=require('./../helpers')
const fs=require('fs')
const moment=require('moment')

module.exports={
    getProductDetail:(req,res)=>{
        var productid=req.params.id
        var sql=` select p.*,c.namacategory, pen.namatoko,pen.imageprofile from products p left join category_products c on p.categoryprodid=c.id 
        join  penjual pen on p.penjualid=pen.id where p.id=${productid}`
        db.query(sql,(err,results)=>{
            if(err) {
                console.log(err.message);
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }
            console.log(results);
            
            res.status(200).send(results[0]);
        })
    },
    getAllProductpenjualhome:(req,res)=>{
        var sql=` select p.*,c.namacategory from products p left join category_products c on p.categoryprodid=c.id limit 10`
        db.query(sql,(err,results)=>{
            if(err) {
                console.log(err.message);
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }
            console.log(results);
            
            res.status(200).send(results);
        })
    },
    getProductpenjual:(req,res)=>{
        var penjualid=req.params.id
        var sql=` select p.*,c.namacategory from products p left join category_products c on p.categoryprodid=c.id where penjualid=${penjualid}`
        db.query(sql,(err,results)=>{
            if(err) {
                console.log(err.message);
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }
            console.log(results);
            
            res.status(200).send(results);
        })
    },
    addproduct:(req,res)=>{
        var penjualid=req.params.id
        
        try {
            const path = '/product/images'; //file save path
            const upload = uploader(path, 'PROD').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
    
                const { image } = req.files;
                console.log(image)
                const imagePath = image ? path + '/' + image[0].filename : null;
                console.log(imagePath)
    
                console.log(req.body.data)
                const data = JSON.parse(req.body.data);
                console.log(data)
                data.image = imagePath;
                data.waktuupload=moment().format("YYYY-MM-DD HH:mm:ss")
                
                var sql = 'INSERT INTO products SET ?';
                db.query(sql, data, (err, results) => {
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                   
                    console.log(results);
                    sql = ` select p.*,c.namacategory from products p left join category_products c on p.categoryprodid=c.id where penjualid=${penjualid}`;
                    db.query(sql, (err, results) => {
                        if(err) {
                            console.log(err.message);
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                        }
                        console.log(results);
                        
                        res.status(200).send(results);
                    })   
                })    
            })
        } catch (err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
    },
    deleteproduct:(req,res)=>{
        var postId=req.params.id
        var {penjualid}=req.query
        var sql= ` select * from products where id=${postId}`
        db.query(sql,(err,results)=>{
            if(err){
                return res.status(500).json({message: "There's an error on the server. Please contact the administrator.", error: err.message})
            }
            if(results.length>0){
                sql=`delete from products where id=${postId}`
                db.query(sql,(err1,results1)=>{
                    if(err1){
                        return res.status(500).json({message: "There's an error on the server. Please contact the administrator.", error: err1.message})
                    }
                    fs.unlinkSync('./public'+results[0].image)
                    sql = ` select p.*,c.namacategory from products p left join category_products c on p.categoryprodid=c.id where penjualid=${penjualid}`
                    db.query(sql, (err2, results2) => {
                        if(err2) {
                            console.log(err.message);
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err2.message });
                        }
                        console.log(results2);
                        
                        res.status(200).send(results2);
                    })   
                })
            }
        })
    },
    editproduct:(req,res)=>{
        var postId = req.params.id;
        var {penjualid}=req.query
        var sql = ` select * from products p left join category_products c on p.categoryprodid=c.id where p.id = ${postId};`;
        db.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                const path = '/product/images'; //file save path
                const upload = uploader(path, 'PROD').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Upload post picture failed !', error: err.message });
                    }
    
                    const { image } = req.files;
                    // console.log(image)
                    const imagePath = image ? path + '/' + image[0].filename : null;
                    const data = JSON.parse(req.body.data);
                    data.waktuupload=new Date()
                    try {
                        if(imagePath) {
                            data.image = imagePath;
                            
                        }
                        sql = `Update products set ? where id = ${postId};`
                        db.query(sql,data, (err1,results1) => {
                            if(err1) {
                                if(imagePath) {
                                    fs.unlinkSync('./public' + imagePath);
                                }
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                            }
                            if(imagePath) {
                                fs.unlinkSync('./public' + results[0].image);
                            }
                            sql = ` select p.*,c.namacategory from products p left join category_products c on p.categoryprodid=c.id where penjualid=${penjualid}`;
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
    pilihancategory:(req,res)=>{
        var {catpenjualid}=req.params
        var sql=`select * from category_products where catpenjualid=${catpenjualid}`
        db.query(sql,(err,results)=>{
            if(err) return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            res.status(200).send(results)
        })
    },
    getsearchproduct:(req,res)=>{
        var {prod,page,cat}=req.query
        var offset=(page*2)-2//2 karena 1 page a=hanya 2 product ini nanti diganti
        if(!page){
            offset=0
        }
        if(!prod){
            prod=''
        }
        var sql=`select p.*,c.namacategory from products p left 
                join category_products c on p.categoryprodid=c.id where p.nama like '%${prod}%' limit ${offset},2`
        if(cat!=0){
            sql=`select p.*,c.namacategory from products p left 
                join category_products c on p.categoryprodid=c.id where p.nama like '%${prod}%' and categoryprodid=${cat} limit ${offset},2`
        }
        db.query(sql,(err,results1)=>{
            if(err) return res.status(500).send({message:err})
            sql=`select count(*) as jumlah from products where nama like '%${prod}%'`
            db.query(sql,(err,result2)=>{
                if(err) return res.status(500).send({message:err})
                return res.status(200).send({pagination:results1,page:result2[0]})
            })
        }) 
    }
}