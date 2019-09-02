var mysql=require('mysql')
var db=mysql.createConnection({
    host:'localhost',
    user:'dino9611',
    password:'tungkal01',
    database:'marketplaceproject',
    multipleStatements:true,
    port:'3306'
})

module.exports=db