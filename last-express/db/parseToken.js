const jwt = require('jsonwebtoken');
const {setUid} = require("../io/uid");
const key = '123456'

function extractUidFromToken(req, res, next) {
    // 获取请求头中的 Authorization 头
    const token = req.header('Authorization');
    // console.log(token)

    // 获取当前请求的路由路径
    const currentRoute = req.originalUrl;

    // 如果当前路由是 '/user/login'，则跳过 Token 解析
    if (currentRoute === '/user/login' && !token) {
        // 如果是登录路由且没有提供令牌，跳过中间件
        next();
    } else {
        if (!token) {
            return res.status(401).json({error: '未提供有效的令牌'});
        }

        try {
            // 验证并解析 Token
            const decoded = jwt.verify(token, key); // 替换为你的密钥
            // console.log(decoded)
            req.uid = decoded.uid; // 将 uid 存储在请求对象中
            // 将uid存储到uid.js
            setUid(decoded.uid)
            // console.log(req.uid)
            next();
        } catch (error) {
            return res.status(401).json({error: '令牌无效'});
        }
    }
}

module.exports = extractUidFromToken;
