<script setup>
import Menu from "./menu.vue";
import {computed} from "vue";
import {useStore} from "vuex";
import Tabulation from "./Tabulation.vue";
import Content from "./Content.vue";
import User from "../children/User.vue";

const store = useStore()
const dark = computed(() => {
  return store.state.dark
})
const eject = computed(() => store.state.eject)

</script>

<template>
  <div class="container" :class="dark?'dark':'light'">
    <div class="left" :class="{'ejectLeft':eject}">
      <Menu class="menu" :class="eject?'eject-menu':''"></Menu>
      <Tabulation class="tabulation"></Tabulation>
    </div>
    <div class="middle">
      <Content class="h_content" :class="{'ejectCon':eject}"></Content>
    </div>
    <div class="right" :class="{'ejectRight':eject}">
      <User class="user"></User>
    </div>
  </div>
</template>

<style scoped lang="scss">
$rightWidth: 230px;
$contentWidth: calc(100vw - 300px * 2 - 30px * 2 - 20px - 40px);
$boxHeight: 98vh;
.container {
  padding: 20px;
  display: flex;
  justify-content: space-between;
}

.left {
  width: 330px;
  height: $boxHeight;
  position: relative;
  top: 0;
  left: 0;
}

.middle {
  flex: 1;
  padding-left: 30px;
  margin: auto;
}

.right {
  width: 260px;
  height: $boxHeight;
  position: relative;
  top: 0;
  right: 0;
}

.user {
  width: 260px;
  position: fixed;
  top: 30px;
  right: 30px;
  bottom: 30px;
}

.menu {
  position: fixed;
  top: 30px;
  left: 30px;
  bottom: 30px;
  width: 60px;
  transition: all .5s linear;
}

.eject-menu {
  width: 150px;
}

.ejectLeft {
  width: 490px;

  .tabulation {
    left: 190px;
  }

  transition: all .5s linear;
}

.ejectRight {
  .h_content {
    transition: all .5s linear;
    width: calc($contentWidth - 90px);
  }
}

.tabulation {
  position: fixed;
  top: 30px;
  left: 100px;
  bottom: 30px;
  width: $rightWidth;
  border-radius: 8px;
  transition: all .5s linear;
  margin: 0 10px;
}

.h_content {
  width: $contentWidth;
  //height: 98vh;
  margin: 0 10px;
  border-radius: 8px;
  transition: all .5s linear;
}

.ejectCon {
  transition: all .5s linear;
  width: calc($contentWidth - 90px);
}

.ejectRight {
  width: 360px;
}

@media screen and (max-width: 800px) {
  .tabulation {
    display: none;
  }
  .h_con {
    width: calc(100vw - 20px * 2 - 60px - 30px);
  }

}

</style>