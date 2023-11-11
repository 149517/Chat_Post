const express = require('express');
const db = require("../db/db");
const router = express.Router();

/**
 * 获取所有帖子
 * */
router.get('/all', (req, res) => {

    // let sql = 'SELECT post.*, user.pic, user.user FROM post LEFT JOIN user ON post.authorid = user.id'
    let sql = 'SELECT post.*, user.pic, user.user, ' +
        'JSON_ARRAYAGG(post_images.image) AS images ' +
        'FROM post ' +
        'LEFT JOIN user ON post.authorid = user.id ' +
        'LEFT JOIN post_images ON post.postid = post_images.postid ' +
        'GROUP BY post.postid';
    db.query(sql, (err, results) => {
        if (err) {
            console.log('all 数据查询失败')
            return res.status(500).send({error: '数据查询失败'});
        }
        if (results.length === 0) {
            console.log('查询错误');
            return res.status(401).send({error: '查询错误'});
        }
        // console.log(results)
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
        // res.send(result[0])
        let sqlImg = 'SELECT * from post_images WHERE postid = ?'
        db.query(sqlImg, [id], (err, row) => {
            if (err) {
                console.log('数据查询失败')
                return res.status(500).send({error: '数据查询失败'});
            }
            // console.log(row)
            result[0].images = row;
            res.status(200).send(result[0])
        })

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
        // 循环添加图片
        for (let item of file.images) {
            db.query(sqlImg, [postid, item], (err, success) => {
                if (err) {
                    console.log('图片添加失败')
                    return res.status(500).send({error: '图片添加失败'});
                }
                res.status(200).send(success)
            })
        }


    })
})

/**
 * 获取用户的交互记录
 * */
router.get('/interact/:id?', (req, res) => {
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
    // console.log(params)
    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('数据库查询出错', err);
            callback({error: '数据库查询出错'});
        } else {
            callback(result);
        }
    });
}

function modifyInter(op, item, uid, res) {
    try {
        let checkSql, sqlAdd, sqlDel;
        if (op === 'collect') {
            checkSql = 'SELECT * FROM post_collects WHERE postid = ? AND userid = ?';
            sqlAdd = 'INSERT INTO post_collects (postid, userid) VALUES (?, ?)';
            sqlDel = 'DELETE FROM post_collects WHERE postid = ? AND userid = ?';
        } else if (op === 'like') {
            checkSql = 'SELECT * FROM post_likes WHERE postid = ? AND userid = ?';
            sqlAdd = 'INSERT INTO post_likes (postid, userid) VALUES (?, ?)';
            sqlDel = 'DELETE FROM post_likes WHERE postid = ? AND userid = ?';
        }

        db.query(checkSql, [item.postid, uid], (err, rows) => {
            if (err) {
                console.log('数据查询失败');
            } else if (rows.length === 0) {
                // 不存在时才插入数据
                db.query(sqlAdd, [item.postid, uid], (err, result) => {
                    if (err) {
                        console.log('数据添加失败')
                        res.status(401).send('数据添加失败')
                    }
                    // res.status(200).send("数据添加成功")
                    return '数据添加成功'
                });
            } else {
                // 存在时删除数据
                db.query(sqlDel, [item.postid, uid], (err, result) => {
                    if (err) {
                        console.log('数据删除失败')
                        res.status(401).send('数据删除失败')
                    }
                    // res.status(200).send("数据删除成功")
                    return '数据添加成功'
                });

            }
        });
    } catch (err) {
        console.log('发生错误：', err);
        res.status(500).send("服务器内部错误")
    }
}


/**
 * 修改用户的交互数据
 * */
router.post('/dataUpload', (req, res) => {
    let uid = req.uid
    const {list} = req.body;

    for (let item of list) {
        // 先查询数据库中的记录
        let sqlQuery = 'SELECT * FROM post WHERE postid = ?';
        db.query(sqlQuery, [item.postid], (err, rows) => {
            if (err) {
                console.log('数据查询失败');
                res.status(500).send("数据查询失败");
            } else {
                // 比对查询结果和list中的数据，找出需要更新的字段
                let changes = {};
                if (rows[0].collect !== item.collect) {
                    changes.collect = item.collect;
                }
                if (rows[0].thumbs_up !== item.thumbs_up) {
                    changes.thumbs_up = item.thumbs_up;
                }

                // 更新数据
                let sqlUpdate = 'UPDATE post SET collect = ?, thumbs_up = ? WHERE postid = ?';
                db.query(sqlUpdate, [item.collect, item.thumbs_up, item.postid], (err, result) => {
                    if (err) {
                        console.log('数据修改失败');
                        res.status(500).send("数据修改失败");
                    } else {
                        if (changes.collect) {
                            modifyInter('collect', item, uid, res);
                        }
                        if (changes.thumbs_up) {
                            modifyInter('like', item, uid, res);
                        }
                        res.status(200).send("数据修改成功");
                    }
                });
            }
        });
    }
});


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
