<template>
  <div class="container theme">
    <h1>Chat</h1>
  </div>

</template>

<script setup>

import {io} from "socket.io-client";

const socket = io('http://localhost:7001/example', {
  // 实际使用中可以在这里传递参数
  query: {
    room: 'demo',
    userId: `client_${Math.random()}`,
  },

});
socket.on("server", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("disconnect", () => {
  console.log(socket.id); // undefined
});
</script>

<style scoped lang="scss">
.container{
  padding: 10px 20px;
  border-radius: 20px;
}
</style>