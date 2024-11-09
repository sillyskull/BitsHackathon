const jwt = require('jsonwebtoken');
const {PRIVATE_KEY} = require("../config");

function setToken(user){
    console.log(user.username);
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }
    const token = jwt.sign(payload, PRIVATE_KEY);
    
    return token;
}

function validateToken(token){
    if(!token) return null;
    try{
        const authenticate = jwt.verify(token, PRIVATE_KEY);
        return authenticate;
    }catch(error){
        return null;
    }
    
}

module.exports = {
    setToken,
    validateToken
}