<script setup>
import {useStore} from "vuex";
import {computed, ref} from "vue";
import api from '../../utils/api.js'
import {useRouter} from "vue-router";

const store = useStore()
const router = useRouter()

const dark = computed(() => store.state.dark)
const page = computed(() => store.state.login)

const togglePage = () => {
  store.commit("toggleLogin", !page.value)
}

// login && register
const account = ref(null)
const password = ref(null)
const password2 = ref(null)

const Launch_login = async () => {
  // console.log(account.value,password.value)
  if (account.value === null || password.value === null) return
  const result = await api.login(account.value,password.value)

  // 存储数据到本地
  // console.log(result)
  store.commit('addUser',result.user)
  store.commit('addPic',result.pic)
  store.commit('addIntro',result.intro)
  store.commit('addUid',result.uid)

  localStorage.setItem('token',result.token)
  localStorage.setItem('pic',result.pic)
  localStorage.setItem('user',result.user)
  localStorage.setItem('uid',result.uid)

  clear()

  // 跳转
  setTimeout(()=>{
    router.push('/home')
  },1500)

}
const Launch_register = async () => {
  if (account.value === null || password.value === null || password2.value === null) return
  if(password.value !== password2.value) {
    console.log("两次密码输入不一致")
    return
  }
  const result = await api.register(account.value,password.value)
  console.log(result)
  console.log(account.value,password.value)
  clear()
}
const clear=()=>{
  account.value = ''
  password.value = ''
  password2.value = ''
}
</script>

<template>
  <div class="content" :class="dark?'dark':'light'">
    <!--login-->
    <div class="login inContent" v-if="page">
      <div class="container">
        <div class="left">
          <div class="box">
            <h2>Welcome Back</h2>
            <div class="text">
              <input type="text" v-model.trim.lazy="account" placeholder="Account">
              <input type="password" v-model.trim.lazy="password" placeholder="Password">
            </div>
            <button @click="Launch_login">登录</button>
          </div>
          <div class="bottom">
            <span @click="togglePage">注册</span>
            <router-link to="/"><span>首页</span></router-link>
          </div>
        </div>
        <div class="right">
          <img src="src/assets/images/login_bg.jpg" alt="bg">
        </div>
      </div>
    </div>
    <!--    register-->
    <div class="register inContent" v-if="!page">
      <div class="container">
        <div class="left">
          <div class="box">
            <h2>Welcome Join</h2>
            <div class="text">
              <input type="text" v-model.trim.lazy="account" placeholder="Account">
              <input type="password" v-model.trim.lazy="password" placeholder="Password">
              <input type="password" v-model.trim.lazy="password2" placeholder="Confirm Password">
            </div>
            <button @click="Launch_register">登录</button>
          </div>
          <div class="bottom">
            <span @click="togglePage">登录</span>
            <router-link to="/"><span>首页</span></router-link>
          </div>
        </div>
        <div class="right">
          <img src="src/assets/images/register_bg.jpg" alt="bg">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content {
  width: 100vw;
  height: 100vh;
  padding: 50px 0;
}


.login,
.register {
  width: 70%;
  max-height: 90%;
  margin: auto;
  border-radius: 20px;
  overflow: hidden;
  //background: #fff;
  box-shadow: 1px 1px 15px silver;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;

  .left {
    opacity: 0;
    animation: fadeInUp 0.5s linear forwards;
    //animation-delay: .5s;
    width: 50%;
    height: 100%;
    padding: 30px;
    position: relative;
    top: 0;
    left: 0;

    .box {
      width: 300px;
      margin: 20px auto 80px;

      .text {
        margin: 30px 0;

        input {
          width: 240px;
          height: 40px;
          background: #f1f1f111;
          border-radius: 10px;
          outline: none;
          padding: 5px 10px;
          margin: 10px 0;
        }
      }

      button {
        padding: 10px 25px;
        letter-spacing: 5px;
        color: black;
      }
    }

    .bottom {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }
  }

  .right {
    opacity: 0;
    animation: fadeInUp 0.5s linear forwards;
    animation-delay: 0.5s;
    width: 50%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
    }
  }

}
@media screen and (max-width: 1200px) and (min-width: 1050px) {
  .login,
  .register {
    width: 90%;
  }
}
</style>