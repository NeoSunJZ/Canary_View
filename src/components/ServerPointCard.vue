<style scoped lang="less">
@import '~ant-design-vue/dist/antd.less';
.server {
  height: 100%;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &__icon {
    font-size: 32px;
    color: @primary-color;
  }
  &__title {
    margin-left: 10px;
  }
  &__detail {
    margin-top: 5px;
  }
}
.ant-ribbon-wrapper {
  height: 100%;
}
</style>
<template>
  <a-col flex="0 1 300px">
    <a-badge-ribbon text="已断开" color="red">
      <a-card class="server" size="small">
        <div v-if="currentServerInfo == null">
          <p>请您新增服务节点</p>
        </div>
        <div v-else>
          <div>
            <cluster-outlined class="server__icon" /><span class="server__title">服务节点 - {{ currentServerInfo.appName }}</span>
          </div>
          <div>
            IP地址 - {{ currentServerInfo.ip }}
            <a-divider type="vertical" />
            端口 - {{ currentServerInfo.port }}
          </div>
          <div class="server__detail">
            <a>详情</a>
            <a-divider type="vertical" /><a @click="visible = !visible">切换节点</a>
            <a-modal v-model:visible="visible" @ok="handleOk">
              <a-select ref="select" v-model:value="selectedServerID" style="width: 120px" @focus="focus" @change="handleChange" :options="data"
                :fieldNames="{ label: 'appName', value: 'appID' }">
              </a-select>
            </a-modal>
          </div>
        </div>
      </a-card>
    </a-badge-ribbon>
  </a-col>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue';
import { DeploymentUnitOutlined, ClusterOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'ServerPointCard',
  props: {
    //
  },
  setup(props, context) {
    const selectedServerID = ref();
    const visible = ref(false);
    const data = [
      {
        appID: '1',
        appName: 'Server1',
        port: '8888',
        ip: '127.0.0.1',
      },
      {
        appID: '2',
        appName: 'Server2',
        port: '8888',
        ip: '127.0.0.2',
      },
    ];
    const currentServerInfo = ref();
    const handleOk = () => {
      data.forEach((element) => {
        if (element.appID == selectedServerID.value) {
          currentServerInfo.value = element;
        }
      });
      visible.value = false;
    };
    watch(currentServerInfo, (currentServerInfo) => {
      context.emit('serverSelected', currentServerInfo);
    });
    onMounted(() => {
      // todo:请求数据
      if (data.length > 0) {
        selectedServerID.value = data[0].appID;
        currentServerInfo.value = data[0];
      }
    });

    return {
      visible,
      data,
      selectedServerID,
      currentServerInfo,
      handleOk,
    };
  },
  components: {
    DeploymentUnitOutlined,
    ClusterOutlined,
  },
});
</script>
