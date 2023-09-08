<!--
 * @FileDescription: 主页中的服务器状态信息卡片，用于更换服务器节点和查看节点信息
 -->
<style scoped lang="less">
@import '~ant-design-vue/dist/antd.less';
@import '@/style.less';

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
            <cluster-outlined class="server__icon" /><span class="server__title">服务节点 - {{
              data[selectedServerIndex].nodeName }}</span>
          </div>
          <div>
            IP地址 - {{ data[selectedServerIndex].host }}
            <a-divider type="vertical" />
            端口 - {{ data[selectedServerIndex].port }}
          </div>
          <div class="server__detail">
            <a>详情</a>
            <a-divider type="vertical" /><a @click="showSelector">切换节点</a>
            <!-- 对话框用于更换节点 -->
            <a-modal v-model:visible="visible" @ok="handleOk" :closable='false'>
              <a-select ref="select" v-model:value="newServerIndex" class="server__detail__modal__select" @focus="focus">
                <a-select-option v-for="(item, index) in data" :value="index" :key="index">
                  {{ item.nodeName + ' ' + item.host + ' ' + item.port }}
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
import { defineComponent, ref, computed, onBeforeMount } from 'vue';
import { getDeclaration } from '@/api/framework-api/declaration';
import { getNodeInfo } from '@/api/node-api/nodeinfo';
import { DeploymentUnitOutlined, ClusterOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'ServerNodeCard',
  props: {
    //
  },
  setup(props, context) {
    const visible = ref(false); //控制对话框是否可见
    const data = ref([]); // 用于接受后端返回的服务器信息
    const selectedServerIndex = ref(0); //选中的服务器的索引

    const newServerIndex = ref(0);

    const serverStatusFlag = ref(true); //选中的服务器是否运行的标志

    const serverStatus = computed(() => {
      if (serverStatusFlag.value) {
        return { text: '运行中', color: 'green' };
      } else {
        return { text: '已断开', color: 'red' };
      }
    });

    const showSelector = () => {
      visible.value = !visible.value;
    };

    const serverSelected = async (host, port) => {
      let declarationInfo = await getDeclaration(host, port);
      if (declarationInfo == null) {
        serverStatusFlag.value = false;
      } else {
        context.emit('serverSelected', { serverInfo: data.value[selectedServerIndex.value], declarationInfo: declarationInfo });
        serverStatusFlag.value = true;
      }
    };

    const handleOk = async () => {
      visible.value = !visible.value;
      selectedServerIndex.value = newServerIndex.value;

      console.log(newServerIndex.value);

      await serverSelected(data.value[selectedServerIndex.value].host, data.value[selectedServerIndex.value].port);
    };

    onBeforeMount(async () => {
      /*
       * 每次渲染前对默认节点做请求声明
       */
      const newData = await getNodeInfo(1, 10);
      newData.forEach((element, index) => {
        data.value[index] = {
          nodeID: element.nodeID,
          index: index + 1,
          nodeName: element.nodeName,
          host: element.host,
          port: element.port,
          nodeDesc: element.nodeDesc,
          createTime: element.createTime,
          status: 'unknown',
        };
      });
      await serverSelected(data.value[0].host, data.value[0].port);
    });

    return {
      visible,
      data,
      serverStatus,
      serverStatusFlag,
      selectedServerIndex,
      newServerIndex,
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
