<!--
 * @FileDescription: 主页中的服务器状态信息卡片，用于更换服务器节点和查看节点信息
 -->
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
            <!-- 对话框用于更换节点 -->
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
import { defineComponent, ref, computed, onBeforeMount } from 'vue';
import { getDeclaration } from '@/api/framework-api/declaration';
import { DeploymentUnitOutlined, ClusterOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'ServerPointCard',
  props: {
    //
  },
  setup(props, context) {
    const visible = ref(false); //控制对话框是否可见

    // 用于接受后端返回的服务器信息
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
    const selectedServerIndex = ref(0); //选中的服务器的索引
    const serverStatusFlag = ref(true); //选中的服务器是否运行的标志

    const serverStatus = computed(() => {
      if (serverStatusFlag.value) {
        return { text: '运行中', color: 'green' };
      } else {
        return { text: '已断开', color: 'red' };
      }
    });

    const showSelector = () => {
      /*
       * 点击更换节点后的操作
       * 1.显示对话框
       * 2.向后端请求节点信息
       * 3.放入data
       */
      visible.value = !visible.value;
      // todo 请求所有我的服务器节点信息,放到了data里
    };

    const handleOk = async () => {
      /*
       * 确认更换节点后的操作
       * 1.关闭对话框
       * 2.向对应节点请求声明
       * 3.根据返回值确认状态
       */
      visible.value = !visible.value;
      let declarationInfo = await getDeclaration(data[selectedServerIndex.value].ip, data[selectedServerIndex.value].port);
      if (declarationInfo == null) {
        serverStatusFlag.value = false;
      } else {
        serverStatusFlag.value = true;
      }
      context.emit('serverSelected', { serverInfo: data[selectedServerIndex.value], declarationInfo: declarationInfo });
    };

    onBeforeMount(async () => {
      /*
       * 每次渲染前对默认节点做请求声明
       */
      let declarationInfo = await getDeclaration(data[0].ip, data[0].port);
      if (declarationInfo == null) {
        serverStatusFlag.value = false;
      } else {
        serverStatusFlag.value = true;
      }
      context.emit('serverSelected', { serverInfo: data[0], declarationInfo: declarationInfo });
    });

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
