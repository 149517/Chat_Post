<script setup>
import {ref} from "vue";
import ImgUpload from "../login/ImgUpload.vue";
import {useStore} from "vuex";
import api from "../../utils/api.js";

const tx = ref(null)
const tit = ref(null)

const store = useStore()
// const file = computed(()=>store.state.send)
const fileList = ref({
  title:null,
  content:null,
  images:[],
})

const fileUpload = async () =>{
  fileList.value.content = tx.value;
  fileList.value.title = tit.value

  // console.log(fileList.value)
  // let token = localStorage.getItem('token') || null
  // console.log(token)
  // console.log(fileList.value)
  const result = await api.fileUpload(fileList.value)
  console.log(result)
  clear()
}

const clear = () =>{
  tx.value = null;
  fileList.value = null;
  store.commit('changeSend',false)
}

// 修改sending的值，触发子组件向父组件传值，然后发送请求
const fixValue = ()=>{
  store.commit('changeSend',true)
}
// 接收子组件传递过来的图片文件，将其添加到fileList 对象内
const accept = (value) =>{
  // console.log(value)
  value.forEach((item)=>{
    // console.log(item.thumbUrl)
    fileList.value.images.push(item.thumbUrl)
  })
  // console.log(fileList.value)

  fileUpload()
}
</script>

<template>
  <div class="container theme">
    <div class="box">
      <h3>内容发布</h3>

      <div class="title">
        <input v-model="tit" type="text">
      </div>
      <div class="text">

        <textarea v-model="tx" rows="6" cols="108"></textarea>
      </div>
      <div class="img">
        <ImgUpload @sending="accept"></ImgUpload>
      </div>

      <button @click="fixValue">发布</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container{
  padding: 10px 20px;
  border-radius: 8px;
}
.box {
  text-align: left;
  width: 100%;
  //height: 500px;
  .title{
    input{
      width: 100%;
      height: 40px;
      border-radius: 10px;
      border: 1px solid silver;
      padding: 0 10px;
      margin: 20px auto;
      font-size: 18px;
      outline: none;
    }
  }
  .text {
    width: 100%;

    textarea {
      width: 100%;
      height: 30%;
      border-radius: 10px;
      border: 2px solid silver;
      padding: 10px;
      margin: 20px auto;
      font-size: 18px;
      outline: none;
    }
  }

  .img {
    margin-bottom: 20px;
    width: 100%;
    //height: 200px;
  }

  button {
    text-align: right;
    margin-bottom: 30px;
  }
}
</style>