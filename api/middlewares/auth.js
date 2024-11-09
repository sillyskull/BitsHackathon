const {validateToken} = require('../services/auth.js');

function checkAuthentication(req, res, next){
    const token = req.cookies["token"]? req.cookies["token"]: null
    
    req.user = null;
  
    if(!token) return next();
    req.user = validateToken(token);
    return next();     
}

module.exports = {
    checkAuthentication
};
