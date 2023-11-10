<template>
  <div class="container theme">
    <h3>chat</h3>
    <div class="box">
      <div class="line" v-for="item in list">
        <div class="context" :class="item.current?'current':'receive'">
          <div class="mes">
            {{ item.msg }}
          </div>
          <div class="info">
            {{ item.user }}
          </div>
        </div>
      </div>
    </div>
    <div class="text">
      <input type="text" v-model.trim="msg" @keydown.enter="launch">
      <button @click="launch">发送</button>
    </div>

  </div>

</template>

<script setup>

import {io} from "socket.io-client";
import {onMounted, ref} from "vue";

const list = ref([])
const msg = ref(null)
const room = ref('aaa')
// const currentUser = ref(true)

const socket = io('http://localhost:3000');
socket.on("connect", () => {
  console.log(socket.id);
});
const launch = () => {
  // list.value.push({
  //   msg: msg.value,
  //   user: localStorage.getItem('user'),
  //   current: true
  // })
  sendMessage()
  msg.value = null;
}
const createRoom = (roomName) => {
  socket.emit('create-room',roomName)
}
// 事件处理：发送消息
function sendMessage() {
  let roomName = room.value;
  let user = localStorage.getItem('user')
  let message = msg.value
  socket.emit('chat', { room: roomName, user, message });
}

// 监听服务器发送的房间创建通知
socket.on('room-created', function (message) {
  console.log(message);
  // 在此处可以更新界面，显示房间创建成功的消息
});

// 监听服务器发送的聊天消息
socket.on('chat', function (data) {
  let current = false;
  if(data.user === localStorage.getItem('user')){
    current = true
  }
  list.value.push({
    msg: data.message,
    user: data.user,
    current: current
  })
  // console.log(`${data.user}: ${data.message}`);
  // 在此处可以更新界面，显示聊天消息
});


socket.on("disconnect", () => {
  console.log(socket.id); // undefined
});

onMounted(()=>{
  createRoom(room.value)
})
</script>

<style scoped lang="scss">
.container {
  padding: 10px 20px;
  border-radius: 20px;
}

.box {
  height: 500px;
}

.line {
  width: 100%;
  margin-bottom: 10px;
  //background: #7e90a9;
  .context {
    width: 100%;
    height: 50px;
    position: relative;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    line-height: 50px;

    .info {
      width: 50px;
      height: 50px;
      margin-left: 10px;
      border-radius: 50%;
      background: #747bff;
    }

    .mes {
      background: lightgray;
      padding: 0 20px;
      border-radius: 5px;
    }
  }

  .receive {
    .info {
      position: absolute;
      left: 0px;
    }

    .mes {
      position: absolute;
      left: 70px;
    }

  }

  .current {
    .info {
      background: #506F72;
      position: absolute;
      right: 0px;
    }

    .mes {
      background: yellowgreen;
      position: absolute;
      right: 70px;
    }

  }
}

.text {
  display: flex;
  align-items: center;
  width: 100%;

  input {
    height: 50px;
    flex: 1;
    margin-right: 20px;
    padding: 0 15px;
    outline: none;
    border-radius: 8px;
  }
}
</style>