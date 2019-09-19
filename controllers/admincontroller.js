var {db}=require('../database')
var {uploader}=require('./../helpers/uploader')
const fs=require('fs')
module.exports={
    // category section
    getAllCategories:(req,res)=>{
        var sql=`Select cp.*,cpen.nama from category_products cp join category_penjual cpen on cp.catpenjualid=cpen.id where cp.deleted=0`
        db.query(sql,(err,resultprod)=>{
            if(err) return res.status(500).send({status:'error1',err})
            sql=`Select * from category_penjual where deleted=0 `
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
            sql=`Select cp.*,cpen.nama from category_products cp join category_penjual cpen on cp.catpenjualid=cpen.id where cp.deleted=0`
            db.query(sql,(err,resultprod)=>{
                if(err) return res.status(500).send({status:'error1',err})
                sql=`Select * from category_penjual where deleted=0`
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
            sql=`Select cp.*,cpen.nama from category_products cp join category_penjual cpen on cp.catpenjualid=cpen.id where cp.deleted=0 `
            db.query(sql,(err,resultprod)=>{
                if(err) return res.status(500).send({status:'error1',err})
                sql=`Select * from category_penjual where deleted=0`
                db.query(sql,(err,resulpen)=>{
                    if(err) return res.status(500).send({status:'error1',err})
                    return res.status(200).send({prod:resultprod,pen:resulpen})
                })
            })
        })
    },
    SaveEditCatProdCategory:(req,res)=>{
        var {id}=req.params
        var sql=`update category_products set ? where id=${id}`
        db.query(sql,req.body,(err,result1)=>{
            if(err) return res.status(500).send({status:'error1',err})
            sql=`Select cp.*,cpen.nama from category_products cp join category_penjual cpen on cp.catpenjualid=cpen.id where cp.deleted=0 `
            db.query(sql,(err,resultprod)=>{
                if(err) return res.status(500).send({status:'error1',err})
                sql=`Select * from category_penjual where deleted=0`
                db.query(sql,(err,resulpen)=>{
                    if(err) return res.status(500).send({status:'error1',err})
                    return res.status(200).send({prod:resultprod,pen:resulpen})
                })
            })
        })
    },
    SaveEditCatPenCategory:(req,res)=>{
        var {id}=req.params
        var sql=`update category_penjual set ? where id=${id}`
        db.query(sql,req.body,(err,result1)=>{
            if(err) return res.status(500).send({status:'error1',err})
            sql=`Select cp.*,cpen.nama from category_products cp join category_penjual cpen on cp.catpenjualid=cpen.id where cp.deleted=0`
            db.query(sql,(err,resultprod)=>{
                if(err) return res.status(500).send({status:'error1',err})
                sql=`Select * from category_penjual where deleted=0`
                db.query(sql,(err,resulpen)=>{
                    if(err) return res.status(500).send({status:'error1',err})
                    return res.status(200).send({prod:resultprod,pen:resulpen})
                })
            })
        })
    },
    DeleteCatprod:(req,res)=>{
        var {id}=req.params
        var sql=`update category_products set deleted=1 where id=${id}`
        db.query(sql,(err,result1)=>{
            if(err) return res.status(500).send({status:'error1',err})
            sql=`Select cp.*,cpen.nama from category_products cp join category_penjual cpen on cp.catpenjualid=cpen.id where cp.deleted=0`
            db.query(sql,(err,resultprod)=>{
                if(err) return res.status(500).send({status:'error1',err})
                sql=`Select * from category_penjual where deleted=0`
                db.query(sql,(err,resulpen)=>{
                    if(err) return res.status(500).send({status:'error1',err})
                    return res.status(200).send({prod:resultprod,pen:resulpen})
                })
            })
        })
    },
    DeleteCatpen:(req,res)=>{
        var {id}=req.params
        var sql=`update category_penjual set deleted=1 where id=${id}`
        db.query(sql,(err,result1)=>{
            if(err) return res.status(500).send({status:'error1',err})
            sql=`Select cp.*,cpen.nama from category_products cp join category_penjual cpen on cp.catpenjualid=cpen.id where cp.deleted=0`
            db.query(sql,(err,resultprod)=>{
                if(err) return res.status(500).send({status:'error1',err})
                sql=`Select * from category_penjual where deleted=0`
                db.query(sql,(err,resulpen)=>{
                    if(err) return res.status(500).send({status:'error1',err})
                    return res.status(200).send({prod:resultprod,pen:resulpen})
                })
            })
        })
    },
    SaveEditImageHome:(req,res)=>{
        var {id}=req.query
        var sql = ` select * from home where id = ${id};`;
        db.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                const path = `/admin/home/images`; //file save path
                const upload = uploader(path, 'HOME').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Upload post picture failed !', error: err.message });
                    }
    
                    const { image } = req.files;
                    // console.log(image)
                    const imagePath = image ? path + '/' + image[0].filename : null;
                    const data = JSON.parse(req.body.data)
                    // data.waktuupload=new Date()
                    try {
                        if(imagePath) {
                            data.homeimage = imagePath;
                            
                        }
                        sql = `Update home set ? where id = ${id};`
                        db.query(sql,data, (err1,results1) => {
                            if(err1) {
                                if(imagePath) {
                                    fs.unlinkSync('./public' + imagePath);
                                }
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                            }
                            if(imagePath) {
                                if(results[0].homeimage){
                                    fs.unlinkSync('./public' + results[0].homeimage);
                                }
                            }
                            sql = `select * from home where id = ${id}`;
                            db.query(sql, (err2,results2) => {
                                if(err2) {
                                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                                }
                                return res.status(200).send(results2[0]);
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
    SaveEditJumbotron:(req,res)=>{
        var {id}=req.query
        var sql = `select * from jumbotron where id=${id}`
        db.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                const path = `/admin/jumbotron/images`; //file save path
                const upload = uploader(path, 'JUMBO').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Upload post picture failed !', error: err.message });
                    }
    
                    const { image } = req.files;
                    // console.log(image)
                    const imagePath = image ? path + '/' + image[0].filename : null;
                    const data = JSON.parse(req.body.data)
                    // data.waktuupload=new Date()
                    try {
                        if(imagePath) {
                            data.jumbotronimage = imagePath;
                            
                        }
                        sql = `Update jumbotron set ? where id = ${id};`
                        db.query(sql,data, (err1,results1) => {
                            if(err1) {
                                if(imagePath) {
                                    fs.unlinkSync('./public' + imagePath);
                                }
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                            }
                            if(imagePath) {
                                if(results[0].jumbotronimage){
                                    fs.unlinkSync('./public' + results[0].jumbotronimage);
                                }
                            }
                            sql = `select * from jumbotron `;
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
    SaveEditIklanhome:(req,res)=>{
        var {id}=req.query
        console.log(id)
        var sql = `select * from iklan where id=${id}`
        db.query(sql, (err, results) => {
            if(err) throw err;
            console.log('masuk')
            if(results.length > 0) {
                const path = '/admin/Iklan/images'; //file save path
                const upload = uploader(path, 'IKL').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Upload post picture failed !', error: err.message });
                    }
    
                    const { image } = req.files;
                    // console.log(image)
                    const imagePath = image ? path + '/' + image[0].filename : null;
                    const data = JSON.parse(req.body.data)
                    // data.waktuupload=new Date()
                    console.log(imagePath)
                    try {
                        if(imagePath) {
                            data.iklanimage = imagePath;
                            
                        }
                        sql = `Update iklan set ? where id = ${id};`
                        db.query(sql,data, (err1,results1) => {
                            if(err1) {
                                if(imagePath) {
                                    fs.unlinkSync('./public' + imagePath);
                                }
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                            }
                            if(imagePath) {
                                if(results[0].iklanimage){
                                    fs.unlinkSync('./public' + results[0].iklanimage);
                                }
                            }
                            sql = `select * from iklan `;
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
    updateMaintext:(req,res)=>{
        var sql = `Update home set ? where id = 1;`
        db.query(sql,req.body,(err,result)=>{
            if(err) return res.status(500).send({status:'error1',err})
            sql=`select * from home`
            db.query(sql,(err,resultshome)=>{
                if(err) return res.status(500).send({status:'error1',err})
                return res.status(200).send(resultshome)
            })
        })
    },
    getHomedata:(req,res)=>{
        var sql=`select * from home`
        db.query(sql,(err,resultshome)=>{
            if(err) return res.status(500).send({status:'error1',err})
            sql=`select * from jumbotron`
            db.query(sql,(err,resultsjumbotron)=>{
                if(err) return res.status(500).send({status:'error1',err})
                sql=`select * from iklan`
                db.query(sql,(err,resultiklan)=>{
                    if(err) return res.status(500).send({status:'error1',err})
                    return res.status(200).send({home:resultshome,jumbotron:resultsjumbotron,iklan:resultiklan})
                })
            })
        })
    },
    addIklanhome:(req,res)=>{
        try {
            const path = '/Iklan/images'; //file save path
            const upload = uploader(path, 'IKL').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
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
                data.iklanimage = imagePath;
                
                var sql = 'INSERT INTO iklan SET ?';
                db.query(sql, data, (err, results) => {
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                    sql=`select * from iklan`
                    db.query(sql,(err,resultiklan)=>{
                        if(err) return res.status(500).send({status:'error1',err})
                        return res.status(200).send(resultiklan)
                    })
                })    
            })
        } catch (err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
    },
    DeleteIklanhome:(req,res)=>{
        var {id}=req.query
        var sql= `select * from iklan where id=${id}`
        db.query(sql,(err,results)=>{
            if(err){
                return res.status(500).json({message: "There's an error on the server. Please contact the administrator.", error: err.message})
            }
            if(results.length>0){
                sql=`delete from iklan where id=${id}`
                db.query(sql,(err1,results1)=>{
                    if(err1){
                        return res.status(500).json({message: "There's an error on the server. Please contact the administrator.", error: err1.message})
                    }
                    fs.unlinkSync('./public'+results[0].iklanimage)
                    sql=`select * from iklan`
                    db.query(sql,(err,resultiklan)=>{
                        if(err) return res.status(500).send({status:'error1',err})
                        return res.status(200).send(resultiklan)
                    })  
                })
            }
        })
    },
    Getallusers:(req,res)=>{
        var sql=`select * from users`
        db.query(sql,(err,results)=>{
            
        })
    }

}