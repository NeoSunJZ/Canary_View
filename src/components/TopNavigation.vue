<style scoped>
.TopNavigationStyle {
  position: fixed;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 1;
}
.CanaryIcon {
  margin-left: 10px;
  margin-right: 20px;
}
</style>

<!-- 这个是头部导航栏，直接用的Ant的组件，后续可改成个人信息 -->
<!-- 采用一个固定的卡片包裹着图片、按钮、导航栏的结构，卡片修改了budyStyle使 padding = 0 -->
<template>
  <a-card class="TopNavigationStyle" :bodyStyle="{ padding: '0' }">
    <div style="display: flex; align-items: center">
      <img
        src="@/assets/CanaryTest.png"
        width="80"
        height="30"
        class="CanaryIcon"
      />
      <a-button type="text" size="large" @click="sendState">
        <MenuUnfoldOutlined v-if="collapsed" />
        <MenuFoldOutlined v-else />
      </a-button>
      <a-menu
        v-model:selectedKeys="current"
        mode="horizontal"
        style="height: 50px; margin-top: 9px; width: 100%"
      >
        <a-menu-item key="mail">
          <template #icon>
            <mail-outlined />
          </template>
          Navigation One
        </a-menu-item>
        <a-menu-item key="app" disabled>
          <template #icon>
            <appstore-outlined />
          </template>
          Navigation Two
        </a-menu-item>
        <a-sub-menu key="sub1">
          <template #icon>
            <setting-outlined />
          </template>
          <template #title>Navigation Three - Submenu</template>
          <a-menu-item-group title="Item 1">
            <a-menu-item key="setting:1">Option 1</a-menu-item>
            <a-menu-item key="setting:2">Option 2</a-menu-item>
          </a-menu-item-group>
          <a-menu-item-group title="Item 2">
            <a-menu-item key="setting:3">Option 3</a-menu-item>
            <a-menu-item key="setting:4">Option 4</a-menu-item>
          </a-menu-item-group>
        </a-sub-menu>
        <a-menu-item> Navigation Four </a-menu-item>
      </a-menu>
    </div>
  </a-card>
</template>

<script>
import { defineComponent, ref, toRefs, reactive } from "vue";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";

export default defineComponent({
  components: {
    MailOutlined,
    AppstoreOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  },
  setup(props, context) {
    const current = ref(["mail"]);
    const state = reactive({
      collapsed: false,
    });
    const sendState = () => {
      state.collapsed = !state.collapsed;
      context.emit("onClickButton", state.collapsed);
    };
    return {
      current,
      ...toRefs(state),
      sendState,
    };
  },
});
</script>
