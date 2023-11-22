<template>
  <div class="container">
    <component :is="currentPage" @newPage="getPage"></component>
    <!--    <Person></Person>-->
  </div>
</template>

<script setup>
import Person from '../small/Info.vue'
import UserHead from "../small/UserHead.vue";
import {ref} from "vue";

const pages = {
  Person,
  UserHead,
};

let currentPage = ref(Person)
const getPage = (pageName) => {
  currentPage.value = pages[pageName] || Person;
};

</script>


<style scoped lang="scss">
.container {
  height: 100vh;
  padding: 20px 0;
  border: 1px solid;
  border-color: transparent silver transparent silver;
}
</style>