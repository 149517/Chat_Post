<script setup>
import {ref} from "vue";
import ImgUpload from "../login/ImgUpload.vue";
import {useStore} from "vuex";
import api from "../../utils/api.js";

const tx = ref(null)
const tit = ref(null)

const store = useStore()
const fileList = ref({
  title: null,
  content: null,
  images: [],
})

const fileUpload = async () => {
  fileList.value.content = tx.value;
  fileList.value.title = tit.value
  console.log("执行到上传")

  const result = await api.fileUpload(fileList.value)
  console.log(result)
  clear()
}

const clear = () => {
  tx.value = null;
  tit.value = null;
  fileList.value = null;
  store.commit('changeSend', false)

}

// 修改sending的值，触发子组件向父组件传值，然后发送请求
const fixValue = () => {
  store.commit('changeSend', true)
}
// 接收子组件传递过来的图片文件，将其添加到fileList 对象内
const accept = (value) => {
  value.forEach((item) => {
    fileList.value.images.push(item.thumbUrl)
  })

  fileUpload()
}
</script>

<template>
  <div class="container">
    <div class="box">
      <h3>内容发布</h3>

<!--      <div class="title">-->
<!--        <p>主题</p>-->
<!--        <input v-model="tit" type="text">-->
<!--      </div>-->
      <div class="text">
<!--        <p>内容</p>-->
        <textarea v-model="tx"></textarea>

      </div>
      <div class="img">
        <p>添加图片</p>
        <ImgUpload @sending="accept"></ImgUpload>
      </div>

      <button @click="fixValue">发布</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  height: 100vh;
  margin: 0;
  padding: 10px 20px;
  border-radius: 8px;
}

.box {
  h3 {
    text-align: center;
    margin: 20px auto;
  }

  text-align: left;
  width: 100%;

  .title {
    input {
      width: 100%;
      height: 40px;
      border-radius: 10px;
      border: 1px solid silver;
      padding: 0 10px;
      margin: 10px auto;
      font-size: 18px;
      outline: none;
    }
  }

  .text {
    width: 100%;

    textarea {
      width: 100%;
      height: 180px;
      border-radius: 10px;
      border: 1px solid silver;
      padding: 10px;
      margin: 10px auto;
      font-size: 18px;
      outline: none;
    }
  }

  .img {
    margin-bottom: 20px;
    width: 100%;
  }

  button {
    display: block;
    width: 140px;
    height: 50px;
    padding: 0;
    text-align: center;
    margin: 10px auto;
  }
}
</style>