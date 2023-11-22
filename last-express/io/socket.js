const socketIO = require('socket.io');
const {getUid} = require("./uid");
const db = require('../db/db')

module.exports = function (httpServer) {
    const io = socketIO(httpServer, {
        cors: {
            origin: "*",  // 允许所有来源的连接
            methods: ["GET", "POST"]  // 允许的请求方式
        }
    });

    // 存储连接的用户和对应的socket信息
    // const rooms = [];
    //
    // const getRoomName = (id1, id2) => {
    //     let room = id1 < id2 ? id1 + '-' + id2 : id2 + '-' + id1;
    //     if(rooms.indexOf(room) === -1){
    //         rooms.push(room)
    //     }
    //     return room;
    // }
    //
    // io.on('connection', socket => {
    //     socket.on('join-room', (id1, id2) => {
    //         let roomName = getRoomName(id1, id2);
    //         socket.join(roomName);
    //         io.to(roomName).emit('room-created', `Room "${roomName}" created`);
    //     });
    //
    //     socket.on('send-chat-message', (room, data) => {
    //         console.log(room)
    //         console.log(data)
    //         io.to(room).emit('chat-message', data);
    //     });
    // });


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
            saveMes(data, function (result) {
                // 将存储结果返回给客户端
                console.log(result);

                // 发送消息到同一个房间内的所有客户端
                io.to(data.room).emit('chat', {
                    uid: data.uid,
                    user: data.user,
                    message: data.message
                });
            });
        });
        socket.on('chat message', function (msg) {
            console.log(msg)
            io.emit('chat message', msg);
        });
    });

    // 将数据消息到数据库
    const saveMes = (data, callback) => {
        let {message, uid} = data;
        let sql = 'INSERT INTO public_messages (content, userid) VALUES (?,?)';

        db.query(sql, [message, uid], (err, row) => {
            if (err) {
                console.log('消息添加失败');
                callback({status: 'fail', mes: '消息添加失败'});
            } else {
                console.log('消息添加成功');
                callback({status: 'success', mes: '消息添加成功'});
            }
        });
    };
};
