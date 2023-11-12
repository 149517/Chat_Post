<script setup>
import Menu from "./menu.vue";
import {computed} from "vue";
import {useStore} from "vuex";
import Tabulation from "./Tabulation.vue";
import Content from "./Content.vue";

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
    <div class="right">
      <Content class="h_content" :class="{'ejectCon':eject}"></Content>
    </div>
  </div>
</template>

<style scoped lang="scss">
$rightWidth: 300px;
$contentWidth: calc(100vw - 400px - 30px * 2 - 10px);
$boxHeight:98vh;
.container{
  padding: 30px;
  display: flex;
}
.left{
  width: 400px;
  height: $boxHeight;
  position: relative;
  top: 0;
  left: 0;
}
.menu {
  position: fixed;
  top:30px;
  left: 30px;
  bottom: 30px;
  width: 60px;
  transition: all .5s linear;
}
.eject-menu {
  width: 150px;
}
.ejectLeft{
  width: 490px;
  .tabulation{
    left: 190px;

  }
  transition: all .5s linear;
}
.ejectRight{
  .h_content{
    transition: all .5s linear;
    width: calc($contentWidth - 90px);
  }
}
.tabulation {
  position: fixed;
  top:10px;
  left: 100px;
  bottom: 10px;
  width: $rightWidth;
  border-radius: 8px;
  transition: all .5s linear;
  margin: 0 10px;
}

.h_content {
  width: $contentWidth;
  border-radius: 8px;
  transition: all .5s linear;
}
.ejectCon{
  transition: all .5s linear;
  width: calc($contentWidth - 90px);
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