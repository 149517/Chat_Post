<script setup>

import {onMounted, ref} from "vue";
import api from "../../utils/api.js";

const data = ref([{

}])
const getData = async () =>{
  const result = await api.getCollectData()
  console.log(result)
  data.value = result
}

onMounted(()=>{
  getData()
})
</script>

<template>
<div class="container">
  <div class="line inContent" v-for="item in data" :key="item.postid">
    <div class="head">
      <img :src="item.pic" alt="">
      <div class="name">{{item.user}}</div>
    </div>
    <div class="content">
      <div class="left">
        <div class="tit">
          {{item.title}}
        </div>
        <div class="text">
          {{item.content}}
        </div>
      </div>
      <div class="right">
        <div class="img" v-for="li in item.images" :key="li.image_id" :style="{ 'background-image': 'url(' + li.image + ')' }">

        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
.container{

}
.line{
  width: 100%;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  text-align: left;
  .head{
    display: flex;
    align-items: center;
    img{
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  .content{
    margin: 10px 0;
    display: flex;
    padding-right: 50px;
    //align-items: center;
    justify-content: space-around;
    .left{
      flex: 1;
    }
    .tit{
      font-size: 20px;
    }
    .text{
      font-size: 16px;
    }
    .right{
      width: 150px;
      height: 150px;
      .img{
        width: 100%;
        height: 100%;
        background-position: center center;
        border-radius: 10px;
        background: #e5e7eb;
      }
    }
  }
}
</style>