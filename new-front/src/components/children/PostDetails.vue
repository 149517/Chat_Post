<script setup>
import {useRoute} from "vue-router";
import {onBeforeUnmount, onMounted, ref} from "vue";
import api from "../../utils/api.js";

const route = useRoute()
const id = ref(null);
const interact = ref(true)

const data = ref({
  authorid: null,
  collect: null,
  comment: null,
  pic: null,
  user: null,
  commentData: [
    {
      id: null,
      user_id: null,
      content: null,
      create_at: null,
    }
  ],
  content: null,
  create_time: null,
  image_data: [
    {
      image_id: null,
      image: null
    }
  ],
  postid: null,
  thumbs_up: null,
  title: null,
})
// 评论数据
const comData = ref([])
// {
//   id: null,
//       user_id: null,
//     content: null,
//     create_at: null,
//     user: null,
//     pic: null
// }
// 获取帖子数据
const getData = async () => {
  const list = await api.getPostOne(id.value)
  console.log(list)
  data.value = list.data

  getInteract()

}

const collectActive = ref(false);
const likeActive = ref(false)
// 获取 用户的交互记录
const getInteract = async () => {
  const post = await api.getOneInteract(id.value)
  // console.log(post.data)
  if (post.data.col.length > 0) {
    collectActive.value = true
  }
  if (post.data.like.length > 0) {
    likeActive.value = true
  }
  getHead()
}

// 获取评论的用户头像和name
const commentUserHead = ref([])
const getHead = async () => {
  const list = []
  let lis = data.value.commentData;
  lis.forEach(item => {
    list.push(item.user_id)
  })
  // 根据评论数组返回头像和用户名
  console.log(list)
  const result = await api.getUserHead(list)
  console.log(result)

  result.data.forEach((item) => {
    // console.log(item.id)
    lis.forEach((li)=>{
      if(li.user_id === item.id){
        comData.value.push({...item, ...li})
      }
    })
  })
  console.log(comData.value)
}

onMounted(() => {
  id.value = route.query.data
  getData()

})
onBeforeUnmount(() => {
  id.value = null;
  data.value = null
})
</script>

<template>
  <div class="container theme">
    <div class="box">
      <div class="head">
        <img :src="data.pic" alt="">
        <div class="name">{{ data.user }}
          <p>intro</p></div>
      </div>
      <div class="con">
        <div class="tit">{{ data.title }}</div>
        <div class="text">{{ data.content }}</div>
      </div>
      <div class="img" v-for="item in data.image_data" :key="item.image_id">
        <img :src="item.image" alt="">
      </div>
      <div class="time">{{ data.create_time }}</div>
      <hr>
      <div class="interact">
        <div class="line">
          <div class="share">
            分享
          </div>
          <div class="collect">
            <img src="src/assets/icon/collectSelect.png" alt="" v-if="collectActive">
            <img src="src/assets/icon/collect.png" alt="" v-else>
          </div>
          <div class="like">
            <img src="src/assets/icon/likeSelect.png" alt="" v-if="likeActive">
            <img src="src/assets/icon/like.png" alt="" v-else>
          </div>
        </div>
        <div class="comment">
          <div class="li" v-for="item in comData" :key="item.id">
            <div class="tou">
              <img :src="item.pic" alt="">
            </div>
            <div class="remark">
              <div class="name">{{item.user}}</div>
              <div><p> {{ item.content }}</p></div>
            </div>
          </div>
          <div class="add">
            <input type="text">
            <button>评论</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$boxHeight: calc(100vh - 40px);
$imgWid: 60%;
.box {
  padding: 10px 20px;
  width: 100%;
  height: calc($boxHeight - 30px);
  padding-bottom: 30px;
  overflow-y: scroll;
}

// chrome 和 safari
.box::-webkit-scrollbar {
  width: 0 !important
}

// ie10+
.box {
  -ms-overflow-style: none;
}

.box {
  text-align: left;

  .head {
    display: flex;

    img {
      width: 80px;
      height: 80px;
      border-radius: 8px;
    }

    .name {
      margin-left: 30px;
      font: {
        size: 30px;
      }

      p {
        font-size: 16px;
      }
    }
  }

  .con {
    margin-top: 30px;

    .tit {
      font-weight: bold;
    }

    .text {
      margin: 10px 0;
    }
  }

  .img {
    margin: 10px 0;
    width: 100%;

    img {
      width: 100%;
      border-radius: 10px;
    }
  }

  .time {
    text-align: right;
    font-size: 16px;
    margin-bottom: 30px;
  }

  .interact {

    .line {
      margin: 10px 0;
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      vertical-align: top;
      .collect,
      .share,
      .like{
        text-align: center;
        flex: 1;
      }
      .collect{
        border-left: 1px solid silver;
        border-right: 1px solid silver;
      }
      img {
        width: 40px;
      }
    }

    .comment {
      .li{
        height: 60px;
        display: flex;
        border-bottom: 1px silver solid;
        padding: 5px 30px;
        .tou{
          img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }
        .remark{
          margin-left: 20px;
          font-size: 18px;
          .name{
            font-size: 16px;
            color: #b0b0b0;
          }
        }
      }
      .add{
        display: flex;
        margin: 30px 0;
      }
      input{
        flex: 1;
        margin: 0 10px;
        border-radius: 8px;
        outline: none;
        padding-left: 15px;
        font-size: 18px;
      }

    }
  }

}
</style>