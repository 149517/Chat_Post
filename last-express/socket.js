const socketIO = require('socket.io');

module.exports = function (httpServer) {
  const io = socketIO(httpServer, {
    cors: {
      origin: "*",  // 允许所有来源的连接
      methods: ["GET", "POST"]  // 允许的请求方式
    }
  });

  io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
      io.emit('chat message', "socketio: " + msg);
    });
  });
};
