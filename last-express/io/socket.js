const socketIO = require('socket.io');
const {getUid} = require("./uid");

module.exports = function (httpServer) {
    const io = socketIO(httpServer, {
        cors: {
            origin: "*",  // 允许所有来源的连接
            methods: ["GET", "POST"]  // 允许的请求方式
        }
    });

    // 存储连接的用户和对应的socket信息
    const connectedUsers = {};
    // const uid = getUid()

    io.on('connection', function (socket) {
        // 监听客户端请求创建聊天房间
        socket.on('create-room', function (roomName) {
            // 将用户加入房间
            socket.join(roomName);

            // 通知客户端房间已创建
            io.to(roomName).emit('room-created', `Room "${roomName}" created`);
        });
        // 监听客户端发送的消息
        socket.on('chat', function (data) {
            // 发送消息到同一个房间内的所有客户端
            io.to(data.room).emit('chat', {
                user: data.user,
                message: data.message
            });
        });
        socket.on('chat message', function (msg) {
            console.log(msg)
            io.emit('chat message', msg);
        });
    });
};
