<style lang="less" scoped>
</style>


<template>

  <div v-if="NodeStatus==='running'">
    <a-badge status="success" text="运行中" />
    <a-button type="link" size="small" shape="circle">
      <SyncOutlined @click="refresh" />
    </a-button>
  </div>
  <div v-else>
    <a-badge status="error" text="已断开" />
    <a-button type="link" size="small" shape="circle">
      <SyncOutlined @click="refresh" />
    </a-button>
  </div>
</template>

<script>
import { defineComponent, onBeforeMount, ref } from 'vue';
import { getDeclarationOnly } from '@/api/framework-api/declaration';
import { SyncOutlined } from '@ant-design/icons-vue';
// import { notification } from 'ant-design-vue';
export default defineComponent({
  name: 'StatusGrid',
  components: { SyncOutlined },
  props: {
    ip: {
      type: String,
      default: '',
    },
    port: {
      type: Number,
      default: null,
    },
  },

  setup(props, context) {
    const NodeStatus = ref('running');
    const refresh = async () => {
      // 测试用，未完成
      let data = await getDeclarationOnly(props.ip, props.port);
      if (data == null) {
        NodeStatus.value = 'stopping';
      } else {
        NodeStatus.value = 'running';
      }
    };
    onBeforeMount(async () => {
      let data = await getDeclarationOnly(props.ip, props.port);
      if (data == null) {
        NodeStatus.value = 'stopping';
      } else {
        NodeStatus.value = 'running';
      }
    });
    return { NodeStatus, refresh };
  },
});
</script>