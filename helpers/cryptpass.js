var crypto=require('crypto')

const hashcrypt=(password)=>{
    var hasspasword = crypto.createHmac('md5','marketplace').update(password).digest('hex')

    return hasspasword
}

module.exports={
    hashcrypt
}