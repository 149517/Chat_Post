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
  <!--  <h1>HOME</h1>-->
  <div class="container" :class="dark?'dark':'light'">
    <Menu class="menu" :class="eject?'eject-menu':''"></Menu>

    <Content class="h_con"></Content>

    <Tabulation class="tabulation"></Tabulation>


  </div>
</template>

<style scoped lang="scss">
$rightWidth: 350px;
$contentWidth: calc(100vw - 20px * 2 - 30px * 2 - 60px - $rightWidth);
.container {
  padding: 0 30px;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
}

.menu {
  width: 60px;
  height: 94vh;
  transition: all .5s linear;
}

.eject-menu {
  width: 150px;
}

.tabulation {
  width: $rightWidth;
  height: 94vh;
  overflow: hidden;
  border-radius: 20px;
  //border: 1px silver solid;
  transition: all .5s linear;
}
.h_con {
  width: $contentWidth;
  height: 94vh;
  margin: 0 10px;
  overflow: hidden;
  border-radius: 20px;
  transition: all .5s linear;
  //border: 1px silver solid;
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