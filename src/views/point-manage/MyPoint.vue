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
      <ServerInfoTable :serverInfo="server1"></ServerInfoTable>
    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';
import ServerInfoTable from '@/components/ServerInfoTable.vue';
import { ref } from 'vue';
export default {
  name: 'MyPoint',
  components: { MainPageNavigation, ServerInfoTable },
  setup() {
    const server1 = ref({ name: 'Server1', ip: '10.0.0.55', port: '8888' });
    //
    return {
      server1,
    };
  },
};
</script>
