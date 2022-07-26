<style scoped lang="less">
.title {
  margin-bottom: 20px;
}
.server-card {
  height: 150px;
  width: 350px;
}
</style>

<template>
  <h2 class="title">服务资源列表</h2>
  <a-card class="server-card">
    123

  </a-card>
</template>

<script>
import { defineComponent, ref, computed, onBeforeMount } from 'vue';
import { DeploymentUnitOutlined, ClusterOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'ServerInfoCard',
  components: {
    DeploymentUnitOutlined,
    ClusterOutlined,
  },
  props: {
    serverName: String,
    serverIP: String,
    serverPort: Number,
  },
  setup(props, context) {
    return {
      //
    };
  },
});
</script>