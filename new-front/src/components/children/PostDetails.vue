<script setup>
import {useRoute, useRouter} from "vue-router";
import {onBeforeUnmount, onMounted, ref} from "vue";
import api from "../../utils/api.js";
import {message} from "ant-design-vue";
import upload from "../../utils/upload.js";

const route = useRoute()
const router = useRouter()
const id = ref(null);
// 是否修改数据，修改则会进行提交
const fix = ref(false)
const msg = ref(null)

const data = ref({
  authorid: null,
  collect: null,
  comment: null,
  pic: null,
  user: null,
  content: null,
  create_time: null,
  images: [
    {
      image_id: null,
      image: null
    }
  ],
  postid: null,
  thumbs_up: null,
  title: null,
})
const commentData = ref([
  {
    id: null,
    user_id: null,
    content: null,
    create_at: null,
  }
])

// 评论数据
const comData = ref([])

// 获取帖子数据
const getData = async () => {
  data.value = await api.getPostOne(id.value)
}
// 获取评论
const getComment = async () => {
  commentData.value = await api.getComment(id.value)
}

const collectActive = ref(false);
const likeActive = ref(false)

// 获取 用户的交互记录
const getInteract = async () => {
  const post = await api.getOneInteract(id.value)
  // console.log(post)

  if (post.collects.length > 0) {
    collectActive.value = true
  }
  if (post.likes.length > 0) {
    likeActive.value = true
  }
}
const getHead = async () => {

  let result = []
  let lis = commentData.value;
  // console.log(lis)
  // 获取评论中含有的用户id,并进行数组去重
  const list = [...new Set(lis.map(item => item.user_id))];
  // console.log(list);

  // 根据评论数组返回头像和用户名
  const res = await api.getUserHead(list)
  // console.log(res)

  for (let item of lis) {
    let line = res.find(li => li.id === item.user_id);
    if (line) {
      result.push({...item, ...line})
    }
  }
  comData.value = result
  // console.log(result)

}

const warning = (value) => {
  message.warning(value);
};
// 交互
const interact = (op) => {
  if (!upload.checkUser()) {
    warning('请登录后再操作')
    // tips 进行提示
    return
  }
  if (op === 'collect') {
    fix.value = true
    collectActive.value = !collectActive.value
    if (collectActive.value === true) {
      data.value.collect += 1
    } else {
      data.value.collect -= 1
    }
  } else if (op === 'like') {
    fix.value = true
    likeActive.value = !likeActive.value
    if (likeActive.value === true) {
      data.value.thumbs_up += 1
    } else {
      data.value.thumbs_up -= 1
    }
  } else {
    warning("暂未开通此功能")
  }
  dataUpload()
}

// 数据提交
const dataUpload = async () => {
  if (!fix.value) return
  let List = [{
    postid: data.value.postid,
    collect: data.value.collect,
    collectActive: collectActive.value,
    thumbs_up: data.value.thumbs_up,
    likeActive: likeActive.value
  }]

  const result = await api.dataUpload(List)
  // console.log(result)
}
// 添加评论
const commentUpload = async () => {
  if (msg.value === null) {
    warning('内容不能为空')
    return
  }
  // console.log(msg.value)
  comData.value.push({
    user_id:localStorage.getItem('uid'),
    postid:id.value,
    user:localStorage.getItem('user'),
    pic:localStorage.getItem('pic'),
    content:msg.value
  })
  const res = await api.addComment(msg.value, data.value.postid)

  // console.log(res)
  msg.value = null

}
const init = async () => {
  await getData()
  await getComment()
  await getHead()
  await getInteract()
}
onMounted(() => {
  id.value = route.query.data
  init()

})
onBeforeUnmount(() => {
  // dataUpload()
})
</script>

<template>
  <div class="container">
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
      <div class="img" v-for="item in data.images" :key="item.image_id">
        <img :src="item.image" alt="">
      </div>
      <div class="time">{{ data.create_time }}</div>
      <hr>
      <div class="interact">
        <div class="line">
          <div class="share" @click="interact('share')">
            分享
          </div>
          <div class="collect" @click="interact('collect')">
            <img src="src/assets/icon/collectSelect.png" alt="" v-if="collectActive">
            <img src="src/assets/icon/collect.png" alt="" v-else>
            {{ data.collect }}
          </div>
          <div class="like" @click="interact('like')">
            <img src="src/assets/icon/likeSelect.png" alt="" v-if="likeActive">
            <img src="src/assets/icon/like.png" alt="" v-else>
            {{ data.thumbs_up }}
          </div>
        </div>
        <div class="comment">
          <div class="li" v-for="item in comData" :key="item.id">
            <div class="tou">
              <img :src="item.pic" alt="">
            </div>
            <div class="remark">
              <div class="name">{{ item.user }}</div>
              <div><p> {{ item.content }}</p></div>
            </div>
          </div>
          <div class="add">
            <input type="text" v-model.trim="msg" @keydown.enter="commentUpload">
            <button @click="commentUpload">评论</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

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
      .like {
        text-align: center;
        flex: 1;

      }

      .collect {
        border-left: 1px solid silver;
        border-right: 1px solid silver;
      }

      img {
        vertical-align: bottom;
        width: 40px;
      }
    }

    .comment {
      .li {
        height: 60px;
        display: flex;
        border-bottom: 1px silver solid;
        padding: 5px 30px;

        .tou {
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }

        .remark {
          margin-left: 20px;
          font-size: 18px;

          .name {
            font-size: 16px;
            color: #b0b0b0;
          }
        }
      }

      .add {
        display: flex;
        margin: 30px 0;
      }

      input {
        flex: 1;
        margin: 0 10px;
        border-radius: 8px;
        outline: none;
        border: 1px silver solid;
        padding-left: 15px;
        font-size: 18px;
      }
    }
  }
}
</style>