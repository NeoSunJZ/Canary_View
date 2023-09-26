<style scoped lang="less"> @import "../Screen.less";
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
    <p class="text-muted">IP {{ nodeInfo.currentHost }}<a-divider type="vertical" /> 端口 {{ nodeInfo.currentPort }}
      <a-divider type="vertical" /> 状态
      <a-tag class="tag tag--green" v-if="nodeInfo.isonline == 'running'">就绪</a-tag>
      <a-tag class="tag tag--red" v-else>未就绪</a-tag>
    </p>
  </a-card>
</template>


<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
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
      } else {
        NodeStatus.value = 'running';
      }
    };
    const currentOnlineNum = ref(0);
    const currentServerNum = ref(0);
    const waitFlag = ref(true)
    onMounted(async () => {
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
            nodeInfo.value['currentHost'] = element['host'];
            nodeInfo.value['currentPort'] = element['port'];
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