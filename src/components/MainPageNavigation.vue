<template>
  <a-layout>
    <!-- 头部，包含一个logo，一个按钮和一个导航菜单 -->
    <a-layout-header
      class="header"
      :style="{ position: 'fixed', zIndex: 1, width: '100%', height: '60px' }"
    >
      <img
        src="@/assets/CanaryLogo.png"
        width="100"
        height="40"
        class="CanaryLogo"
      />
      <a-button type="link" size="large" ghost="true" @click="toggleCollapsed">
        <MenuUnfoldOutlined v-if="collapsed" />
        <MenuFoldOutlined v-else />
      </a-button>
      <a-menu
        v-model:selectedKeys="selectedKeys1"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '50px', margin: '20px' }"
      >
        <a-menu-item key="1">nav 1</a-menu-item>
        <a-menu-item key="2">nav 2</a-menu-item>
        <a-menu-item key="3">nav 3</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout>
      <!-- 侧边栏，主要包括一个导航栏 -->
      <a-layout-sider
        width="200"
        v-model:collapsed="collapsed"
        style="background: #fff; min-height: 100vh"
      >
        <a-menu
          :openKeys="openKeys"
          :selectedKeys="selectedKeys"
          mode="inline"
          theme="light"
        >
          <a-sub-menu key="sub1">
            <template #icon>
              <MailOutlined />
            </template>
            <template #title>节点管理</template>
            <a-menu-item key="1">我的节点</a-menu-item>
            <a-menu-item key="2">数据集绑定</a-menu-item>
            <a-menu-item key="3">模型绑定</a-menu-item>
            <a-menu-item key="4">攻击方法绑定</a-menu-item>
            <a-menu-item key="5">防御方法绑定</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <template #icon>
              <PieChartOutlined />
            </template>
            <template #title>防御测试</template>
            <a-menu-item key="6">测试任务构建</a-menu-item>
            <a-menu-item key="7">任务实时看板</a-menu-item>
            <a-menu-item key="8">结果分析</a-menu-item>
            <a-menu-item key="9">天梯榜</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <template #icon>
              <PieChartOutlined />
            </template>
            <template #title>攻击测试</template>
            <a-menu-item key="10">测试任务构建</a-menu-item>
            <a-menu-item key="11">任务实时看板</a-menu-item>
            <a-menu-item key="12">结果分析</a-menu-item>
            <a-menu-item key="13">天梯榜</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub4">
            <template #icon>
              <AppstoreOutlined />
            </template>
            <template #title>模型测试</template>
            <a-menu-item key="14">测试任务构建</a-menu-item>
            <a-menu-item key="15">任务实时看板</a-menu-item>
            <a-menu-item key="16">结果分析</a-menu-item>
            <a-menu-item key="17">天梯榜</a-menu-item>
          </a-sub-menu>
          <a-menu-item key="18">
            <template #icon>
              <InboxOutlined />
            </template>
            <span>关于我们</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <!-- 中间的面包屑和内容板块 -->
      <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
          <slot name="breadcrumb"></slot>
        </a-breadcrumb>
        <a-layout-content
          :style="{
            background: '#fff',
            padding: '24px',
            margin: 0,
            minHeight: '280px',
          }"
        >
          <slot name="content"></slot>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
  InboxOutlined,
  AppstoreOutlined,
} from "@ant-design/icons-vue";
import { defineComponent, ref, toRefs, reactive } from "vue";

export default defineComponent({
  components: {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
    MailOutlined,
    InboxOutlined,
    AppstoreOutlined,
  },
  props: {
    openKeys: Array,
    selectedKeys: Array,
  },
  setup() {
    const state = reactive({
      collapsed: false,
    });
    const toggleCollapsed = () => {
      state.collapsed = !state.collapsed;
    };
    return {
      selectedKeys1: ref([]),
      collapsed: ref(false),
      toggleCollapsed,
      ...toRefs(state),
    };
  },
});
</script>

<style>
.header {
  margin-top: -60px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.CanaryLogo {
  margin-left: -30px;
  margin-right: 20px;
  margin-top: 5px;
}
.site-layout-background {
  background: #fff;
}
</style>
