const jwt=require('jsonwebtoken');
const key=process.env.
const gentoken =async (id) => {
    const token=jwt.sign({id},key,{
        expiresIn:3600
    })
     return token;
}
 
export default gentoken;