<style scoped lang="less">
.submenu {
  height: 50px;
}
</style>

<template>
  <MainPageNavigation :selectedKeys="['9']" :openKeys="['sub2']">
    
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>测试任务管理</a-breadcrumb-item>
      <a-breadcrumb-item>天梯榜</a-breadcrumb-item>
      <a-breadcrumb-item>天梯榜</a-breadcrumb-item>
    </template>
    <template v-slot:content>
      <h2 class="attack-task__title">天梯榜</h2>
      <a-alert message="现版本暂未开放，请等待版本更新！" type="error" show-icon />
    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';

export default {
  name: 'RankingList',
  components: { MainPageNavigation },
  setup() {
    //
  },
};
</script>
