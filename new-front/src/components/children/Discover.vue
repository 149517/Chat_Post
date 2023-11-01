<script setup>
import {onBeforeUnmount, onMounted, ref} from "vue";
import api from "../../utils/api.js";
import {useRouter} from "vue-router";

const postData = ref([{
  postid: null,
  authorid: 1,
  title: null,
  content: null,
  create_time: null,
  image_data: [{
    image_id: null,
    image: null
  }],
  pic: null,
  user: null,
  collect: null,
  comment: [],
  thumbs_up: null,
  collectActive: null,
  likeActive: null
}])

/**
 * 获取帖子列表
 * 在列表的基础上为每个帖子添加交互状态，点赞和收藏，
 * 默认为 false
 * */
const getPost = async () => {
  const result = await api.getPostList()
  // console.log(result.data)

  // 点赞信息
  // 手动添加
  result.data.forEach((item) => {
    item.collectActive = false;
    item.likeActive = false
  })

  postData.value = result.data

  await getInteract()
}

/**
 * 获取当前用户的交互记录
 * 在获得数据后，遍历数据，将用户交互过的帖子记录下来
 * 遍历帖子和交互数组，为每个帖子添加用户的交互状态
 * */
const getInteract = async () => {
  const result = await api.getPostInteract()
  // result 包含当前用户的点赞和收藏记录，分别遍历col和like，
  // 将其中包含的post 中的数据进行修改
  // console.log(result.data)
  let colList = []
  let likeList = []
  result.data.col.forEach((item) => {
    colList.push(item.postid)
  })
  result.data.like.forEach((item) => {
    likeList.push(item.postid)
  })
  // console.log(colList)
  // console.log(likeList)

  // 遍历当前帖子列表，将其包含交互的数据进行修改
  postData.value.forEach((item) => {
    colList.forEach((li) => {
      if (item.postid === li) {
        item.collectActive = true
      }
    })
    likeList.forEach((li) => {
      if (item.postid === li) {
        item.likeActive = true
      }
    })

  })
}


/**
 * 进入详情界面
 * */
const router = useRouter()
const openDetails = (id) => {
  // console.log(id)
  router.push({
    path: '/home/postDetails',
    query: {data: id}
  })
}

/**
 * 点击交互图标的操作
 * op 用户操作，点赞或者是收藏
 * item 点击的数据整条
 * */

// 用于存储用户交互过的 postid
const modifyList = ref([])
const interact = (op, item) => {
  if (op === 'collect') {
    modifyList.value.push(item.postid)
    item.collectActive = !item.collectActive
    if (item.collectActive === true) {
      item.collect += 1
    } else {
      item.collect -= 1
    }
  } else if (op === 'like') {
    modifyList.value.push(item.postid)
    item.likeActive = !item.likeActive
    if (item.likeActive === true) {
      item.thumbs_up += 1
    } else {
      item.thumbs_up -= 1
    }
  } else {
    // 点击评论时候进入详情
    openDetails(item.postid)
  }
}

/**
 * 将 界面中的操作上传到后端修改数据库中的数据
 * modifyList 进行过交互的数据列表
 * 组件销毁前调用
 * */

const dataUpload = async () => {
  let List = []
  modifyList.value.forEach((item) => {
    let post = postData.value.findIndex(li => li.postid === item);
    if (post !== -1) {
      // postData.value[post]  发生过交互的数据
      // console.log(postData.value[post])
      let data = postData.value[post]
      List.push({
        postid: data.postid,
        collect: data.collect,
        collectActive: data.collectActive,
        thumbs_up: data.thumbs_up,
        likeActive: data.likeActive
      })
    }
  })

  // 发送数据
  const result = await api.dataUpload(List)
  // console.log(result)
}

onMounted(() => {
  getPost()
})
onBeforeUnmount(() => {
  dataUpload()
})
</script>

<template>
  <div class="container">
    <div class="box">
      <div class="line theme" v-for="item in postData" :key="item.postid">
        <div class="head">
          <img :src="item.pic" alt="">
          <div class="name">{{ item.user }}</div>
        </div>
        <div class="content" @click="openDetails(item.postid)">
          <div class="tit">{{ item.title }}</div>
          <div class="con">{{ item.content }}</div>
          <div class="images" v-for="img in (item.image_data)" :key="img.image_id">
            <img :src="img.image" alt="">
          </div>
          <div class="time">{{ item.create_time }}</div>
        </div>
        <div class="interact">
          <div class="collect" @click="interact('collect',item)">
            <img src="src/assets/icon/collectSelect.png" alt="" v-if="item.collectActive">
            <img src="src/assets/icon/collect.png" alt="" v-else>
            <span>{{ item.collect }}</span>
          </div>
          <div class="comment" @click="interact('comment',item)">
            <img src="src/assets/icon/list.png" alt="">
            <span>{{ item.comment }}</span>
          </div>
          <div class="like" @click="interact('like',item)">
            <img src="src/assets/icon/likeSelect.png" alt="" v-if="item.likeActive">
            <img src="src/assets/icon/like.png" alt="" v-else>
            <span>{{ item.thumbs_up }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
$boxHeight: calc(100vh - 40px);
$imgWid: 60%;
.container{
  //padding: 10px 20px;
  border-radius: 8px;
}
.box {
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

.line {
  margin-bottom: 30px;
  text-align: left;
  position: relative;
  top: 0;
  left: 0;
  border-radius: 10px;
  padding: 20px 20px 30px;

  .head {
    display: flex;

    img {
      width: 60px;
      height: 60px;
      border-radius: 10px;
    }

    .name {
      margin-left: 20px;
      font-size: 24px;
    }
  }

  .content {
    margin-top: 20px;

    .tit {
      font-weight: bold;
    }

    .con {
      font-size: 16px;
      margin: 20px 0;
    }
  }

  .images {
    width: 100%;

    img {
      width: $imgWid;
      border-radius: 5px;
    }
  }

  .interact {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    img {
      width: 30px;
      vertical-align: top;
    }

    span {
      line-height: 30px;
      margin-left: 10px;

    }

  }

  .time {
    position: absolute;
    top: 30px;
    right: 30px;
    font-size: 12px;
    font-style: italic;
  }
}

</style>