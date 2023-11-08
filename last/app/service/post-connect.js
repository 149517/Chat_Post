/* eslint-disable quotes */
/* eslint-disable semi */
'use strict';

const Service = require('egg').Service;

class PostDbService extends Service {
    // 查询所有的帖子信息
    async getPostData() {
        const { app } = this;
        // 使用 LEFT JOIN 连接 post 和 user 表，根据 authorid 进行关联
        let sql = `
        SELECT post.*, user.pic, user.user
        FROM post   
        LEFT JOIN user ON post.authorid = user.id
        `
        const posts = await app.mysql.query(sql);

        // 遍历每个帖子，查询相对应的图片
        for (const post of posts) {
            const images = await app.mysql.select('post_images', {
                where: { postid: post.postid },
            });
            post.image_data = images; // 将评论数据添加到帖子对象中
        }
        return posts;
    }

    // 根据id查询帖子的信息
    async getPost(id) {

        const { app } = this;
        let sql = `
            SELECT post.*, user.pic, user.user
            FROM post
            LEFT JOIN user ON post.authorid = user.id
            WHERE post.postid = ${id}
        `
        let post = await app.mysql.query(sql);
        post = post[0]
        // console.log(post);
        // post.aa = "aa"
        // const commentSql = `SELECT * FROM post_comment WHERE post_id = ${id}`;
        const imageSql = `SELECT * FROM post_images WHERE postid = ${id}`;
        try {
            // post.commentData = await app.mysql.query(commentSql);
            post.image_data = await app.mysql.query(imageSql);
        } catch (error) {
            console.error('Database query error:', error);
        }
        // console.log(post);
        return post
    }

    // 添加帖子信息
    async addPost(uid, file) {
        const { app } = this;
        // console.log(uid);
        const post = await app.mysql.insert('post', { authorid: uid, title: file.title, content: file.content, comment: 0, collect: 0, thumbs_up: 0 });
        // console.log(post);
        const pid = post.insertId; // 获取插入的'post'记录的ID
        // console.log(pid);
        if (file.images.length > 0) {
            const postImages = await app.mysql.insert('post_images', { postid: pid, image: file.images })
        }
        // console.log(postImages);
        return "sucess"
    }

    // 获取收藏数据
    async getCollect(uid, pid) {
        const { app } = this;
        // console.log("pid:" + pid);
        if (pid == undefined) {
            let sql = `SELECT * FROM post_collects WHERE userid = ?`
            return await app.mysql.query(sql, [uid]);
        } else {
            let sql = `SELECT * FROM post_collects WHERE userid = ? AND postid = ?`
            return await app.mysql.query(sql, [uid, pid]);
        }

    }
    // 获取点赞数据
    async getLikes(uid, pid) {
        const { app } = this;
        // console.log("pid:" + pid);
        if (pid == undefined) {
            let sql = `SELECT * FROM post_likes WHERE userid = ?`
            return await app.mysql.query(sql, [uid]);
        } else {
            let sql = `SELECT * FROM post_likes WHERE userid = ? AND postid = ?`
            return await app.mysql.query(sql, [uid, pid]);
        }
    }
    // 修改用户交互数据
    async setInteract(uid, list) {
        const { ctx, app } = this;
        // console.log(list);

        for (let item of list) {
            let pid = item.postid;
            const collect = item.collect;
            const thumbsUp = item.thumbs_up;
            const collectActive = item.collectActive
            const likeActive = item.likeActive

            try {
                // 使用参数化查询来防止 SQL 注入
                const sql = 'UPDATE post SET collect = ?, thumbs_up = ? WHERE postid = ?';
                await Promise.all([
                    app.mysql.query(sql, [collect, thumbsUp, pid])
                ]);

                if (collectActive) {
                    await Promise.all([
                        app.mysql.insert('post_collects', { postid: pid, userid: uid })
                    ])
                } else {
                    await Promise.all([
                        app.mysql.delete('post_collects', { postid: pid })
                    ])
                }
                if (likeActive) {
                    await Promise.all([
                        app.mysql.insert('post_likes', { postid: pid, userid: uid })
                    ])
                } else {
                    await Promise.all([
                        app.mysql.delete('post_likes', { postid: pid })
                    ])
                    // console.log(res);
                }
                // console.log(result);
            } catch (err) {
                console.error('数据库查询失败:', err);
                // 在这里可以添加适当的错误处理，例如记录错误日志或返回错误响应
            }
        }
    }

    // 添加帖子评论
    async fixComment(uid, pid, content) {
        const { ctx, app } = this;

        const res = await app.mysql.insert('post_comment', { post_id: pid, user_id: uid, content: content })

        return res
    }
    // 获取评论
    async findComment(pid) {
        const { app } = this;
        let sql = `SELECT * FROM post_comment WHERE post_id = ? `
        return await app.mysql.query(sql, [pid]);

    }
}

module.exports = PostDbService