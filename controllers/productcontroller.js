const {db}=require('./../database')
const {uploader}=require('./../helpers')
const fs=require('fs')
const moment=require('moment')

module.exports={
    getProductpenjual:(req,res)=>{
        var penjualid=req.params.id
        var sql=`select * from products where penjualid=${penjualid}`
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
                    sql = `SELECT * from products where penjualid=${penjualid}`;
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
    }
}