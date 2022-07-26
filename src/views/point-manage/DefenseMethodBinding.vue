<style scoped></style>

<template>
  <MainPageNavigation :selectedKeys="['5']" :openKeys="['sub1']">
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>节点管理</a-breadcrumb-item>
      <a-breadcrumb-item>防御方法绑定</a-breadcrumb-item>
    </template>
    <template v-slot:content>
      <p>防御方法绑定页面</p>
    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';

export default {
  name: 'DefenseMethodBinding',
  components: { MainPageNavigation },
  setup() {
    //
  },
};
</script>
