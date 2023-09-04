<script setup>
// import verList from "./verList1.vue";
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="[]">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
