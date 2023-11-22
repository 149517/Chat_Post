<script setup>

import {computed, onMounted, ref, watch} from "vue";
import api from "../../utils/api.js";
import {useStore} from "vuex";

const store = useStore();

const id = computed(() => store.state.selectUid)
// console.log(id.value)
let uid = store.state.uid

watch(id,(newValue)=>{
  // console.log(newValue)
  uid = newValue
  init()
})
// 用户信息
const currentUser = ref(
    {
      pic: null,
      user: null,
      intro: null,
    }
);

// 图集
const images = ref([])
const posts = ref([])

const getUser = async () => {

  if (uid === null) {
    currentUser.value = {
      pic: 'src/assets/images/head.jpg',
      user: "未登录",
      intro: "登录查看更多内容"
    }
  }
  currentUser.value = await api.getCurrentUser(uid)
}

// 获取用户的发表过的图片
const getImages = async () => {
  images.value = await api.getUserImages(uid)
}

// 获取用户发表过的帖子
const getPost = async () => {
  posts.value = await api.getUserPost(uid)
}

const init = () => {
  getUser();
  getImages();
  getPost();
}

onMounted(() => {
  init()
})
</script>

<template>

  <div class="plane">
    <div class="head">
      <div class="img">
        <img :src="currentUser.pic" alt="">
      </div>
      <p class="name">{{ currentUser.user }}</p>
      <p class="intro">{{ currentUser.intro }}</p>

    </div>
    <div class="lastly">
      <!--      图集-->
      <div class="images">
        <img v-for="item in images" :key="item.image_id" :src="item.image" alt="">
      </div>
      <!--      动态-->
      <div class="post">
        <div class="line" v-for="item in posts" :key="item.postid">
          <p>{{ item.content }}</p>
          <span>{{ api.getDateTime(item.create_time) }}</span>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">

.plane {
  border-radius: 10px;
}

.head {
  text-align: center;

  .img {
    width: 80px;
    height: 80px;
    margin: auto;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

  }

  .name {
    font: {
      size: 24px;
      weight: 600;
    }
    margin: 10px 0;
  }
}

.lastly {
  width: 100%;
  height: calc(100vh - 60px - 150px);
  margin-top: 20px;
  border-radius: 20px;
  overflow-y: scroll;

  img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    margin: 3px;
    border: 1px silver solid;
    background: white;
  }

  .post {
    text-align: left;

    .line {
      width: 100%;
      padding: 10px;
      background: #e9f1ff;
      border-radius: 10px;
      margin: 5px 0;
      color: black;

      span {
        display: inline-block;
        width: 100%;
        text-align: right;
        font-size: 12px;
        color: #9d9d9d;
      }
    }
  }
}
.lastly::-webkit-scrollbar {
  width: 0 !important
}
</style>