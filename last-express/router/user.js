const express = require('express');
const router = express.Router();
const db = require('../db/db')
const crypto = require('crypto');
const {setToken} = require("../db/token");


/**
 * login 登录
 * return 用户信息，token
 * */
router.post('/login', (req, res) => {
    const {user, password} = req.body;

    let pass = getPass(password)

    // console.log(req.body)

    let sql = 'SELECT * FROM user WHERE user = ? AND password = ?'
    db.query(sql, [user, pass], (err, result) => {
        if (err) {
            console.log('登录查询失败')
            return res.status(500).send({error: '登录查询失败'});
        }
        if (result.length === 0) {
            console.log('用户不存在或密码不匹配');
            return res.status(401).send({error: '用户不存在或密码不匹配'});
        }
        const user = result[0];
        const token = setToken(user.user, user.id);


        // 将用户数据和令牌一起发送回客户端
        res.status(200).send({info: user, token});
    })
})

// 密码加密
function getPass(pass) {
    let md5 = crypto.createHash('md5');
    return md5.update(pass).digest('hex');
}

/**
 * register 注册
 * 密码加密，
 * 数据存储
 * */
router.post('/register', (req, res) => {
    const {user, password} = req.body;

    let pass = getPass(password)

    // 检查用户名是否重复
    let sqlName = 'SELECT * FROM user WHERE user = ? '
    db.query(sqlName, [user], (err, result) => {
        if (err) {
            console.log('注册查询失败')
            return res.status(500).send({error: '数据库查询失败'});
        }
        if (result.length > 0) {
            console.log('用户名已经存在，不可再次注册');
            return res.status(401).send({error: '用户名已经存在，不可再次注册'});
        }
        // 用户名不存咋，进行用户注册
        let sql = 'INSERT INTO user (user,password) VALUES (?, ?) '
        db.query(sql, [user, pass], (err, success) => {
            if (err) {
                console.log('用户注册查询失败')
                return res.status(500).send({error: '数据库注册失败'});
            }
            res.status(200).send("用户注册成功")
        })
    })
})
/**
 * 返回所有用户
 * */
router.get('/all', (req, res) => {
    let sql = 'SELECT * FROM user';
    db.query(sql, (err, results) => {
        if (err) {
            console.log('数据查询失败')
            return res.status(500).send({error: '数据查询失败'});
        }
        if (results.length === 0) {
            console.log('查询错误');
            return res.status(401).send({error: '查询错误'});
        }
        res.status(200).send(results)
    })

})

/**
 * 根据 uid 数组，返回用户的头像和名称
 * */
router.post('/userHead', async (req, res) => {
    let {list} = req.body;
    let data = []
    // 定义一个函数，用于查询用户信息
    const queryUser = (uid) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM user WHERE id = ?';
            db.query(sql, [uid], (err, result) => {
                if (err) {
                    console.log('用户信息查询失败');
                    reject(err);
                } else if (result.length === 0) {
                    console.log('用户不存在');
                    reject(new Error('用户不存在'));
                } else {
                    resolve(result[0]);
                }
            });
        });
    };

    try {
        for (let uid of list) {
            const user = await queryUser(uid);
            data.push(user);
        }

        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({error: '用户信息查询失败'});
    }
})

module.exports = router;
