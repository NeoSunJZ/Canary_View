<style scoped lang="less"></style>

<template>
  <MainPageNavigation :selectedKeys="['4']" :openKeys="['sub1']">
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>节点管理</a-breadcrumb-item>
      <a-breadcrumb-item>攻击方法绑定</a-breadcrumb-item>
    </template>
    <template v-slot:content>
      <p>攻击方法绑定页面</p>
    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';

export default {
  name: 'AttackMethodBinding',
  components: { MainPageNavigation },
  setup() {
    //
  },
};
</script>
