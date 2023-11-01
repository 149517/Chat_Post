'use strict';

const Service = require('egg').Service;


class ConnectDbService extends Service {
    // 获取所有的用户信息
    async getAllData() {
        const { app } = this;
        const user = await app.mysql.select('user');
        return user
    }
    // 检查用户名、密码是否正确
    async checkUsers(account, pass) {
        // console.log("AA")
        // console.log(account, pass)
        return await this.app.mysql.get('user', { user: account, password: pass })
    }
    // 检查是否存在这个用户名
    async checkUserName(name) {
        return await this.app.mysql.get('user', { user: name })
    }

    // 添加一个账户信息
    async addAccount(account, pass) {
        const { app } = this;
        return await app.mysql.insert('user', { user: account, password: pass, pic: null });
    }

    // 通过用户ID查询该用户的信息
    async userInfo(uid) {
        const { app } = this;
        return await app.mysql.get('user', { id: uid })
    }

    // 返回用户头像和名称
    async getUserHead(list) {
        const { app } = this;
        let res = []
        // console.log(list);

        for (let item of list) {
            let sql = `SELECT * FROM user WHERE id = ?`
            const result = await app.mysql.query(sql, [item]);
            // console.log(result[0]);
            res.push(result[0])
        }
        return res

    }
}

module.exports = ConnectDbService;