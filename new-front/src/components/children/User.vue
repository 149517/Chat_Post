<script setup>

import {computed, onMounted, ref} from "vue";
import api from "../../utils/api.js";
import {useStore} from "vuex";

const chat = computed(()=>store.state.chatPage)
const store = useStore()
const currentUser = ref(
    {
      pic: store.state.pic,
      user: store.state.user,
      intro: store.state.intro
    }
);

const getUser = async () => {

  if (currentUser.value.user === null) {
    currentUser.value = {
      pic: 'src/assets/images/head.jpg',
      user: "未登录",
      intro: "登录查看更多内容"
    }
  }

}

// 好友列表
const list = ref([])
const getBuddy = async () => {
  list.value = await api.getAll();
}

const reduce = ref(false)

const fixReduce = () => {
  if(reduce.value === false){
    store.commit('toggleChatPage',true)
  }else{
    store.commit('toggleChatPage',false)
  }
  reduce.value = !reduce.value
}

onMounted(() => {
  getUser();
  getBuddy()
})
</script>

<template>
  <div class="bg">
    <div class="plane theme" :class="{'plane-reduce':reduce}">
      <div class="box">
        <div class="imgBox">
          <img :src="currentUser.pic" alt="">
        </div>
        <div class="text">
          <p class="name">{{ currentUser.user }}</p>
          <p class="intro">{{ currentUser.intro }}</p>
        </div>
      </div>
      <div class="trends">
        <div class="title">最近动态</div>
        <div class="after" :class="{'after-reduce':reduce}" @click="fixReduce">
        </div>
      </div>
    </div>
    <div class="buddy theme" :class="{'buddy-increase':chat}">
      <div class="title">好友列表</div>
      <div class="scroll-view">
        <div class="list box" v-for="item in list" :key="item.id">
          <div class="imgBox">
            <img :src="item.pic" alt="item.user">
          </div>
          <div class="text">
            <p class="name">{{ item.user }}</p>
            <p class="message">message</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$userHeight: 280px;
$buddyHeight: calc(100vh - $userHeight - 20px * 2);
.bg{
  width: 100%;
  height: 100vh;
}
.box {
  display: flex;
  align-items: center;

  .imgBox {
    width: 70px;
    height: 70px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 10%;
    }
  }

  .text {
    text-align: left;
    margin-left: 20px;

    .name {
      margin-top: 10px;
      font-weight: bold;
    }

    .intro {
      margin-top: 10px;
      font-size: 12px;
    }
  }
}

.title {
  text-align: left;
  font-size: 16px;
}

.plane {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: $userHeight;
  //background: #e5e7eb;
  padding: 10px;
  border-radius: 10px;
  transition: all ease-in .5s;
}

.trends {
  margin-top: 20px;
}

.after {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border: 10px transparent solid;
  border-bottom-color: #acaeb0;
}

.plane-reduce {
  height: 150px;
}

.after-reduce {
  bottom: 0;
  border: 10px transparent solid;
  border-top-color: #acaeb0;
}

.buddy {
  .title {
    border-bottom: 1px rgb(199, 218, 76) solid;
  }
  width: 100%;
  height: $buddyHeight;
  overflow: hidden;
  //background: #e5e7eb;
  padding: 10px;
  border-radius: 10px;
  margin-top: 20px;
}
.buddy-increase{
  height: calc($buddyHeight + $userHeight - 150px);
}

.scroll-view {
  height: calc($buddyHeight + $userHeight - 150px - 30px);
  padding-bottom: 30px;
  overflow-y: scroll;
}

// chrome 和 safari
.scroll-view::-webkit-scrollbar {
  width: 0 !important
}

// ie10+
.scroll-view {
  -ms-overflow-style: none;
}

// firefox
//.buddy { overflow: -moz-scrollbars-none; }

.list {
  border-bottom: 1px silver solid;
  margin-top: 5px;

  .imgBox {
    width: 50px;
    height: 50px;
  }

  .message {
    font-size: 12px;
  }
}
</style>