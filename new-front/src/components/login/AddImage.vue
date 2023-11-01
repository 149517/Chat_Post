<script setup>
import {ref} from "vue";

const fileList = ref([
  {
    id:1,
    url:""
  }
])
</script>

<template>
  <div class="container">
    <TransitionGroup name="im" tag="div">
      <div class="line" v-for="item in fileList" :key="item.id">

      </div>
      <div class="line">
        <img src="src/assets/icon/add.png" alt="">
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">

</style>