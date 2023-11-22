<template>
  <div class="container">
    <div class="header">
      <h3>公共频道</h3>
    </div>
    <div class="box">
      <div class="line" v-for="item in list">
        <div class="context" :class="item.current?'current':'receive'">
          <div class="mes">
            {{ item.msg }}
          </div>
          <div class="info">
            <div class="head">
              <!--              <div class="name">{{item.user}}</div>-->
              <img :src="item.pic" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text">
      <div class="options">
        <img src="src/assets/icon/visible.png" alt="">
      </div>
      <textarea id="put" v-model.trim="msg" @keydown.enter="launch"></textarea>
      <button @click="launch">发送</button>
    </div>

  </div>

</template>

<script setup>

import {computed, onMounted, ref} from "vue";
import {io} from "socket.io-client";
import api from "../../utils/api.js";
import {useStore} from "vuex";

const store = useStore()
const list = ref([])
const msg = ref(null)

const room = ref('aaa')


const socket = io('http://localhost:3000');
socket.on("connect", () => {
  console.log('socket 连接成功')
  // console.log(socket.id);
});
const launch = () => {
  sendMessage()
  msg.value = null;
}
const createRoom = (roomName) => {
  socket.emit('create-room', roomName)
}

// 事件处理：发送消息
function sendMessage() {
  let roomName = room.value;
  let user = localStorage.getItem('user')
  let message = msg.value
  let uid = parseInt(localStorage.getItem('uid'))
  socket.emit('chat', {room: roomName, user, uid, message});
}

// 监听服务器发送的房间创建通知
socket.on('room-created', function (message) {
  // console.log(message);
  // 在此处可以更新界面，显示房间创建成功的消息
});

const userList = ref([]);

// 监听服务器发送的聊天消息
socket.on('chat', async (data) => {
  // console.log(data);
  let current = false;
  let uid = data.uid;

  if (data.user === localStorage.getItem('user')) {
    current = true;
  }

  let result = null;


  // 获取用户头像信息
  const pic = await getPic([uid]);

  // 将消息添加到列表
  list.value.push({
    id: uid,
    msg: data.message,
    user: data.user,
    pic: pic, // 使用头像信息，如果获取失败则为 null
    current: current,
  });
  // 在推送后，控制台记录更新后的列表
});

// 获取用户头像的方法
// 修改 getPic 方法，接受一个 uid 参数
const getPic = (uid) => {
  try {
    // 在此处请求用户头像
    return api.getUserHead(uid)
        .then(result => {
          // 将用户头像信息存储到 userList 中
          const user = {
            uid: uid,
            pic: result[0].pic
          };

          // 如果 userList 中不存在该用户，则添加到 userList
          if (!userList.value.some(u => u.uid === uid)) {
            userList.value.push(user);
          }

          // 返回用户头像信息
          return user.pic;
        })
        .catch(error => {
          console.error("获取用户头像时出错:", error);
          return null;
        });
  } catch (error) {
    console.error("获取用户头像时出错:", error);
    return null;
  }
};

socket.on("disconnect", () => {
  console.log(socket.id); // undefined
});

const getHistoryMessage = async () =>{
  // 获取历史消息记录
  let result = await api.getMessageAll()
  console.log(result)
  // 处理历史消息记录
  let current = null
  for (let item of result){
    let uid = parseInt(localStorage.getItem('uid'))
    // 当用户名相同时候则为当前用户，
    current = item.userid === uid;
    console.log(current)
    // let pic = null
    let pic = await getPic([item.userid])
    list.value.push({
      id: item.id,
      msg: item.content,
      user: item.user,
      pic: pic, // 使用头像信息，如果获取失败则为 null
      current: current,
    });
  }

}
onMounted(() => {
  createRoom(room.value)
  getHistoryMessage()
})
</script>

<style scoped lang="scss">
$contentHeight: 500px;
$inputHeight:calc(100vh - 50px - 20px - 500px);
.container {
  //background: #747bff;
  height: 100vh;
  padding: 10px 0;
  border: solid 1px;
  border-color: transparent #e5e7eb transparent #e5e7eb;
}
.header{
  height: 50px;
  line-height: 50px;

}
.box {
  height: $contentHeight;
  overflow-y: scroll;
}
.box::-webkit-scrollbar {
  width: 0 !important
}

.line {
  min-height: 50px;
  width: 100%;
  margin-bottom: 15px;
  color: black;
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
      margin-left: 10px;
    }

    .head {
      height: 50px;

      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }

    .mes {
      background: lightgray;
      padding: 10px 20px;
      border-radius: 8px;
      line-height: 24px;
      text-align: left;
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
  width: 100%;
  height: $inputHeight;
  box-shadow: #e5e7eb 0px -3px 6px;
  position: relative;
  top: 0;
  left: 0;

  input {
    height: 50px;
    flex: 1;
    margin-right: 20px;
    padding: 0 15px;
    outline: none;
    border-radius: 8px;
  }
  .options{
    padding: 0 20px;
    text-align: left;
    width: 100%;
    height: 30px;
    border-bottom: 1px solid lightgray;
    img{
      width: 30px;
      height: 30px;
    }
  }
  #put{
    width: 100%;
    height: 100px;
    border: none;
    background: transparent;
    outline: none;
    resize: none;
    padding: 20px;
    font-size: 18px;
  }
  button{
    position: absolute;
    right: 30px;
    bottom: 20px;
    border-radius: 5px;
  }

}
</style>