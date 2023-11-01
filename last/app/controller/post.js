'use strict';

const { Controller } = require('egg');
class PostController extends Controller {
    async postAll() {
        const { ctx } = this;

        try {
            // 全部的帖子数据
            const result = await ctx.service.postConnect.getPostData();

            ctx.body = {
                success: true,
                data: result
            };
            ctx.status = 200;
        } catch {
            ctx.body = {
                success: false,
                message: "数据查询失败",
            };
            ctx.status = 404;
        }
    }

    // 返回用户的交互记录，
    async postInteract() {
        // 根据用户的id查询用户的交互记录
        // 含有 pid 返回单个帖子的记录
        const { ctx } = this;
        const id = ctx.state.uid;
        const { pid } = ctx.request.body;
        let collectTable = null;
        let likeTable = null;
        try {
            if (pid) {
                collectTable = await ctx.service.postConnect.getCollect(id, pid);
                likeTable = await ctx.service.postConnect.getLikes(id, pid);
            } else {
                collectTable = await ctx.service.postConnect.getCollect(id);
                likeTable = await ctx.service.postConnect.getLikes(id);
            }

            ctx.body = {
                success: true,
                data: {
                    uid: id,
                    col: collectTable,
                    like: likeTable
                }
            };
            ctx.status = 200;

        } catch {
            ctx.body = {
                success: false,
                message: "数据查询失败",
            };
            ctx.status = 404;
        }
    }

    // 获取用户的交互进行数据修改
    async modifyData() {
        const { ctx } = this;
        const uid = ctx.state.uid;
        const { list } = ctx.request.body;

        try {
            // console.log(uid);
            // console.log(list);

            // 添加帖子中的交互数据
            const result = await ctx.service.postConnect.setInteract(uid, list);

            ctx.body = {
                success: true,
                message: result,
            };
            ctx.status = 200;
        } catch {
            ctx.body = {
                success: false,
                message: "数据查询失败",
            };
            ctx.status = 404;
        }
    }

    // 获取单个post
    async postData() {
        const { ctx } = this;
        // const { id } = ctx.request.body;
        const id = ctx.params.id;
        // console.log(id);
        try {
            const result = await ctx.service.postConnect.getPost(id);
            ctx.body = {
                success: true,
                data: result
            };
            ctx.status = 200;
        } catch {
            ctx.body = {
                success: false,
                message: "数据查询失败",
            };
            ctx.status = 404;
        }
    }

    // 添加帖子
    async getUpload() {
        const { ctx, app } = this;
        const { file } = ctx.request.body

        // 从中间件获取uid
        let uid = ctx.state.uid
        const result = await ctx.service.postConnect.addPost(uid, file)
        // console.log(result);

        ctx.body = {
            success: true,
            message: "aaa"
        }
        ctx.status = 200;
    }

    // 添加评论
    async addCom() {
        const { ctx } = this;
        const { pid, content } = ctx.request.body

        let uid = ctx.state.uid


        try {
            const res = await ctx.service.postConnect.fixComment(uid, pid, content)
            // console.log(res);
            ctx.body = {
                success: true,
                message: "添加成功"
            }
            ctx.status = 200;
        } catch {
            ctx.body = {
                success: false,
                message: "添加失败"
            }
            ctx.status = 404;
        }


    }

    // 获取评论
    async getCom() {
        const { ctx } = this;
        const { pid } = ctx.request.body
        try {
            const res = await ctx.service.postConnect.findComment(pid)
            // console.log(res);
            ctx.body = {
                success: true,
                data: res
            }
            ctx.status = 200;
        } catch {
            ctx.body = {
                success: false,
                data: res
            }
            ctx.status = 404;
        }
    }

}

module.exports = PostController;