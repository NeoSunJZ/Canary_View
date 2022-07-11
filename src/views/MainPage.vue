<template>
  <MainPageNavigation :selectedKeys="['1']" :openKeys="['sub1']">
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>Home</a-breadcrumb-item>
      <a-breadcrumb-item>List</a-breadcrumb-item>
      <a-breadcrumb-item>App</a-breadcrumb-item>
    </template>
    <template v-slot:content>hello world! </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from "@/components/MainPageNavigation.vue";

export default {
  name: "MainPage",
  data() {
    return {
      //
    };
  },
  methods: {
    //
  },
  components: { MainPageNavigation },
};
</script>
