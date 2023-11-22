<template>
  <div class="con">
    <div class="header">
      <h3>用户中心</h3>
    </div>
    <div class="box">
      <div class="top">
        <div class="line" @click="openPage('UserHead')">
          <p>用户头像</p>
          <img :src="pic" alt="">
        </div>
        <div class="line">
          <p>用户信息</p>
        </div>
        <div class="line">
          <p>其他</p>
        </div>
        <div class="line">
          <p>反馈</p>
        </div>
      </div>
      <div class="bottom">
        <div class="line">
          <p>退出登录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useStore} from "vuex";

const store = useStore()
const pic = store.state.pic

const emit = defineEmits(['newPage'])
const openPage = (name) => {
  emit('newPage', name)
}
</script>

<style scoped lang="scss">

.header {
  height: 50px;
  line-height: 50px;
}

.box {
  height: calc(100vh - 40px - 50px);
  //background: white;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  .line {
    text-align: left;
    line-height: 50px;
    border: 1px #e7e7e7 solid;
    padding: 5px 50px;
    transition: all .3s linear;
    border-radius: 8px;

    &:hover {
      background: white;
      box-shadow: 0 2px 6px #e7e7e7;
    }
  }

  .line:nth-child(1) {
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
  }
}

.bottom {
  .line {
    color: #e16363;
  }
}
</style>