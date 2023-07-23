<style scoped lang="less">
.ant-layout {
  background: #25293c;
}

.ant-layout-header {
  background-color: rgba(47, 51, 73, 0.95);
  box-shadow: 0 1px 0 #434968;
}

/deep/ .ant-card-bordered {
  border: unset;
  box-shadow: 0 0.25rem 1.25rem rgba(15, 20, 34, 0.4);
  border-radius: 0.375rem;
  background-clip: padding-box;
  background-color: unset;
}

/deep/ .ant-card-body {
  padding: 16px;
  border-radius: 0.375rem;
  background-color: #2f3349e5;
  border: 0 solid #434968;
}

.ant-divider {
  border-left: 1px solid #7983bb;
}
</style>
<style scoped>
.text {
  margin-top: 0;
  font-weight: 500;
  color: #cfd3ec;
  line-height: unset;
}

.text-muted {
  color: #7983bb !important;
  line-height: unset;
}
</style>
<style scoped lang="less">
.tag {
  border: unset;
  border-radius: 0.375rem !important;

  &__text {
    color: #b6bee3;
  }

  &--green {
    color: #28c76f;
    background-color: #2e4b4f;
  }

  &--purple {
    color: #7367f0;
    background-color: #3a3b64;
  }

  &--cyan {
    color: #00cfe8;
    background-color: #274c62;
  }

  &--red {
    color: #ea5455;
    background-color: #4d384b;
  }

  &--orange {
    color: #ff9f43;
    background-color: #504448;
  }
}
</style>
<style lang="less" scoped>
/deep/ .console {
  &__log-info {
    background-color: #25293c;
  }

  &__log-area {
    border-color: #434968;
  }

  &__log {
    color: #cfd3ec;
  }
}
</style>
<style lang="less" scoped>
.logo {
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 30%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  opacity: 0.4;
}
</style>


<template>
  <a-card style="margin:10px">
    <p class="text-muted">节点状态</p>
    <p style="font-size:20px" class="text">{{ currentOnlineNum }} 在线 / {{ currentServerNum }} 节点</p>
    <br />

    <p class="tag__text" style="font-size: 18px">
      <a-button class="tag tag--purple" type="primary">
        <template #icon>
          <ClusterOutlined />
        </template>
      </a-button> 当前服务器
    </p>
    <p style="font-size:18px" class="text">{{ nodeInfo.currentServer }}</p>
    <p class="text-muted">Ip {{ nodeInfo.currentHost }}<a-divider type="vertical" /> 端口 {{ nodeInfo.currentPort }}
      <a-divider type="vertical" /> 状态
      <a-tag class="tag tag--green" v-if="nodeInfo.isonline == 'running'">就绪</a-tag>
      <a-tag class="tag tag--red" v-else>未就绪</a-tag>
    </p>
  </a-card>
</template>


<script>
import { defineComponent, ref, onBeforeMount, computed } from 'vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';
import { ClusterOutlined } from '@ant-design/icons-vue';
import io from 'socket.io-client';
const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4168693_xvx31sr2sl8.js', // 在 iconfont.cn 上生成
});
import { getNodeInfo } from '@/api/node-api/nodeinfo';
import { getDeclaration } from '@/api/framework-api/declaration';
import { async } from '@antv/x6/lib/registry/marker/async';

export default defineComponent({
  name: 'ServerNodeStatus',
  components: {
    MyIcon,
    ClusterOutlined,
  },
  props: {
  },
  setup(props) {
    const node = ref([]);
    const nodeInfo = ref({
      currentServer: null,
      currentHost: null,
      currentPort: null,
      isonline: 'stopping',
    })
    const NodeStatus = ref('null');
    const refresh = async (host, port) => {
      let data = await getDeclaration(host, port, null, false);
      if (data == null) {
        NodeStatus.value = 'stopping';
      }
      else {
        NodeStatus.value = 'running';
      }
    };
    const currentOnlineNum = ref(0);
    const currentServerNum = ref(0);
    const waitFlag = ref(true)
    onBeforeMount(async () => {
      node.value = await getNodeInfo(1, 10);

      if (node.value.length > 0) {
        currentServerNum.value = computed(() => node.value.length)
        nodeInfo.value['currentServer'] = node.value[0]['nodeName'];
        nodeInfo.value['currentHost'] = node.value[0]['host'];
        nodeInfo.value['currentPort'] = node.value[0]['port'];

        node.value.forEach(async (element) => {
          if (waitFlag.value)
            await refresh(element.host, element.port);
          if (NodeStatus.value == 'running') {
            waitFlag.value = false;
            nodeInfo.value['currentServer'] = element['nodeName'];
            nodeInfo.value['currentServer'] = element['host'];
            nodeInfo.value['currentServer'] = element['port'];
            nodeInfo.value['isonline'] = NodeStatus.value;
            currentOnlineNum.value++;
          }
        });
      }
    });
    return {
      nodeInfo,
      currentServerNum,
      currentOnlineNum,
    };
  },
});
</script>