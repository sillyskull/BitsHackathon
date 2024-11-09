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
    return jwt.sign(payload, PRIVATE_KEY);
}

function validateToken(token){
    if(!token) return null;
    try{
        return jwt.verify(token, PRIVATE_KEY);
    }catch(error){
        return null;
    }
    
}

module.exports = {
    setToken,
    validateToken
}