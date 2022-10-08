<style scoped lang="less">
.submenu {
  height: 50px;
}
</style>

<template>
  <MainPageNavigation :selectedKeys="['8']" :openKeys="['sub2']">
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>测试任务管理</a-breadcrumb-item>
      <a-breadcrumb-item>测试任务结果分析</a-breadcrumb-item>
      <a-breadcrumb-item>全部测试任务</a-breadcrumb-item>
      <a-breadcrumb-item>任务(TaskID:{{taskID}})</a-breadcrumb-item>
    </template>
    <template v-slot:content>
      <h2 class="attack-task__title">任务(TaskID:{{taskID}})结果分析 (最佳扰动分析视图)</h2>
      <a-descriptions bordered size="small" :column="4" v-if="taskInfo!=null" style="margin-top:10px">
        <a-descriptions-item label="任务名称" :span="1">{{taskInfo.taskName}}</a-descriptions-item>
        <a-descriptions-item label="任务创建者" :span="1">{{taskInfo.createUser}}</a-descriptions-item>
        <a-descriptions-item label="任务描述" :span="2">{{taskInfo.taskDesc}}</a-descriptions-item>
        <a-descriptions-item label="任务属类" :span="1">{{taskInfo.taskType.subTypeName}}</a-descriptions-item>
        <a-descriptions-item label="执行时间" :span="1">{{taskInfo.lastRunTime}}</a-descriptions-item>
        <a-descriptions-item label="SEFI任务批次" :span="1">{{taskInfo.batchToken}}</a-descriptions-item>
      </a-descriptions>
      <a-tabs v-model:activeKey="activeAttackName" @change="loadResultByAttackName">
        <a-tab-pane v-for="attackName in attackList" :tab="attackName" :key="attackName">
          <a-card size="small" :title="attackName+' 的 对抗扰动探索测试结果'" style="margin-bottom:5px">
            <PerturbationChangeBox :explorePerturbationResult="explorePerturbationResult[attackName]" v-if="!loading"></PerturbationChangeBox>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';
import PerturbationChangeBox from '../components/PerturbationChangeBox.vue';
import { useRoute } from 'vue-router';
import { createVNode, onMounted, ref, h, watch, computed, reactive } from 'vue';

import { getExplorePerturbationResult } from '@/api/framework-api/analyzer.js';
import { getTaskByTaskID } from '@/api/task-api/taskInfo.js';

import * as echarts from 'echarts';

export default {
  name: 'ModelView',
  components: { MainPageNavigation, PerturbationChangeBox },
  setup() {
    const route = useRoute();

    const loading = ref(true);
    const taskID = ref();
    const taskInfo = ref();
    const taskConfig = ref();
    const attackList = ref({});
    const activeAttackName = ref();

    const explorePerturbationResult = ref({});

    const nodeServerAddr = computed(() => {
      if (taskInfo.value != null) return taskInfo.value.nodeInfo.host + ':' + taskInfo.value.nodeInfo.port;
      else return null;
    });

    const loadtaskInfo = async () => {
      taskInfo.value = await getTaskByTaskID(taskID.value);
      taskConfig.value = JSON.parse(taskInfo.value['config']);
      console.log(taskConfig.value);
      attackList.value = Object.keys(taskConfig.value['attacker_list']);
      activeAttackName.value = attackList.value[0];

      await loadResultByAttackName(attackList.value[0]);
    };

    const loadResultByAttackName = async (attackName) => {
      loading.value = true;
      // inferenceResult[modelName] = await getInferenceResultByModelName(nodeServerAddr.value, modelName, taskInfo.value.batchToken);
      if (explorePerturbationResult.value[attackName] == null) {
        explorePerturbationResult.value[attackName] = {};
        let baseModelList = taskConfig.value['attacker_list'][attackName];
        for (let index in baseModelList) {
          explorePerturbationResult.value[attackName][baseModelList[index]] = await getExplorePerturbationResult(
            nodeServerAddr.value,
            attackName,
            baseModelList[index],
            taskInfo.value.batchToken
          );
        }
      }
      loading.value = false;
    };

    onMounted(async () => {
      taskID.value = route['query']['taskID'];
      await loadtaskInfo();
    });

    return {
      loading,
      taskID,
      taskInfo,
      attackList,
      activeAttackName,
      explorePerturbationResult,
      nodeServerAddr,
      loadResultByAttackName,
    };
  },
};
</script>
