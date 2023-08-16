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
    </template>
    <template v-slot:content>
      <h2 class="attack-task__title">结果分析</h2>
      <TaskList ref="taskList" :taskListType="taskListType">
        <template #extra="{ record }">
          <div>
            <a @click="toReport(record.id, record.taskType)">查看任务分析报告</a>
            <a-divider type="vertical"></a-divider>
            <a>放弃任务执行结果</a>
          </div>
        </template>
      </TaskList>
    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';
import { onMounted, ref } from 'vue';
import router from '@/router';

import TaskList from '@/components/task/TaskList.vue';
import { getTaskByTaskID } from '@/api/task-api/taskInfo.js';

export default {
  name: 'TestRealtimeBoard',
  components: { MainPageNavigation, TaskList },
  setup() {
    const taskListType = ref(['AttackTest']);
    const taskList = ref();

    onMounted(async () => {
      await taskList.value.loadData(true);
    });

    const toReport = (taskID, taskType) => {
      if (taskType['subTypeName'] == '全面测试') {
        router.push({ path: '/ResultAnalysisBoard/analysis/ModelViewResultAnalysis', query: { taskID: taskID } });
      }
      if (taskType['subTypeName'] == '最佳扰动探索') {
        router.push({ path: '/ResultAnalysisBoard/Analysis/ExplorePerturbationViewResultAnalysis', query: { taskID: taskID } });
      }
    };

    return {
      taskListType,
      taskList,
      toReport,
    };
  },
};
</script>
