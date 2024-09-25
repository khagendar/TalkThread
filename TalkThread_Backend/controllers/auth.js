const JWT = require("jsonwebtoken");
const secret = "khagendar@^$1234098765";

module.exports.token = (user) => {
  const jwt = JWT.sign({
    id: user._id,
    email: user.email
  }, secret,{ expiresIn: '7d' });
  return jwt;
};

module.exports.decode=(token)=>{
        try{
            const d=JWT.verify(token,secret);
            return d;
        }
        catch(e)
        {
            return null;
        }
}