<style scoped lang="less">
@import '~ant-design-vue/dist/antd.less';
/deep/ .log-color {
  &--green {
    color: rgb(100, 127, 0);
    font-weight: bold;
  }
  &--pick {
    color: #f27b9b;
  }
  &--orange {
    color: #eb7132;
  }
}
.console {
  &__log-info {
    background-color: #eee;
    padding: 5px 10px;
  }
  &__log-area {
    overflow-y: scroll;
    max-height: 400px;
    border-style: solid;
    border-width: 1px;
    border-color: #eee;
    padding: 5px 10px;
  }
  &__type-icon {
    &--error {
      color: @error-color;
    }
    &--info {
      color: @primary-color;
    }
    &--warning {
      color: @warning-color;
    }
    &--success {
      color: @success-color;
    }
  }
}
</style>

<template>
  <div>
    <h3>
      <CodeOutlined /> 实时日志
    </h3>
    <div class="console__log-info">
      <a-tag color="success" v-if="connect == 'success'">
        <template #icon>
          <LinkOutlined />
        </template>
        已连接
      </a-tag>
      <a-tag color="processing" v-if="connect == 'processing'">
        <template #icon>
          <SyncOutlined :spin="true" />
        </template>
        正在请求
      </a-tag>
      <a-tag color="error" v-if="connect == 'error'">
        <template #icon>
          <DisconnectOutlined class="console__type-icon--error" />
        </template>
        连接断开
      </a-tag>


      <a-divider type="vertical" />
      <a-input :value="url" size="small" readonly style="width: 300px" />
      <a-divider type="vertical" />
      <a-input :value="room" size="small" readonly style="width: 80px" placeholder="会话ID" />
      <a-divider type="vertical" />
      <a v-if="connect == 'success'" @click="disconnect">强制断开连接</a>
      <a v-else @click="join">重新连接</a>
      <a-divider type="vertical" />
      <a-button type="link" shape="circle" size="small" @click="deleteLog">
        <DeleteOutlined></DeleteOutlined>
      </a-button>
    </div>
    <div class="console__log-area">
      <div v-for="(data, index) in log" :key="index">
        <InfoCircleOutlined class="console__type-icon--info" v-if="data.type=='INFO'" />
        <BugOutlined class="console__type-icon--warning" v-if="data.type=='DEBUG'" />
        <WarningOutlined class="console__type-icon--warning" v-if="data.type=='WARNING'" />
        <CloseCircleOutlined class="console__type-icon--error" v-if="data.type=='ERROR'" />
        <CheckCircleOutlined class="console__type-icon--success" v-if="data.type=='SUCCESS'" />
        <CaretRightOutlined />
        <a-typography-text :type="data.type=='DEBUG'?'secondary':data.type=='WARNING'?'warning':data.type=='ERROR'?'danger':data.type=='SUCCESS'?'success':'default'">
          [{{data.time}}] <span v-html="data.text"></span>
        </a-typography-text>
      </div>
      <div v-if="connect != 'error'">
        <SyncOutlined class="console__type-icon--info" :spin="true" />
        <CaretRightOutlined />
      </div>
    </div>
  </div>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';
import { useRoute } from 'vue-router';
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import {
  CodeOutlined,
  DisconnectOutlined,
  InfoCircleOutlined,
  CaretRightOutlined,
  LinkOutlined,
  SyncOutlined,
  BugOutlined,
  WarningOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons-vue';
import io from 'socket.io-client';

export default {
  name: 'WebConsole',
  components: {
    CodeOutlined,
    DisconnectOutlined,
    InfoCircleOutlined,
    CaretRightOutlined,
    LinkOutlined,
    SyncOutlined,
    BugOutlined,
    WarningOutlined,
    DeleteOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
  },
  props: {
    nodeServerAddr: String,
  },
  setup(props, context) {
    const getSocketIO = (url) => {
      const options = {
        reconnectionAttempts: 2,
        reconnectionDelay: 3000,
        timestampRequests: true,
        autoConnect: false,
      };
      const socket = io(url, options);
      return socket;
    };
    const connect = ref('processing');
    const room = ref();
    const url = ref();
    const log = reactive([]);

    const addLog = (msg, type = 'INFO') => {
      let date = new Date();

      msg = msg.replace(/\n/g, '<br/>');

      var numbers = msg.match(/\d+/gi);
      console.log(numbers);
      if (numbers != null) {
        numbers.forEach((element) => {
          msg = msg.replace(element, "<span class='log-color--green'>" + element + '</span>');
        });
      }
      log.push({
        time: date.toGMTString(),
        text: msg,
        type: type,
      });
    };

    const deleteLog = () => {
      log.length = 0;
    };

    var socket = null;
    const disconnect = () => {
      socket.disconnect();
    };

    const join = () => {
      url.value = `http://` + props.nodeServerAddr + `/realtime_msg`;
      socket = getSocketIO(url.value);
      socket.on('message', (data) => {
        if (data.type != 'ERROR') {
          addLog(data.msg, data.type);
        } else {
          addLog(JSON.parse(data.msg).traceback, data.type);
          socket.disconnect();
        }
      });
      socket.on('join_room', (data) => {
        room.value = data;
        addLog('已与SEFI服务节点建立连接，本次会话ID:' + data);
        connect.value = 'success';
      });
      socket.on('disconnect', () => {
        connect.value = 'error';
        addLog('已与SEFI服务节点断开连接', 'WARNING');
      });
      socket.on('connect_error', (error) => {
        connect.value = 'error';
        addLog('致命的连接错误:' + error, 'ERROR');
      });
      socket.io.on('reconnect_attempt', (attempt) => {
        connect.value = 'processing';
        addLog('正在重试连接，第' + attempt + '次 / 共 2 次', 'WARNING');
      });
      socket.open();
      socket.emit('join');
    };

    onMounted(async () => {
      addLog('Canary初始化');
      join();
    });

    return {
      connect,
      url,
      room,
      log,

      deleteLog,
      join,
      disconnect,
    };
  },
};
</script>
