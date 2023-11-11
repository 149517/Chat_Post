<template>
  <!--<h1>Welcome</h1>-->
  <div class="container ashBg">
    <div class="head">
      <div class="title">Zeze</div>
      <ul>
        <li>关于我</li>
        <li>网页介绍</li>
        <li>详细信息</li>
      </ul>
      <div class="login">
        <button @click="openPage('/login')">登录</button>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="text">
          <p class="large">Welcome Join </p>
          <p>这是一个包含用户聊天，帖子查阅，记录等的功能的网站</p>
          <p>网站需要登录访问，你需要先登录或者注册账号</p>
          <p>当然你也可以选择先浏览部分内容再考虑登录的问题</p>
          <div class="btn">
            <button @click="openPage('/login')">注册 & 登录</button>
            <button @click="openPage('/home')">浏览 not 登录</button>
          </div>
        </div>

      </div>
      <div class="right">
        <img src="src/assets/images/bg.png" alt="">
      </div>
    </div>

  </div>
</template>

<script setup>

import {useRouter} from "vue-router";

const router = useRouter()

const openPage = (url) => {
  router.push(url)
}
</script>


<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;
}

.head {
  cursor: pointer;
  padding: 10px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    margin-right: 50px;
    font: {
      size: 24px;
      weight: bold;
    };
  }

  ul {
    flex: 1;
    list-style: none;
    display: flex;
    align-items: center;
    line-height: 50px;

    li {
      letter-spacing: 2px;
      font-size: 16px;
      width: 200px;
      height: 50px;
      text-align: center;
    }
  }
}

.login {
  button {
    font-size: 16px;
    width: 120px;
    height: 40px;
    padding: 0;
    text-align: center;
    line-height: 40px;
    border-radius: 20px;
    background: #010101;
  }
}

.content {
  margin: 20px 50px;
  height: calc(100vh - 70px - 40px);
  border: 2px solid #010101;
  border-radius: 8px;
  display: flex;

  .left {
    width: 800px;
    height: 100%;
    //background: rgba(137, 204, 174, 0.78);

    .text {
      padding: 50px;

      .large {
        font: {
          weight: bold;
          size: 44px;
        };
        margin: 50px 0;
      }

      p {
        font-size: 22px;
        margin-bottom: 20px;
      }
    }

    .btn {
      margin-top: 80px;

      button {
        margin-right: 30px;
        height: 50px;
        padding: 0;
        line-height: 50px;
        width: 200px;
        border-radius: 25px;
        background: linear-gradient(to right top, #FDDDC9, #FC98A4);
      }
    }
  }

  .right {
    //flex: 1;
    margin-top: -3px;
    padding-bottom: 5px;

    img {

      width: 100%;
      height: 100%;
    }
  }
}
</style>