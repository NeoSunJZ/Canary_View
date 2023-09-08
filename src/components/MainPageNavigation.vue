<!--
 * @FileDescription: 主页的导航栏组件，包含一个头部导航和一个侧边栏
 -->

<style scoped lang="less">
@import '~ant-design-vue/dist/antd.less';
@import '@/style.less';

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
    background-color: @primary-color;
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
        <a-button type="text" size="large" @click="toggleCollapsed" class="layout__collapse_button">
          <MenuUnfoldOutlined v-if="collapsed" />
          <MenuFoldOutlined v-else />
        </a-button>
      </div>

      <a-menu mode="horizontal">
        <a-menu-item key="1">关于系统</a-menu-item>
      </a-menu>
    </a-layout-header>

    <a-layout>
      <!-- 侧边栏，主要包括一个导航栏 -->
      <a-layout-sider width="200" v-model:collapsed="collapsed" class="layout__menu">
        <a-menu :openKeys="openKeys" :selectedKeys="selectedKeys" mode="inline" theme="light">
          <a-sub-menu key="sub1">
            <template #icon>
              <ClusterOutlined />
            </template>
            <template #title>节点管理</template>
            <a-menu-item key="1" @click="toPage('MyNode')">
              <template #icon>
                <DesktopOutlined />
              </template>
              我的节点
            </a-menu-item>
            <a-menu-item key="2" @click="toPage('DataSetBinding')">
              <template #icon>
                <DatabaseOutlined />
              </template>
              数据集绑定
            </a-menu-item>
            <a-menu-item key="3" @click="toPage('ModelBinding')">
              <template #icon>
                <DeploymentUnitOutlined />
              </template>
              模型绑定
            </a-menu-item>
            <a-menu-item key="4" @click="toPage('AttackMethodBinding')">
              <template #icon>
                <AimOutlined />
              </template>
              攻击方法绑定
            </a-menu-item>
            <a-menu-item key="5" @click="toPage('DefenseMethodBinding')">
              <template #icon>
                <SecurityScanOutlined />
              </template>
              防御方法绑定
            </a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="sub2">
            <template #icon>
              <ExperimentOutlined />
            </template>
            <template #title>测试任务管理</template>
            <a-menu-item key="6" @click="toPage('TestTaskConstruction/AttackTest')">
              <template #icon>
                <AppstoreAddOutlined />
              </template>
              测试任务构建
            </a-menu-item>
            <a-menu-item key="11" @click="toPage('QuickConstruction')">
              <template #icon>
                <AppstoreOutlined />
              </template>
              快速构建测试任务
            </a-menu-item>
            <a-menu-item key="7" @click="toPage('TaskRealtimeBoard')">
              <template #icon>
                <CalendarOutlined />
              </template>
              任务实时看板
            </a-menu-item>
            <a-menu-item key="8" @click="toPage('ResultAnalysisBoard')">
              <template #icon>
                <FundOutlined />
              </template>
              结果分析
            </a-menu-item>
            <a-menu-item key="9" @click="toPage('RankingList')">
              <template #icon>
                <RocketOutlined />
              </template>
              天梯榜
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item key="10">
            <template #icon>
              <QuestionCircleOutlined />
            </template>
            <span>关于我们</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <!-- 中间的面包屑和内容板块使用slot插槽 -->
      <a-layout class="layout__content">
        <slot name="submenu"></slot>
        <a-breadcrumb class="layout__content__breadcrumb">
          <slot name="breadcrumb"></slot>
        </a-breadcrumb>
        <a-card class="layout__content__card">
          <slot name="content"></slot>
        </a-card>
        <!-- 版权等脚标 -->
        <GlobalFooter :links="links" :copyright="copyright" />
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import router from '@/router';
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
  AppstoreOutlined,
} from '@ant-design/icons-vue';
import { defineComponent, ref, toRefs, reactive, onBeforeMount } from 'vue';

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
    AppstoreOutlined,
  },
  props: {
    openKeys: Array, //控制侧边栏中哪些父菜单打开
    selectedKeys: Array, //控制选中哪个子菜单
  },
  setup(props, context) {
    const state = reactive({
      collapsed: false, //侧边栏是否折叠
    });
    const toggleCollapsed = () => {
      state.collapsed = !state.collapsed;
      sessionStorage.setItem('collapsed', state.collapsed);
    };
    const toPage = (page) => {
      router.push({ path: '/' + page });
    };
    const links = ref([
      {
        key: '帮助',
        title: '帮助',
        href: '',
        blankTarget: true,
      },
      {
        key: 'github',
        icon: 'logo-github',
        href: '',
        blankTarget: true,
      },
      {
        key: '条款',
        title: '条款',
        href: '',
        blankTarget: true,
      },
    ]);
    const copyright = ref('Copyright © 2022 BIT All Rights Reserved');
    onBeforeMount(() => {
      // 用于管理侧边栏折叠状态
      if (sessionStorage.getItem('collapsed') == 'true') {
        state.collapsed = true;
      } else state.collapsed = false;
    });
    return {
      links,
      copyright,
      selectedKeys1: ref([]),
      collapsed: ref(false),
      toggleCollapsed,
      toPage,
      ...toRefs(state),
    };
  },
});
</script>
