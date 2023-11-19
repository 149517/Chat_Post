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
            const sql = 'SELECT user,id,pic,intro FROM user WHERE id = ?';
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

// 获取当前用户的信息
router.post('/currentUser', (req, res) => {
    const {uid} = req.body;

    let sql = 'SELECT user,id,pic,intro FROM user WHERE id = ?'
    db.query(sql, [uid], (err, row) => {
        if (err) {
            console.log("数据查询失败")
            return res.status(500).send({error: '数据查询失败'});
        }
        if (row.length === 0) {
            console.log('没有该用户');
            return res.status(401).send({error: '没有该用户'});
        }
        res.status(200).send(row[0])
    })

})

const getUserPost = (res, uid) => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT postid FROM post WHERE authorid = ?'

        db.query(sql, [uid], (err, row) => {
            if (err) {
                console.log('数据查询失败')
                reject("数据查询失败");
            }
            // if (row.length === 0) {
            //     console.log("没有相关数据")
            //     reject('没有相关数据');
            // }
            resolve(row);
        });
    });
}

// 获取当前用户发布过的图片
router.post('/userImages', async (req, res) => {
     const { uid } = req.body;

    try {
        // 先查询该用户发布过的 post
        const result = await getUserPost(res, uid);
        // console.log(result);

        // 根据 postid 查询对应的图片
        let sql = 'SELECT image FROM post_images WHERE postid = ?';
        let imagePromises = [];

        for (let item of result) {
            imagePromises.push(new Promise((resolve, reject) => {
                db.query(sql, [item.postid], (err, row) => {
                    if (err) {
                        console.log('数据查询失败');
                        reject("数据查询失败");
                    }
                    if (row.length > 0) {
                        resolve(row[0]);
                    } else {
                        resolve(null);
                    }
                });
            }));
        }

        // 等待所有图片查询完成
        const images = await Promise.all(imagePromises);

        // console.log(images);
        res.status(200).send(images.filter(image => image !== null));
    } catch (error) {
        console.error(error);
        res.status(400).send("数据查询失败");
    }
})

// 获取用户发布过的帖子
router.post('/userPost',async (req,res)=>{
    const { uid } = req.body;

    try {
        // 先查询该用户发布过的 post
        const result = await getUserPost(res, uid);
        // console.log(result);

        // 根据 postid 查询对应的图片
        let sql = 'SELECT postid,content,create_time FROM post WHERE postid = ?';
        let postPromise = [];

        for (let item of result) {
            postPromise.push(new Promise((resolve, reject) => {
                db.query(sql, [item.postid], (err, row) => {
                    if (err) {
                        console.log('数据查询失败');
                        reject("数据查询失败");
                    }
                    if (row.length > 0) {
                        resolve(row[0]);
                    } else {
                        resolve(null);
                    }
                });
            }));
        }

        // 等待所有图片查询完成
        const posts = await Promise.all(postPromise);

        // console.log(posts);
        res.status(200).send(posts.filter(post => post !== null));
    } catch (error) {
        console.error(error);
        res.status(400).send("数据查询失败");
    }
})
module.exports = router;
