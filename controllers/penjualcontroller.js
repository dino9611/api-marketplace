var {db}=require('../database')
const {uploader}=require('./../helpers')
const fs=require('fs')

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
    },
    getPenjualDetail:(req,res)=>{
        var penjualid=req.params.id
        var sql=` select * from penjual where id=${penjualid}`
        db.query(sql,(err,results)=>{
            if(err) {
                console.log(err.message);
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }
            console.log(results);
            
            res.status(200).send(results[0]);
        })
    },
    editFotoProfile:(req,res)=>{
        var {id}=req.query
        var sql = ` select * from penjual where id = ${id};`;
        db.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                const path = `/penjual/${results[0].namatoko+results[0].id}/images`; //file save path
                const upload = uploader(path, 'PENPROF').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
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
                            data.imageprofile = imagePath;
                            
                        }
                        sql = `Update penjual set ? where id = ${id};`
                        db.query(sql,data, (err1,results1) => {
                            if(err1) {
                                if(imagePath) {
                                    fs.unlinkSync('./public' + imagePath);
                                }
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                            }
                            if(imagePath) {
                                if(results[0].imageprofile){
                                    fs.unlinkSync('./public' + results[0].imageprofile);
                                }
                            }
                            sql = `select * from penjual where id = ${id}`;
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
    editBgProfile:(req,res)=>{
        var {id}=req.query
        var sql = ` select * from penjual where id = ${id};`;
        db.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                const path = `/penjual/${results[0].namatoko+results[0].id}/images`; //file save path
                const upload = uploader(path, 'BGPROF').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
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
                            data.imagebackground = imagePath;
                            
                        }
                        sql = `Update penjual set ? where id = ${id};`
                        db.query(sql,data, (err1,results1) => {
                            if(err1) {
                                if(imagePath) {
                                    fs.unlinkSync('./public' + imagePath);
                                }
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                            }
                            if(imagePath) {
                                if(results[0].imagebackground){
                                    fs.unlinkSync('./public' + results[0].imagebackground)
                                }
                                
                            }
                            sql = `select * from penjual where id = ${id}`;
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
    }      
}