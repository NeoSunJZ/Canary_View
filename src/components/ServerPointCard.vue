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
    &__modal {
      &__select {
        width: 100%;
      }
    }
  }
}
.ant-ribbon-wrapper {
  height: 100%;
}
</style>
<template>
  <a-col flex="0 1 300px">
    <a-badge-ribbon :text="serverStatus.text" :color="serverStatus.color">
      <a-card class="server" size="small">
        <div v-if="data.length == 0">
          <p>请您新增服务节点</p>
        </div>
        <div v-else>
          <div>
            <cluster-outlined class="server__icon" /><span class="server__title">服务节点 - {{ data[selectedServerIndex].appName }}</span>
          </div>
          <div>
            IP地址 - {{ data[selectedServerIndex].ip }}
            <a-divider type="vertical" />
            端口 - {{ data[selectedServerIndex].port }}
          </div>
          <div class="server__detail">
            <a>详情</a>
            <a-divider type="vertical" /><a @click="showSelector">切换节点</a>
            <a-modal v-model:visible="visible" @ok="handleOk" :closable='false'>
              <a-select ref="select" v-model:value="selectedServerIndex" class="server__detail__modal__select" @focus="focus">
                <a-select-option v-for="(item,index) in data" :value="index" :key="index">
                  {{item.appName+' '+item.ip+ ' '+item.port}}
                </a-select-option>
              </a-select>
            </a-modal>
          </div>
        </div>
      </a-card>
    </a-badge-ribbon>
  </a-col>
</template>

<script>
import { defineComponent, ref, onMounted, watch, computed } from 'vue';
import { DeploymentUnitOutlined, ClusterOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'ServerPointCard',
  props: {
    //
  },
  setup(props, context) {
    const visible = ref(false);
    const data = [
      {
        appID: '1',
        appName: 'Server 1',
        port: '8888',
        ip: '127.0.0.1',
        appDesc: '默认服务描述',
        appStatus: 'Running',
        createTime: '2022-01-02 13:40:20',
        createUser: 'admin',
        isDisabled: 'false',
      },
      {
        appID: '2',
        appName: 'Server 2',
        port: '8888',
        ip: '127.0.0.2',
        appDesc: 'Alpha测试',
        appStatus: 'Stop',
        createTime: '2022-01-01 10:41:20',
        createUser: 'admin',
        isDisabled: 'false',
      },
      {
        appID: '3',
        appName: 'Server 3',
        port: '8888',
        ip: '128.0.0.2',
        appDesc: 'Beta测试',
        appStatus: 'Running',
        createTime: '2021-01-01 10:41:20',
        createUser: 'admin',
        isDisabled: 'false',
      },
    ];
    const selectedServerIndex = ref(0);
    const serverStatusFlag = ref(true);
    const serverStatus = computed(() => {
      if (serverStatusFlag.value) {
        return { text: '运行中', color: 'green' };
      } else {
        return { text: '已断开', color: 'red' };
      }
    });

    const showSelector = () => {
      visible.value = !visible.value;
      // todo 请求所有我的服务器节点信息,放到了data里
    };
    const handleOk = () => {
      visible.value = !visible.value;
      context.emit('serverSelected', data[selectedServerIndex]);
    };

    return {
      visible,
      data,
      serverStatus,
      serverStatusFlag,
      selectedServerIndex,
      handleOk,
      showSelector,
    };
  },
  components: {
    DeploymentUnitOutlined,
    ClusterOutlined,
  },
});
</script>
