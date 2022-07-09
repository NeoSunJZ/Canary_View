<template>
  <div style="width: 256px">
    <a-button
      type="primary"
      style="margin-bottom: 16px"
      @click="toggleCollapsed"
    >
      <MenuUnfoldOutlined v-if="collapsed" />
      <MenuFoldOutlined v-else />
    </a-button>
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      theme="light"
      :inline-collapsed="collapsed"
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
        <a-menu-item key="6">测试任务构建</a-menu-item>
        <a-menu-item key="7">任务实时看板</a-menu-item>
        <a-menu-item key="8">结果分析</a-menu-item>
        <a-menu-item key="9">天梯榜</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub4">
        <template #icon>
          <AppstoreOutlined />
        </template>
        <template #title>模型测试</template>
        <a-menu-item key="6">测试任务构建</a-menu-item>
        <a-menu-item key="7">任务实时看板</a-menu-item>
        <a-menu-item key="8">结果分析</a-menu-item>
        <a-menu-item key="9">天梯榜</a-menu-item>
      </a-sub-menu>
      <a-menu-item key="10">
        <template #icon>
          <InboxOutlined />
        </template>
        <span>关于我们</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs, watch } from "vue";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
  InboxOutlined,
  AppstoreOutlined,
} from "@ant-design/icons-vue";
export default defineComponent({
  components: {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
    MailOutlined,
    InboxOutlined,
    AppstoreOutlined,
  },

  setup() {
    const state = reactive({
      collapsed: false,
      selectedKeys: ["1"],
      openKeys: ["sub1"],
      preOpenKeys: ["sub1"],
    });
    watch(
      () => state.openKeys,
      (_val, oldVal) => {
        state.preOpenKeys = oldVal;
      }
    );

    const toggleCollapsed = () => {
      state.collapsed = !state.collapsed;
      state.openKeys = state.collapsed ? [] : state.preOpenKeys;
    };

    return { ...toRefs(state), toggleCollapsed };
  },
});
</script>
