const jwt = require ('jsonwebtoken');

module.exports = {
    createJWTToken(payload){
        return jwt.sign(payload, "puripuri", { expiresIn : '12h' })
    }
}
