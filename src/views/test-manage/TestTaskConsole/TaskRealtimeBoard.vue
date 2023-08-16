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
    </template>
    <template v-slot:content>
      <h2 class="attack-task__title">实时看板</h2>
      <TaskList ref="taskList" :taskListType="taskListType">
        <template #extra="{ record }">
          <div>
            <a @click="toDetails(record.id)">查看任务详情</a>
            <a-divider type="vertical"></a-divider>
            <a>删除任务</a>
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

export default {
  name: 'TestRealtimeBoard',
  components: { MainPageNavigation, TaskList },
  setup() {
    const taskListType = ref(['AttackTest']);
    const taskList = ref();

    onMounted(async () => {
      await taskList.value.loadData(true);
    });

    const toDetails = (taskID) => {
      router.push({ path: '/TaskRealtimeBoard/TaskConsole', query: { taskID: taskID } });
    };

    return {
      taskListType,
      taskList,
      toDetails,
    };
  },
};
</script>
