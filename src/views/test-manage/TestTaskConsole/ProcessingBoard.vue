<style scoped lang="less">
@import '~ant-design-vue/dist/antd.less';
.proc-board {
  max-height: 400px;
  overflow-y: auto;
}
</style>

<template>
  <div>
    <h3>
      <BarsOutlined /> 进度
      <a-button shape="circle" type="text" @click="loadProcessingData">
        <SyncOutlined />
      </a-button>
    </h3>
    <a-card class="proc-board">
      <a-timeline :reverse="true">
        <a-timeline-item v-for="(log,index) in processingData" :key="index" :color="log.stop_time!=null ? (Boolean(parseInt(log.is_finish)) ? 'green' : 'red') : 'blue'">
          <template #dot>
            <LoadingOutlined v-if="log.stop_time == null" />
            <CloseCircleOutlined v-if="!Boolean(parseInt(log.is_finish)) && log.stop_time != null" />
            <CheckCircleOutlined v-if="Boolean(parseInt(log.is_finish))" />
          </template>
          {{log.step_name}}
          <p>
            <a-typography-text type="secondary">{{log.participant}} (已完成 {{log.completed_num}}) <br /> {{log.stop_time}}</a-typography-text>
            <a-typography-text type="danger" v-if="!Boolean(parseInt(log.is_finish)) && log.stop_time != null"><br />错误: {{log.errorType}}:{{log.errorObject}}<br />
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
import { nextTick, onMounted, reactive, ref } from 'vue';
import { getTaskStepLog } from '@/api/framework-api/task.js';
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

    onMounted(async () => {});

    return {
      loadProcessingData,
      processingData,
    };
  },
};
</script>
