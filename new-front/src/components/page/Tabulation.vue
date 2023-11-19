<script setup>
import User from '../children/User.vue'
import Friends from "../children/Friends.vue";
</script>

<template>
<div class="bg">
  <div class="container">
<!--    <User class="user"></User>-->
    <Friends></Friends>
  </div>
</div>
</template>

<style scoped lang="scss">
.container{
}
.user{
  width: 100%;
  height: 100%;
}
</style>