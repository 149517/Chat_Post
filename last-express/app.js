const express = require('express');
const http = require('http');

const app = express();
const httpServer = http.Server(app);

// 导入 socket.js 文件
const socketIOConfig = require('./socket.js')(httpServer);

app.get('/', function (req, res) {
  res.send("<h1>nihao</h1>")
});

httpServer.listen(3000, function () {
  console.log('listening on *:3000');
});
