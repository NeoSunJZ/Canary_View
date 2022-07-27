<style scoped></style>

<template>
  <MainPageNavigation :selectedKeys="['3']" :openKeys="['sub1']">
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>节点管理</a-breadcrumb-item>
      <a-breadcrumb-item>模型绑定</a-breadcrumb-item>
    </template>
    <template v-slot:content>
      <p>模型绑定页面</p>
    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';

export default {
  name: 'ModelBinding',
  components: { MainPageNavigation },
  setup() {
    //
  },
};
</script>
