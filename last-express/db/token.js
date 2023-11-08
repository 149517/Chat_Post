//用于生成和解析token
let jwt = require('jsonwebtoken');
let key = '123456';

exports.setToken = (name,uid)=>{
  const token = jwt.sign({
  user:name, uid:uid
  },key,{ expiresIn:'1h' });
  return token
}
// exports.setToken = function(username,userid){
//   return new Promise((resolve,reject)=>{
//     const token = jwt.sign({
//       name:username,
//       _id:userid
//     },key,{ expiresIn:'1h' });
//     resolve(token);
//   })
// }


exports.verToken = function(token){
  return new Promise((resolve,reject)=>{
    var info = jwt.verify(token.split(' ')[1],key);
    resolve(info);
  })
}
