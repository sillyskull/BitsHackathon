const {validateToken} = require('../server/auth.js');

function checkAuthentication(req, res, next){
    const token = req.cookies["token"]? req.cookies["token"]: null
    
    req.user = null;
  
    if(!token) return next();
    const user = validateToken(token);
    req.user = user;
    return next();     
}

module.exports = {
    checkAuthentication
};
