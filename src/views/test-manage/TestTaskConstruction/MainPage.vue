<style scoped lang="less">
.submenu {
  height: 50px;
}
</style>

<template>
  <MainPageNavigation :selectedKeys="['6']" :openKeys="['sub2']">
    <template v-slot:submenu>
      <a-menu v-model:selectedKeys="current" mode="horizontal" class="submenu">
        <a-menu-item key="defenseTest">
          <template #icon>
            <mail-outlined />
          </template>
          防御测试
        </a-menu-item>
        <a-menu-item key="attackTest">
          <template #icon>
            <mail-outlined />
          </template>
          攻击测试
        </a-menu-item>
        <a-menu-item key="attackTest">
          <template #icon>
            <mail-outlined />
          </template>
          模型测试
        </a-menu-item>
      </a-menu>
    </template>
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>测试任务管理</a-breadcrumb-item>
      <a-breadcrumb-item>测试任务构建</a-breadcrumb-item>
      <a-breadcrumb-item>App</a-breadcrumb-item>
    </template>
    <template v-slot:content>
      <p>测试任务构建页面</p>

    </template>
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
