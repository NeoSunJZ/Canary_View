<style scoped lang="less">
.submenu {
  height: 50px;
}
</style>

<template>
  <MainPageNavigation :selectedKeys="['1']" :openKeys="['sub1']">
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>节点管理</a-breadcrumb-item>
      <a-breadcrumb-item>我的节点</a-breadcrumb-item>
    </template>
    <template v-slot:content>
      <p>我的节点页面</p>
    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';

export default {
  name: 'MyPoint',
  components: { MainPageNavigation },
  setup() {
    //
  },
};
</script>
