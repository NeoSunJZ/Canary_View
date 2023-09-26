<style scoped lang="less">
.submenu {
  height: 50px;
}
</style>

<template>
  <MainPageNavigation :selectedKeys="['7']" :openKeys="['sub2']">
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>测试任务管理</a-breadcrumb-item>
      <a-breadcrumb-item>测试任务实时看板</a-breadcrumb-item>
      <a-breadcrumb-item>全部测试任务</a-breadcrumb-item>
      <a-breadcrumb-item>任务(TaskID:{{taskID}})</a-breadcrumb-item>
    </template>
    <template v-slot:content>
      <h2 class="attack-task__title">任务(TaskID:{{taskID}})实时看板</h2>
      <a-descriptions bordered size="small" :column="4" v-if="taskInfo!=null" style="margin-top:10px">
        <a-descriptions-item label="任务名称" :span="1">{{taskInfo.taskName}}</a-descriptions-item>
        <a-descriptions-item label="任务创建者" :span="1">{{taskInfo.createUser}}</a-descriptions-item>
        <a-descriptions-item label="任务描述" :span="2">{{taskInfo.taskDesc}}</a-descriptions-item>

        <a-descriptions-item label="指派节点" :span="2">{{taskInfo.nodeInfo.nodeName}}({{taskInfo.nodeInfo.host}}:{{taskInfo.nodeInfo.port}})</a-descriptions-item>
        <a-descriptions-item label="任务属类" :span="2">{{taskInfo.taskType.subTypeName}}(API {{taskInfo.taskType.targetApi}}
          版本{{taskInfo.taskType.apiVersion}})</a-descriptions-item>

        <a-descriptions-item label="创建时间" :span="1">{{taskInfo.createTime}}</a-descriptions-item>
        <a-descriptions-item label="上次执行时间" :span="1">{{taskInfo.lastRunTime!=null?taskInfo.lastRunTime:"任务尚未执行"}}</a-descriptions-item>
        <a-descriptions-item label="SEFI任务状态" :span="2">
          <a-badge status="warning" text="未运行(尚未执行)" v-if="taskInfo.batchToken==null" />
          <div v-else>
            <a-badge status="error" text="状态请求失败" v-if="statusCode == null" />
            <a-badge status="error" text="未运行(异常中断)" v-if="statusCode == -1" />
            <a-badge status="success" text="未运行(已结束)" v-if="statusCode == 1" />
            <a-badge status="processing" text="运行中" v-if="statusCode == 2" />
            <a-badge status="warning" v-if="statusCode == 3">
              <template #text>
                <a-popconfirm ok-text="关闭" :showCancel="false">
                  <template #title>
                    <div>
                      为避免损坏数据造成分析失败，系统不会立刻终止任务工作。<br />将在其完成当前步骤的原子事件（例如完成当前图片的所有工作并保存）后终止运行。
                    </div>
                  </template>
                  <span>
                    正在终止
                    <QuestionCircleOutlined />
                  </span>
                </a-popconfirm>
              </template>
            </a-badge>
            (批次标识: {{taskInfo.batchToken}})
            <a-button shape="circle" type="text" @click="loadTaskStatus">
              <SyncOutlined />
            </a-button>
          </div>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions bordered size="small" :column="4" v-if="taskInfo!=null">
        <a-descriptions-item label="配置信息" :span="4">{{taskInfo.config}}
        </a-descriptions-item>
        <a-descriptions-item label="操作" :span="4">
          <a-button type="primary" style="margin-right:5px" @click="startTest(false)" v-if="taskInfo.batchToken==null"
            :disabled="statusCode == 3">启动测试</a-button>
          <span v-else>
            <a-button type="primary" style="margin-right:5px" danger @click="stopTest" v-if="statusCode == 2">终止测试</a-button>
            <a-button type="primary" style="margin-right:5px" @click="startTest(false)" v-if="statusCode == 1 || statusCode == -1">放弃结果并重新测试</a-button>
            <a-button type="primary" style="margin-right:5px" @click="startTest(true)" v-if="statusCode == -1">恢复测试</a-button>
            <a-button style="margin-right:5px" v-if="statusCode == 1">结果分析</a-button>
            <a-button style="margin-right:5px" @click="loadHistoryConsoleLog" :disabled="statusCode == 3">重新加载历史日志</a-button>
          </span>
          <a-divider type="vertical" />
          启用详细模式
          <a-switch v-model:checked="debugMode" checked-children="开" un-checked-children="关" :disabled="statusCode == 2 || statusCode == 3" />
          <a-divider type="vertical" />
          <a-button type="primary" style="margin-right:5px" @click="loadBigScreen" v-if="bigScreenStatus">载入大屏</a-button>
          <a-button type="danger" style="margin-right:5px" @click="unloadBigScreen" v-if="bigScreenStatus">关闭大屏</a-button>
        </a-descriptions-item>
      </a-descriptions>
      <a-row style="margin-top:10px">
        <a-col :span="18" style="padding-right:10px">
          <WebConsole ref="webConsole" v-if="taskInfo!=null" :nodeServerAddr="nodeServerAddr" :debugMode="debugMode" @received="onReceived">
          </WebConsole>
        </a-col>
        <a-col :span="6">
          <ProcessingBoard ref="processingBoard" v-if="taskInfo!=null" :nodeServerAddr="nodeServerAddr" :batchToken="taskInfo.batchToken">
          </ProcessingBoard>
        </a-col>
      </a-row>
    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';
