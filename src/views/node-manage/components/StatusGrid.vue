<!--
 * @FileDescription: MyNode界面中的表格中的状态栏组件，同时可以刷新状态
 * @Todo: 
 -->

<style lang="less" scoped>
@import '@/style.less';
.state {
  display: flex;
  flex-direction: row;
  &__stoppingtext {
    color: @red-6;
  }
  &__runningtext {
    color: @green-6;
  }
}
</style>


<template>
  <div class='state'>
    <div v-if="NodeStatus==='running'">
      <a-badge status="success" />
      <span class="state__runningtext">运行中</span>
    </div>
    <div v-else>
      <a-badge status="error" />
      <span class="state__stoppingtext">已断开</span>
    </div>
    <a-button type="link" size="small" shape="circle">
      <SyncOutlined @click="refresh" />
    </a-button>
  </div>

</template>

<script>
import { defineComponent, onBeforeMount, ref } from 'vue';
import { getDeclaration } from '@/api/framework-api/declaration';
import { SyncOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'StatusGrid',
  components: { SyncOutlined },
  emits: ['success'],
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
      let data = await getDeclaration(props.ip, props.port, null, false);
      if (data == null) {
        NodeStatus.value = 'stopping';
      } else {
        NodeStatus.value = 'running';
        context.emit('success', data);
      }
    };
    onBeforeMount(async () => {
      refresh();
    });
    return { NodeStatus, refresh };
  },
});
</script>