'use strict';

const { Controller } = require('egg');

class UserController extends Controller {
  async all() {
    const { ctx } = this;
    // console.log(ctx.session.counter);

    try {
      const result = await ctx.service.connect.getAllData();
      ctx.body = result
    } catch {
      ctx.body = "数据查询失败"
    }
  };
  async launch_login() {

    const { ctx } = this
    const { user, password } = ctx.request.body;

    try {
      const result = await ctx.service.connect.checkUsers(user, password);
      // console.log(result);

      if (result) {
        const token = await ctx.service.jwt.createToken(result.id)

        ctx.body = {
          success: true,
          token: token,
          pic: result.pic,
          user:result.user,
          intro:result.intro,
          uid:result.id
        };
      } else {
        ctx.body = {
          success: false,
          message: "User not found or password is incorrect",
        };
      }
    } catch (err) {
      // Handle database query errors
      ctx.body = {
        success: false,
        message: "An error occurred while processing your request",
      };
      ctx.status = 500; // Set the HTTP status code to indicate an internal server error
    }
  };

  async launch_register() {
    const { ctx } = this
    const { user, password } = ctx.request.body;

    try {
      const result = await ctx.service.connect.checkUserName(user)
      if (result) {
        ctx.body = {
          success: false,
          message: "用户名已经存在",
        };
        ctx.status = 200; // Set the HTTP status code to indicate an internal server error
      } else {
        const addAcc = await ctx.service.connect.addAccount(user, password)
        ctx.body = {
          success: true,
          message: "注册成功",
        };
        ctx.status = 200;
      }

    } catch {
      ctx.body = {
        success: false,
        message: "An error occurred while processing your request",
      };
      ctx.status = 500; 
    }
  }

  // 根据 uid 数组，返回用户的头像和名称
  async getUserHead(){
    const { ctx } = this;
    const { list } = ctx.request.body

    try{
      const result = await ctx.service.connect.getUserHead(list);
      ctx.body = {
        success: true,
        data: result,
      };
      ctx.status = 200;
    }catch {
      ctx.body = {
        success: false,
        data: "查询失败",
      };
      ctx.status = 404; 
    }
  }
}


module.exports = UserController;
