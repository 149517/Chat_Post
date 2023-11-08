const express = require('express');
const db = require("../db/db");
const router = express.Router();

/**
 * 获取所有帖子
 * */
router.get('/all', (req, res) => {

    let sql = 'SELECT post.*, user.pic, user.user FROM post LEFT JOIN user ON post.authorid = user.id'
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
 * 获取单个帖子
 * */
router.get('/list/:id', (req, res) => {
    const id = req.params.id;
    let sql = 'SELECT post.*, user.pic, user.user FROM post LEFT JOIN user ON post.authorid = user.id WHERE postid = ?'
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log('数据查询失败')
            return res.status(500).send({error: '数据查询失败'});
        }
        res.status(200).send(result[0])
    })
})

/**
 * 添加帖子
 * */
router.post('/upload', (req, res) => {
    const {file} = req.body;
    let uid = req.uid;
    // console.log(file)
    let sql = 'INSERT INTO post (authorid,title,content,comment,collect,thumbs_up) VALUES (?,?,?,?,?,?)'
    db.query(sql, [uid, file.title, file.content, 0, 0, 0], (err, result) => {
        if (err) {
            console.log('数据添加失败')
            return res.status(500).send({error: '数据添加失败'});
        }
        // 添加成功，添加图片信息
        let sqlImg = 'INSERT INTO post_images (postid,image) VALUES (?,?)'
        let postid = result.insertId;
        db.query(sqlImg, [postid, file.images], (err, success) => {
            if (err) {
                console.log('图片添加失败')
                return res.status(500).send({error: '图片添加失败'});
            }
            res.status(200).send(success)
        })

    })
})

/**
 * 获取用户的交互记录
 * */
router.post('/interact/:id?', (req, res) => {
    const id = req.params.id;
    let uid = req.uid;
    if (id === undefined) {
        // 返回所有的帖子交互
        let sqlCol = 'SELECT * FROM post_collects WHERE userid = ?'
        let sqlLike = 'SELECT * FROM post_likes WHERE userid = ?'
        // 执行两个查询，将结果通过回调函数返回
        performQuery(sqlCol, [uid], (collects) => {
            performQuery(sqlLike, [uid], (likes) => {
                res.status(200).json({uid, collects, likes});
            });
        });
    } else {
        // 返回单个的帖子交互
        let sqlCol = 'SELECT * FROM post_collects WHERE userid = ? AND postid = ?'
        let sqlLike = 'SELECT * FROM post_likes WHERE userid = ? AND postid = ?'
        // 执行两个查询，将结果通过回调函数返回
        performQuery(sqlCol, [uid, id], (collects) => {
            performQuery(sqlLike, [uid, id], (likes) => {
                res.status(200).json({uid, collects, likes});
            });
        });
    }
})

/**
 * 查询函数，接受查询条件和参数
 * 用户交互记录
 */
function performQuery(sql, params, callback) {
    console.log(params)
    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('数据库查询出错', err);
            callback({error: '数据库查询出错'});
        } else {
            callback(result);
        }
    });
}

/**
 * 修改用户的交互数据
 * */
router.post('/dataUpload', (req, res) => {
    let uid = req.uid
    const {list} = req.body;

    for (let item of list) {
        let sql = 'UPDATE post SET collect = ?, thumbs_up = ? WHERE postid = ? '
        db.query(sql, [item.collect, item.thumbs_up, item.postid], (err, result) => {
            if (err) {
                console.log('数据修改失败')
                res.status(500).send("数据修改失败")
            }
            if (item.collectActive) {
                let checkSql = 'SELECT * FROM post_collects WHERE postid = ? AND userid = ?';
                db.query(checkSql, [item.postid, uid], (err, rows) => {
                    if (err) {
                        console.log('数据查询失败');
                    } else if (rows.length === 0) {
                        // 不存在时才插入数据
                        let sqlCol = 'INSERT INTO post_collects (postid, userid) VALUES (?, ?)';
                        db.query(sqlCol, [item.postid, uid], (err, result) => {
                            if (err) {
                                console.log('数据添加失败')
                                res.send('数据添加失败')
                            }
                            res.status(200).send("数据添加成功")
                        });

                    }
                });
            }
            if (item.likeActive) {
                let checkSql = 'SELECT * FROM post_likes WHERE postid = ? AND userid = ?';
                db.query(checkSql, [item.postid, uid], (err, rows) => {
                    if (err) {
                        console.log('数据查询失败');
                    } else if (rows.length === 0) {
                        // 不存在时才插入数据
                        let sqlLike = 'INSERT INTO post_likes (postid, userid) VALUES (?, ?)';
                        db.query(sqlLike, [item.postid, uid], (err, result) => {
                            if (err) {
                                console.log('数据添加失败')
                                res.send('数据添加失败')
                            }
                            res.status(200).send("数据添加成功")
                        });
                    }
                });
            }
        })
    }
})

/**
 * 添加评论
 * */
router.post('/addComment', (req, res) => {
    const {pid, content} = req.body
    let uid = req.uid

    let sql = 'INSERT INTO post_comment (post_id,user_id,content) VALUES (?,?,?)'
    db.query(sql, [pid, uid, content], (err, result) => {
        if (err) {
            console.log('数据添加失败')
            res.send('数据添加失败')
        }
        res.status(200).send("数据添加成功")
    })
})

/**
 * 获取评论
 * */
router.post('/getComment', (req, res) => {
    const {pid} = req.body;
    let sql = 'SELECT * FROM post_comment WHERE post_id = ? '
    db.query(sql, [pid], (err, result) => {
        if (err) {
            console.log('数据查询失败')
            return res.status(500).send({error: '数据查询失败'});
        }
        res.status(200).send(result)
    })
})
module.exports = router;
