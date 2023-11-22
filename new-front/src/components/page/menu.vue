<script setup>

import {computed, ref} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";

const store = useStore()
const router = useRouter()
const handleFunc = (item) => {
  let value = item.fun;
  if (value === 'toggleDark') {
    toggleDark(item)
  }
  if (value === 'toggleEject') {
    toggleEject()
  }
  let link = item.link;
  if (link) {
    router.push(link)
  }

  FixActive();
  item.active = true
}

const FixActive = () => {
  menu.value.forEach((list) => {
    list.forEach((item) => {
      item.active = false
    })
  })
}
const toggleDark = (item) => {
  item.toggle = !item.toggle
  if (item.toggle) {
    item.name = "暗色"
  } else {
    item.name = "浅色"
  }
  store.commit('toggleDark', !item.toggle)
}

const eject = computed(() => store.state.eject)
const toggleEject = () => {
  store.commit('toggleEject', !eject.value)
}

const menu = ref([
  [{
    id: "1",
    name: "菜单",
    icon: "src/assets/icon/classify.png",
    link: "",
    fun: "toggleEject",
    active: false
  },
    {
      id: "2",
      name: "聊天",
      icon: "src/assets/icon/message.png",
      link: "/home/chat",
      active: false
    },
    {
      id: "3",
      name: "发现",
      icon: "src/assets/icon/discover.png",
      link: "/home/discover",
      active: true
    },
    {
      id: "4",
      name: "编辑",
      icon: "src/assets/icon/edit.png",
      link: "/home/edit",
      active: false
    },
    {
      id: "5",
      name: "收藏",
      icon: "src/assets/icon/collect.png",
      link: "/home/collect",
      active: false
    }],
  [{
    id: "6",
    name: "暗色",
    icon: "src/assets/icon/sun.png",
    toggleIcon: "src/assets/icon/moon.png",
    toggle: true,
    link: "",
    fun: "toggleDark",
    active: false
  },
    {
      id: "7",
      name: "账户",
      icon: "src/assets/icon/person.png",
      toggleIcon: "",
      toggle: false,
      fun: "",
      link: "/home/person",
      active: false
    }],
])
</script>

<template>
  <div class="content theme">
    <div class="menu-box">
      <div class="box-block" v-for="(li,index) in menu" :key="index">
        <div class="imgBox" v-for="item in li" :key="item.id" @click="handleFunc(item)"
             :class="{'eject-imgBox':eject,'active':item.active}">
          <div class="text">{{ item.name }}</div>
          <img :src="item.toggleIcon" :alt="item.name" v-if="item.toggle">
          <img :src="item.icon" :alt="item.name" v-else>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content {
  border-radius: 20px;

}

.menu-box {
  width: 100%;
  height: 100%;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  position: relative;
  top: 0;
  left: 0;

  &::before {
    content: "";
    position: absolute;
    top: 30px;
    left: 0;
    z-index: 9;
    width: 5px;
    height: calc(100% - 60px);
  }

  .box-block {
    .imgBox {
      position: relative;
      top: 0;
      left: -45px;
      width: 150px;
      margin-bottom: 10px;
      padding: 8px 10px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all .5s linear;

      img {
        width: 40px;
        height: 40px;
      }
    }

    .eject-imgBox {
      left: 0;
      padding: 0 20px;
      font-size: 16px;
      margin: 20px 0;
    }
  }
}

</style>