var {db}=require('../database')
var {hashcrypt}=require('./../helpers/cryptpass')
var transporter=require('./../helpers/mailer')
const {createJWTToken}=require('./../helpers/jwt')

module.exports={
    login:(req,res)=>{
        var {username,password}=req.body
        var hashpassword=hashcrypt(password)
        var sql=`select u.*,p.id as penjualid, kategoritoko from users u left join penjual p on u.id=p.userid where (u.username='${username}'
                or u.email='${username}') and u.password='${hashpassword}'`
        db.query(sql,(err,results)=>{
            if(err) return res.status(500).send({status:'error1',err})
            if(results.length===0){
                return res.status(200).send({status:'error',error: 'username or password incorect!'})
            } 
            var data={
                lastlogin:new Date()
            }
            const token =createJWTToken({userid:results[0].id,username:results[0].username})
            sql=`update users set ? where username='${username}' and password='${hashpassword}'`
            db.query(sql,data,(err1,results1)=>{
                if (err1) return res.status(500).send({status:'error2',err1})
                return res.status(200).send({data:results,token})
            })
        })
    },
    getCekUser:(req,res)=>{
        if(!req.query.username){
            req.query.username ='' 
        }
        var sql= `select u.*,p.id as penjualid, kategoritoko from users u left join penjual p on u.id=p.userid where u.username=
                '${req.query.username}' or u.email='${req.query.username}' `
        db.query(sql,(err,result)=>{
            if (err) res.status(500).send(err)
            console.log(result)
            const token =createJWTToken({userid:result[0].id,username:result[0].username})
            res.status(200).send({data:result,token})
        })
    },
    addRegister:(req,res)=>{
        console.log(req.body)
        var {username,password,email}=req.body
        var hashpassword=hashcrypt(password)
        var data={
            username,
            password:hashpassword,
            email,
            roleid:3,
            lastlogin:new Date()
        }
        var sql='insert into users set ?'
        db.query(sql,data,(err,result)=>{
            if(err) res.status(500).send(err)
            sql= `select u.*,p.id as penjualid, kategoritoko from users u left join penjual p on u.id=p.userid where username='${req.body.username}';`
            db.query(sql,(err,result)=>{
                if (err) res.status(500).send(err)
                var LinkVerifikasi=`http://localhost:3000/verified?username=${username}&password=${hashpassword}`
                var mailoptions={
                    from:'Raja bajak laut <aldinorahman36@gmail.com>',
                    to:email,
                    subject:`verifikasi Email Roli`,
                    html:`Hi ${username}, tolong klik link ini untuk verifikasi :
                            <a href=${LinkVerifikasi}>Join Roli</a>`
                }
                transporter.sendMail(mailoptions,(err2,res2)=>{
                    if(err2){
                        console.log(err2)
                        return res.status(500).send({status:'error',err:err2})
                    }
                    console.log(`success`)
                    console.log(result)
                    const token =createJWTToken({userid:result[0].id,username:result[0].username})
                    res.status(200).send({data:result,token})
                })
                    
            })
        })
    },
    emailverifikasi:(req,res)=>{
        var {username,password}=req.body
        var sql=`select * from users where username='${username}'`
        db.query(sql,(err,results)=>{
            if(err) return res.status(500).send({status:'error',err})

            if(results.length===0){
                return res.status(500).send({status:'error',err1:'user not found'})
            }
            sql=`update users set statusver='verified' where username='${username}' and password='${password}'`
            db.query(sql,(err,results2)=>{
                if(err){
                    return res.status(500).send({status:'error',err})
                }
                sql=`select * from users where username='${username}'`
                db.query(sql,(err2,results1)=>{
                    if(err2){
                        return res.status(500).send({status:'error',err})
                    }
                    return res.status(200).send(results1)
                })
            })
        })

    },
    resendEmailVer:(req,res)=>{
        var {username,email}=req.body
        var sql=`select username,password,email from users where username='${username}' and email='${email}'`
        db.query(sql,(err,results)=>{
            if(err) return res.status(500).send({status:'error',err})
            if(results.length===0){
                return res.status(500).send({status:'error',err:'user not found'})
            }
            var LinkVerifikasi=`http://localhost:3000/verified?username=${results[0].username}&password=${results[0].password}`
            var mailoptions={
                from:'Raja bajak laut <aldinorahman36@gmail.com>',
                to:results[0].email,
                subject:`verifikasi Email Roli`,
                html:`Hi ${results[0].username}, tolong klik link ini untuk verifikasi :
                <a href=${LinkVerifikasi}>Join Roli</a>`
            }
            transporter.sendMail(mailoptions,(err2,res2)=>{
                if(err2){
                    console.log(err2)
                    return res.status(500).send({status:'error',err:err2})
                }
                console.log(`success`)
                return res.status(200).send({username,email,status:'unverified'})
            })
        })
    },
    getuser:(req,res)=>{
        var sql= `select u.*,p.id as penjualid, kategoritoko from users u left join penjual p on u.id=p.userid`
        db.query(sql,(err,result)=>{
            if (err) res.status(500).send(err)
            console.log(result)
            res.status(200).send(result)
        })
    },
    getDataUserSetting:(req,res)=>{
        var {id}=req.query
        var sql=`select u.*,p.id as penjualid, kategoritoko from users u left join penjual p on u.id=p.userid where u.id=${id}`
        db.query(sql,(err,result)=>{
            if (err) res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    editalamatSetting:(req,res)=>{
        var {id}=req.query
        var sql=`update users set ? where id=${id}`
        db.query(sql,req.body,(err,result)=>{
            if (err) res.status(500).send(err)
            sql=`select u.*,p.id as penjualid, kategoritoko from users u left join penjual p on u.id=p.userid where u.id=${id}`
            db.query(sql,(err,result1)=>{
                if (err) res.status(500).send(err)
                return res.status(200).send(result1)
            })
        })
    }
}