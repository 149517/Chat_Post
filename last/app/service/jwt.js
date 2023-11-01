const Service = require('egg').Service;

class JwtService extends Service {
    // token 生成
    async createToken(uid) {
        const config = this.app.config.jwt;
        return this.app.jwt.sign({
            uid: uid
        }, config.secret)
    }

    // 验证Token
    async verifyToken(token) {
        return true
    }

    // 通过token获取用户id
    async getUserIdFromToken(token) {
        await this.verifyToken(token);
        // 解析token
        const res = await this.app.jwt.decode(token);
        return res.uid;

        // 1. 获取请求头 authorization 属性，值为 token
        // const token = ctx.request.header.authorization;
        // console.log(uid);
        // 2. 用 app.jwt.verify(token， app.config.jwt.secret)，解析出 token 的值
        // const decode = await app.jwt.verify(token, this.app.config.jwt.secret);
    }

}
module.exports = JwtService