import { useRoute } from 'vue-router';
import { createVNode, onMounted, ref, h, watch, computed } from 'vue';
import { Modal } from 'ant-design-vue';
import { QuestionCircleOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons-vue';
import { getTaskByTaskID, setTaskStatus } from '@/api/task-api/taskInfo.js';
import { getTaskRunningStatus, getTaskConsoleLog, stopTask } from '@/api/framework-api/task.js';

import WebConsole from './WebConsole.vue';
import ProcessingBoard from './ProcessingBoard.vue';

import axios from 'axios';

export default {
  name: 'TestRealtimeBoard',
  components: {
    MainPageNavigation,
    QuestionCircleOutlined,
    SyncOutlined,
    WebConsole,
    ProcessingBoard,
  },
  setup() {
    const route = useRoute();
    const taskID = ref();
    const taskInfo = ref();
    const statusCode = ref();
    const debugMode = ref(true);

    const webConsole = ref();
    const processingBoard = ref();

    const nodeServerAddr = computed(() => {
      if (taskInfo.value != null) return taskInfo.value.nodeInfo.host + ':' + taskInfo.value.nodeInfo.port;
      else return null;
    });

    const bigScreenStatus = ref(false);

    window.addEventListener('storage', function (event) {
      if (event.key == 'bigScreenStatus') {
        if (event.newValue == 'open') {
          bigScreenStatus.value = true;
        } else {
          bigScreenStatus.value = false;
        }
      }
    });

    onMounted(async () => {
      taskID.value = route['query']['taskID'];
      localStorage.setItem('nowTaskID', taskID.value);
      await loadData(true);
      await loadTaskStatus();
      if (taskInfo.value.batchToken != null) {
        await processingBoard.value.loadProcessingData();
        if (statusCode.value != 2) {
          loadHistoryConsoleLog();
        }
      }
      bigScreenStatus.value = localStorage.getItem('bigScreenStatus') == 'open';
    });

    const loadData = async () => {
      taskInfo.value = await getTaskByTaskID(taskID.value);
    };

    const loadTaskStatus = async () => {
      if (taskInfo.value.batchToken != null) {
        statusCode.value = await getTaskRunningStatus(nodeServerAddr.value, taskInfo.value.batchToken);
      }
    };

    const pageLoadTime = Date.now();
    const loadHistoryConsoleLog = async () => {
      let historyConsoleLog = await getTaskConsoleLog(nodeServerAddr.value, taskInfo.value.batchToken, statusCode.value == 2 ? pageLoadTime : null);
      if (historyConsoleLog.length == 0 && statusCode.value != 2) {
        Modal.error({
          title: '历史记录数据加载错误',
          content: h('div', {}, [
            h('p', 'SEFI存储的历史记录文件不存在或已经损坏，可能原因：'),
            h('p', 'a. 您删除或移动了SEFI端的System_log.db'),
            h('p', 'b. 您重置了SEFI端，或更换了节点服务器上的SEFI程序'),
            h('p', 'c. SEFI记录的日志文件因突然的断电或错误已经损坏,SEFI已自行重置'),
          ]),
        });
      }
      if (statusCode.value != 2) {
        webConsole.value.disconnect();
        webConsole.value.deleteLog();
      }
      webConsole.value.setHistoryConsoleLog(historyConsoleLog);
    };

    const onReceived = async (logMsg) => {
      await loadTaskStatus();
      await processingBoard.value.loadProcessingData();
    };

    const stopTest = async () => {
      Modal.confirm({
        title: '终止确认',
        icon: createVNode(ExclamationCircleOutlined),
        content: '您正在终止任务执行，有概率导致已测试的数据发生损坏，请确认操作!',
        onOk() {
          stopTask(nodeServerAddr.value, taskInfo.value.batchToken).then(() => {
            loadTaskStatus();
          });
        },
        onCancel() {},
      });
    };

    const startTest = async (isRestart = false) => {
      webConsole.value.deleteLog();
      webConsole.value.disconnect();
      webConsole.value.join();

      if (!isRestart) {
        taskInfo.value.batchToken = null;
      }

      axios({
        method: 'post',
        url: 'http://' + nodeServerAddr.value + taskInfo.value.taskType.targetApi,
        data: {
          isRestart: isRestart,
          batchToken: isRestart ? taskInfo.value.batchToken : null,
          debugMode: debugMode.value,
          config: JSON.parse(taskInfo.value.config),
        },
      })
        .then(async (response) => {
          if (response.data.status === 'SUCCESS') {
            let batchToken = response.data.msg;
            let data = await setTaskStatus(taskID.value, batchToken);
            taskInfo.value.batchToken = data.batchToken;
            taskInfo.value.lastRunTime = data.lastRunTime;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const loadBigScreen = () => {
      localStorage.setItem('nowTaskID', taskID.value);
    };
    const unloadBigScreen = () => {
      localStorage.removeItem('nowTaskID');
    };

    return {
      taskID,
      taskInfo,
      statusCode,
      debugMode,
      nodeServerAddr,

      webConsole,
      processingBoard,

      loadData,
      onReceived,
      loadHistoryConsoleLog,
      loadTaskStatus,

      startTest,
      stopTest,
      loadBigScreen,
      unloadBigScreen,
      bigScreenStatus,
    };
  },
};
</script>
