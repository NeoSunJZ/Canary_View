<style scoped lang="less">
.submenu {
  height: 50px;
}
</style>

<template>
  <MainPageNavigation :selectedKeys="['7']" :openKeys="['sub2']">

    <template v-slot:submenu>
      <a-menu v-model:selectedKeys="taskListType" mode="horizontal" class="submenu" @select="loadData(true)">
        <a-menu-item key="DefenseTest"> 防御测试 </a-menu-item>
        <a-menu-item key="AttackTest"> 攻击测试 </a-menu-item>
        <a-menu-item key="ModelTest"> 模型测试 </a-menu-item>
      </a-menu>
    </template>
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>测试任务管理</a-breadcrumb-item>
      <a-breadcrumb-item>测试任务实时看板</a-breadcrumb-item>
      <a-breadcrumb-item>全部测试任务</a-breadcrumb-item>
    </template>
    <template v-slot:content>
      <h2 class="attack-task__title">实时看板</h2>
      <a-table :dataSource="taskList" :columns="columns">
        <template #bodyCell="{ column, record }">
          <div v-if="column.key == 'nodeInfo'">
            {{record.nodeInfo.nodeName}} (NodeID: {{record.nodeInfo.nodeID}}) - 在 {{record.nodeInfo.host}}:{{record.nodeInfo.port}} 上
          </div>
          <div v-if="column.key == 'action'">
            <a @click="toDetails(record.id)">查看任务详情</a>
            <a-divider type="vertical"></a-divider>
            <a>删除任务</a>
          </div>
        </template>
      </a-table>
    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';
import { defineComponent, onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
import { DeploymentUnitOutlined } from '@ant-design/icons-vue';
import router from '@/router';

import { getTaskListByType } from '@/api/task-api/taskInfo.js';

export default {
  name: 'TestRealtimeBoard',
  components: { MainPageNavigation },
  setup() {
    const taskListType = ref(['AttackTest']);
    const taskList = ref();
    const columns = [
      {
        title: '任务ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '任务名称',
        dataIndex: 'taskName',
        key: 'taskName',
      },
      {
        title: '任务描述',
        dataIndex: 'taskDesc',
        key: 'taskDesc',
      },
      {
        title: '节点信息',
        dataIndex: 'nodeInfo',
        key: 'nodeInfo',
      },
      {
        title: '任务子类',
        dataIndex: ['taskType', 'subTypeName'],
        key: 'taskDesc',
      },
      {
        title: '任务创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '创建者',
        dataIndex: 'createUser',
        key: 'createUser',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
      },
    ];

    const pageSize = ref(10);
    const currentPage = ref(0);

    onMounted(async () => {
      await loadData(true);
    });

    const loadData = async (updata = false) => {
      if (updata) {
        currentPage.value = 0;
        taskList.value = [];
      }
      let newLoadData = await getTaskListByType(taskListType.value[0], currentPage.value, pageSize.value);
      taskList.value = taskList.value.concat(newLoadData.list);
    };

    const toDetails = (taskID) => {
      router.push({ path: '/TaskRealtimeBoard/TaskConsole', query: { taskID: taskID } });
    };

    return {
      taskListType,
      taskList,
      columns,
      loadData,
      toDetails,
    };
  },
};
</script>
