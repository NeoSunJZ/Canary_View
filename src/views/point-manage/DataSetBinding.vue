<style scoped></style>

<template>
  <MainPageNavigation :selectedKeys="['2']" :openKeys="['sub1']">
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>节点管理</a-breadcrumb-item>
      <a-breadcrumb-item>数据集绑定</a-breadcrumb-item>
    </template>
    <template v-slot:content>
      <p>数据集绑定页面</p>
    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';

export default {
  name: 'DataSetBinding',
  components: { MainPageNavigation },
  setup() {
    //
  },
};
</script>
