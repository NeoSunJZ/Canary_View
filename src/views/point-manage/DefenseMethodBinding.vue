<style scoped></style>

<template>
  <MainPageNavigation :selectedKeys="['5']" :openKeys="['sub1']">
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>Home</a-breadcrumb-item>
      <a-breadcrumb-item>List</a-breadcrumb-item>
      <a-breadcrumb-item>App</a-breadcrumb-item>
    </template>
    <template v-slot:content>
      <p>防御方法绑定页面</p>
    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from "@/components/MainPageNavigation.vue";

export default {
  name: "DefenseMethodBinding",
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
