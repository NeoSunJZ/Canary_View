<style scoped lang="less">
.layout {
  height: 100vh;
  &__menu {
    background-color: white;
  }
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }
  &__collapse_button {
    margin-left: 60px;
    color: white;
  }
  &__content {
    overflow-y: scroll;
    &__breadcrumb {
      margin: 16px 24px;
    }
    &__card {
      margin: 0px 24px;
    }
  }
}
</style>
<template>
  <a-layout class="layout">
    <!-- 头部，包含一个logo，一个按钮和一个导航菜单 -->
    <a-layout-header class="layout__header">
      <div>
        <img src="@/assets/image/logo/logo.png" height="50" />
        <a-button
          type="text"
          size="large"
          @click="toggleCollapsed"
          class="layout__collapse_button"
        >
          <MenuUnfoldOutlined v-if="collapsed" />
          <MenuFoldOutlined v-else />
        </a-button>
      </div>

      <a-menu theme="dark" mode="horizontal">
        <a-menu-item key="1">关于我们</a-menu-item>
        <a-menu-item key="2">nav 2</a-menu-item>
        <a-menu-item key="3">nav 3</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout>
      <!-- 侧边栏，主要包括一个导航栏 -->
      <a-layout-sider
        width="200"
        v-model:collapsed="collapsed"
        class="layout__menu"
      >
        <a-menu
          :openKeys="openKeys"
          :selectedKeys="selectedKeys"
          mode="inline"
          theme="light"
        >
          <a-sub-menu key="sub1">
            <template #icon>
              <ClusterOutlined />
            </template>
            <template #title>节点管理</template>
            <a-menu-item key="1" @click="toPage('MyPoint')">
              <template #icon><DesktopOutlined /></template>
              我的节点</a-menu-item
            >
            <a-menu-item key="2" @click="toPage('DataSetBinding')">
              <template #icon><DatabaseOutlined /></template>

              数据集绑定</a-menu-item
            >
            <a-menu-item key="3" @click="toPage('ModelBinding')">
              <template #icon> <DeploymentUnitOutlined /></template>

              模型绑定</a-menu-item
            >
            <a-menu-item key="4" @click="toPage('AttackMethodBinding')">
              <template #icon><AimOutlined /></template>
              攻击方法绑定</a-menu-item
            >
            <a-menu-item key="5" @click="toPage('DefenseMethodBinding')">
              <template #icon><SecurityScanOutlined /></template>

              防御方法绑定</a-menu-item
            >
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <template #icon>
              <ExperimentOutlined />
            </template>
            <template #title>测试任务管理</template>
            <a-menu-item key="6">
              <template #icon><AppstoreAddOutlined /></template>
              测试任务构建
            </a-menu-item>
            <a-menu-item key="7">
              <template #icon><CalendarOutlined /></template>
              任务实时看板</a-menu-item
            >
            <a-menu-item key="8">
              <template #icon><FundOutlined /></template>
              结果分析</a-menu-item
            >
            <a-menu-item key="9">
              <template #icon><RocketOutlined /></template>

              天梯榜</a-menu-item
            >
          </a-sub-menu>
          <a-menu-item key="10">
            <template #icon>
              <QuestionCircleOutlined />
            </template>
            <span>关于我们</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <!-- 中间的面包屑和内容板块 -->
      <a-layout class="layout__content">
        <slot name="submenu"></slot>
        <a-breadcrumb class="layout__content__breadcrumb">
          <slot name="breadcrumb"></slot>
        </a-breadcrumb>
        <a-card class="layout__content__card">
          <slot name="content"></slot>
        </a-card>
        <GlobalFooter :links="links" :copyright="copyright" />
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ClusterOutlined,
  DesktopOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  AimOutlined,
  SecurityScanOutlined,
  ExperimentOutlined,
  AppstoreAddOutlined,
  CalendarOutlined,
  FundOutlined,
  RocketOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons-vue";
import { defineComponent, ref, toRefs, reactive } from "vue";

export default defineComponent({
  components: {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ClusterOutlined,
    DesktopOutlined,
    DatabaseOutlined,
    DeploymentUnitOutlined,
    AimOutlined,
    SecurityScanOutlined,
    ExperimentOutlined,
    AppstoreAddOutlined,
    CalendarOutlined,
    FundOutlined,
    RocketOutlined,
    QuestionCircleOutlined,
  },
  props: {
    openKeys: Array,
    selectedKeys: Array,
  },
  data() {
    return {
      links: [
        {
          key: "帮助",
          title: "帮助",
          href: "",
          blankTarget: true,
        },
        {
          key: "github",
          icon: "logo-github",
          href: "",
          blankTarget: true,
        },
        {
          key: "条款",
          title: "条款",
          href: "",
          blankTarget: true,
        },
      ],
      copyright: "Copyright © 2022 BIT All Rights Reserved",
    };
  },
  methods: {
    toPage(page) {
      this.$router.push({ path: "/" + page });
    },
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
