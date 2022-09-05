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
      <a-descriptions bordered size="small">
        <a-descriptions-item label="任务名">Cloud Database</a-descriptions-item>
        <a-descriptions-item label="任务描述">Prepaid</a-descriptions-item>
        <a-descriptions-item label="指派节点">YES</a-descriptions-item>
        <a-descriptions-item label="Order time">2018-04-24 18:00:00</a-descriptions-item>
        <a-descriptions-item label="Usage Time" :span="2">2019-04-24 18:00:00</a-descriptions-item>
        <a-descriptions-item label="Status" :span="3">
          <a-badge status="processing" text="Running" />
        </a-descriptions-item>
        <a-descriptions-item label="Negotiated Amount">$80.00</a-descriptions-item>
        <a-descriptions-item label="Discount">$20.00</a-descriptions-item>
        <a-descriptions-item label="Official Receipts">$60.00</a-descriptions-item>
        <a-descriptions-item label="配置信息">
        </a-descriptions-item>
      </a-descriptions>
      <WebConsole :nodeServerAddr="'10.108.16.242:5000'" style="margin-top:10px"></WebConsole>
    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';
import { useRoute } from 'vue-router';
import { defineComponent, onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
import { DeploymentUnitOutlined } from '@ant-design/icons-vue';
import { getTaskListByType } from '@/api/task-api/taskInfo.js';

import WebConsole from './WebConsole.vue';

export default {
  name: 'TestRealtimeBoard',
  components: {
    MainPageNavigation,
    WebConsole,
  },
  setup() {
    const route = useRoute();
    const taskID = ref();

    onMounted(async () => {
      await loadData(true);
      taskID.value = route['query']['taskID'];
    });

    const loadData = async () => {};

    return {
      taskID,

      loadData,
    };
  },
};
</script>
