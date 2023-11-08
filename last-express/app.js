const express = require('express');
const http = require('http');

const app = express();
const httpServer = http.Server(app);
const socketIO = require('./io/socket')
const db = require('./db/db.js');
const userRouter = require('./router/user.js');
const postRouter = require('./router/post.js');
const parseToken = require('./db/parseToken')
const cors = require('cors');

// 使用express.static中间件，并传入一个目录路径
app.use('/images',express.static('public'));

// 使用cors中间件
app.use(cors());

// 解析路由参数
app.use(express.json())

// 解析token的中间件
app.use(parseToken)

// 使用 MySQL 连接
app.use(function (req, res, next) {
    req.db = db;
    next();
});

// 使用路由
app.use('/user', userRouter);
app.use('/post', postRouter);

// 使用 Socket.io
socketIO(httpServer);

app.get('/', function (req, res) {
    res.send("<h1>nihao</h1>")
});

httpServer.listen(3000, function () {
    console.log('listening on *:3000');
});
