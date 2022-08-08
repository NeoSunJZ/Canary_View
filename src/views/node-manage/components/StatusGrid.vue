<style lang="less" scoped>
.state {
  display: flex;
  flex-direction: row;
  align-items: center;
  // justify-content: space-around;
  &__greenpoint {
    display: inline-block;
    height: 5px;
    width: 5px;
    border-radius: 16px;
    color: #fff;
    background: rgb(119, 228, 119);
    margin-right: 3px;
  }
  &__redpoint {
    display: inline-block;
    height: 5px;
    width: 5px;
    border-radius: 16px;
    color: #fff;
    background: rgb(175, 2, 2);
    margin-right: 3px;
  }
  &__running {
    margin-right: 10px;
    color: rgb(8, 179, 8);
  }
  &__stopping {
    margin-right: 10px;
    color: rgb(237, 6, 6);
  }
}
</style>


<template>
  <div v-if="NodeStatus==='running'">
    <div class="state">
      <div class='state__greenpoint'></div>
      <p class="state__running">运行中</p>
      <a-button type="link" size="small" shape="circle">
        <SyncOutlined @click="refresh" />
      </a-button>
    </div>
  </div>
  <div v-else>
    <div class="state">
      <div class='state__redpoint'></div>
      <p class="state__stopping">已断开</p>
      <a-button type="link" size="small" shape="circle">
        <SyncOutlined @click="refresh" />
      </a-button>

    </div>
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
        NodeStatus.value = 'running';
      } else {
        NodeStatus.value = 'stopping';
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