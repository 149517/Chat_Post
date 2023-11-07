// {app_root}/app/io/middleware/connection.js
module.exports = () => {
  return async (ctx, next) => {
    ctx.socket.emit('res', '连接成功!');
    console.log('连接成功');
    await next();
    // execute when disconnect.
    console.log('断开连接了!');
  };
}
