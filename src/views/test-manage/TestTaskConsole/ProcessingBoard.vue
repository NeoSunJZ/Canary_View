<style scoped lang="less">
@import '@/style.less';
.proc-board {
  max-height: 400px;
  overflow-y: auto;
}
.proc-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  &__text {
    margin: 0px;
  }
}
</style>

<template>
  <div>
    <div class="proc-title">
      <h3 class="proc-title__text">
        <BarsOutlined /> 进度
        <a-button shape="circle" type="text" @click="loadProcessingData" class="proc-title__text">
          <SyncOutlined />
        </a-button>
      </h3>
      <div class="proc-title__text">
        允许放弃进度 <a-switch v-model:checked="allowRevokeTaskStepLog" size="small" />
      </div>
    </div>
    <a-card class="proc-board">
      <a-timeline :reverse="true">
        <a-timeline-item v-for="(log,index) in processingData" :key="index" :color="log.stop_time!=null ? (Boolean(parseInt(log.is_finish)) ? 'green' : 'red') : 'blue'">
          <template #dot>
            <LoadingOutlined v-if="log.stop_time == null" />
            <CloseCircleOutlined v-if="!Boolean(parseInt(log.is_finish)) && log.stop_time != null" />
            <CheckCircleOutlined v-if="Boolean(parseInt(log.is_finish))" />
          </template>
          <span class="proc-timeline__title"> {{log.step_name}} </span>
          <p>
            <a-typography-text type="secondary" class="proc-timeline__text">{{log.participant}} (已完成 {{log.completed_num}}) <br /> {{log.stop_time}} <br /></a-typography-text>
            <a-typography-text type="secondary" class="proc-timeline__text" v-if="allowRevokeTaskStepLog">记录ID {{log.id}} <a-button type="link" danger size="small"
                @click="revokeTaskStep(log.id)">放弃并重置该部分进度</a-button></a-typography-text>
            <a-typography-text type="danger" class="proc-timeline__text" v-if="!Boolean(parseInt(log.is_finish)) && log.stop_time != null"><br />错误: {{log.errorType}}:{{log.errorObject}}<br />
              <a-popover title="错误堆栈" placement="left">
                <template #content>
                  <div v-html="log.errorTraceback"></div>
                </template>
                <a>错误堆栈详情</a>
              </a-popover>
            </a-typography-text>
          </p>
        </a-timeline-item>
      </a-timeline>
    </a-card>
  </div>
</template>

<script>
import { createVNode, onMounted, reactive, ref } from 'vue';
import { Modal } from 'ant-design-vue';
import { getTaskStepLog, revokeTaskStepLog } from '@/api/framework-api/task.js';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import {
  BarsOutlined,
  DisconnectOutlined,
  InfoCircleOutlined,
  CaretRightOutlined,
  LoadingOutlined,
  SyncOutlined,
  BugOutlined,
  WarningOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons-vue';

export default {
  name: 'WebConsole',
  components: {
    BarsOutlined,
    DisconnectOutlined,
    InfoCircleOutlined,
    CaretRightOutlined,
    LoadingOutlined,
    SyncOutlined,
    BugOutlined,
    WarningOutlined,
    DeleteOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
  },
  props: {
    nodeServerAddr: String,
    batchToken: String,
  },
  setup(props, context) {
    const processingData = ref();

    const loadProcessingData = async () => {
      if (props.batchToken != null) {
        processingData.value = await getTaskStepLog(props.nodeServerAddr, props.batchToken);
        processingData.value.forEach((element) => {
          try {
            let errorMsg = JSON.parse(element['stop_reason']);
            element['errorType'] = errorMsg['exception_type'];
            element['errorObject'] = errorMsg['exception_object'];
            element['errorTraceback'] = errorMsg['traceback'].replace(/\n/g, '<br/>');
          } catch (error) {
            //..
          }
        });
      }
    };

    const revokeTaskStep = async (systemLogID) => {
      Modal.confirm({
        title: '重置确认',
        icon: createVNode(ExclamationCircleOutlined),
        content: '您正在放弃并重置该部分进度，重置后该部分进度将永久丢失，请确认操作!',
        onOk: async () => {
          await revokeTaskStepLog(props.nodeServerAddr, props.batchToken, systemLogID);
          await loadProcessingData();
        },
        onCancel() {},
      });
    };

    const allowRevokeTaskStepLog = ref(false);

    onMounted(async () => {});

    return {
      loadProcessingData,
      revokeTaskStep,
      processingData,
      allowRevokeTaskStepLog,
    };
  },
};
</script>
