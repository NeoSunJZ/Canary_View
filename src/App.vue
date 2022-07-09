<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
// import AntNavigation from "./components/TopNavigation.vue";

export default {
  name: "App",
  components: {
    // AntNavigation,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
