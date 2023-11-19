<script setup>
import {onMounted, ref} from "vue";
import api from "../../utils/api.js";
import {useStore} from "vuex";

const store = useStore()
const lastMessage = ref("last message")
const data = ref(null);

const getData = async () => {
  data.value = await api.getAll();
}

// 选择用户，切换为对应用户的界面和信息
const toggleUser = (id) => {
  store.commit('toggleSelectUid',id)
  // console.log('id修改'+id)
  // console.log(store.state.selectUid)
}

onMounted(() => {
  getData()
})
</script>

<template>
  <div class="container">
    <h3>Friends</h3>
    <div class="search">
      <input type="text" placeholder="Search as ...">
    </div>
    <div class="list">
      <div class="view">
        <div class="line" v-for="item in data" :key="item.id" @click="toggleUser(item.id)">
          <div class="head">
            <img :src="item.pic" alt="">
          </div>
          <div class="message">
            <div class="name">{{ item.user }}</div>
            <div class="last-mes">
              {{ lastMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search {
  input {
    width: 100%;
    height: 40px;
    border-radius: 10px;
    padding: 5px 10px;
    background: white;
    outline: none;
    border: 0;
  }

  margin: 20px 0;
}

.list {
  // 好友列表容器高度
  height: calc(98vh - 40px - 10px - 40px - 30px);
  overflow-y: scroll;
}

.list::-webkit-scrollbar {
  width: 0 !important
}

.line {
  width: 100%;
  display: flex;
  text-align: left;
  padding: 10px 0;
  border-bottom: 1px silver solid;
}

.head {
  width: 50px;
  height: 50px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
}

.message {
  margin-left: 10px;

  .name {
    font-size: 20px;
  }

  .last-mes {
    font-size: 12px;
    color: #9c9ca6;
  }
}
</style>