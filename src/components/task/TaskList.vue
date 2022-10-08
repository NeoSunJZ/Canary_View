<style scoped lang="less">
</style>

<template>
  <div>
    <a-table :dataSource="taskList" :columns="columns">
      <template #bodyCell="{ column, record }">
        <div v-if="column.key == 'nodeInfo'">
          {{record.nodeInfo.nodeName}} (NodeID: {{record.nodeInfo.nodeID}}) - 在 {{record.nodeInfo.host}}:{{record.nodeInfo.port}} 上
        </div>
        <div v-if="column.key == 'action'">
          <slot name="extra" :record="record"></slot>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import { getTaskListByType } from '@/api/task-api/taskInfo.js';
import { ref } from 'vue';

export default {
  name: 'TaskList',
  props: {
    taskListType: String,
  },
  setup(props, context) {
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

    const loadData = async (updata = false) => {
      if (updata) {
        currentPage.value = 0;
        taskList.value = [];
      }
      let newLoadData = await getTaskListByType(props.taskListType[0], currentPage.value, pageSize.value);
      taskList.value = taskList.value.concat(newLoadData.list);
    };

    return {
      taskList,
      columns,
      loadData,
    };
  },
};
</script>
