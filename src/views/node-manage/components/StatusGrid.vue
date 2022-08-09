<style lang="less" scoped>
.state {
  display: flex;
  flex-direction: row;
}
</style>


<template>
  <div class='state'>
    <div v-if="NodeStatus==='running'">
      <a-badge status="success" text="运行中" />
    </div>
    <div v-else>
      <a-badge status="error" text="已断开" />
    </div>
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
      let data = await getDeclarationOnly(props.ip, props.port);
      if (data == null) {
        NodeStatus.value = 'stopping';
      } else {
        NodeStatus.value = 'running';
      }
    };
    onBeforeMount(async () => {
      refresh();
    });
    return { NodeStatus, refresh };
  },
});
</script>