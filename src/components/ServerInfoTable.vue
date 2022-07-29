<style scoped lang="less">
.title {
  margin-bottom: 20px;
}

.editable-cell {
  position: relative;
  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>

<template>
  <h2 class="title">服务资源列表</h2>

  <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd">新增节点</a-button>

  <a-table bordered :data-source="dataSource" :columns="columns">
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'name'">
        <div class="editable-cell">
          <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
            <a-input v-model:value="editableData[record.key].name" @pressEnter="save(record.key)" />
            <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || ' ' }}
            <edit-outlined class="editable-cell-icon" @click="edit(record.key)" />
          </div>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'ip'">
        <div class="editable-cell">
          <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
            <a-input v-model:value="editableData[record.key].ip" @pressEnter="save(record.key)" />
            <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || ' ' }}
            <edit-outlined class="editable-cell-icon" @click="edit(record.key)" />
          </div>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'operation'">

        <a @click="getStatus(record.ip,record.port)">查询状态</a>

        <a-popconfirm v-if="dataSource.length" title="Sure to delete?" @confirm="onDelete(record.key)">
          <a> 删除节点</a>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
</template>



<script>
import { defineComponent, ref, computed, reactive, onBeforeMount } from 'vue';
import { DeploymentUnitOutlined, ClusterOutlined, CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import { cloneDeep, forEach } from 'lodash-es';
import { getNodeInfo } from '@/api/node-api/nodeinfo';
import { message } from 'ant-design-vue';

export default defineComponent({
  name: 'ServerInfoCard',
  components: {
    DeploymentUnitOutlined,
    ClusterOutlined,
    CheckOutlined,
    EditOutlined,
  },
  props: {
    serverInfo: Object,
  },
  setup() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: '5%',
      },
      {
        title: '服务器',
        dataIndex: 'name',
        width: '20%',
      },
      {
        title: 'IP地址',
        dataIndex: 'ip',
        width: '15%',
      },
      {
        title: '端口',
        dataIndex: 'port',
        width: '7%',
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '30%',
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '9%',
      },
      {
        title: '操作',
        dataIndex: 'operation',
      },
    ];
    const dataSource = ref([
      {
        key: '0',
        index: '1',
        name: 'Server 0',
        ip: '10.0.0.55',
        port: '8888',
        description: '测试节点1',
        status: '运行中',
      },
      {
        key: '1',
        index: '2',
        name: 'Server 1',
        ip: '1127.1110.1110.1111',
        port: '8080',
        description: '测试节点2',
        status: '已断开',
      },
    ]);
    const print = (record) => {
      console.log(editableData);
      console.log(record);
    };
    const count = computed(() => dataSource.value.length + 1);
    const editableData = reactive({});

    const edit = (key) => {
      editableData[key] = cloneDeep(dataSource.value.filter((item) => key === item.key)[0]);
    };

    const save = (key) => {
      Object.assign(dataSource.value.filter((item) => key === item.key)[0], editableData[key]);
      delete editableData[key];
    };

    const onDelete = (key) => {
      dataSource.value = dataSource.value.filter((item) => item.key !== key);
    };
    const getStatus = (ip, port) => {
      console.log(ip, port);
    };
    const handleAdd = () => {
      const newData = {
        key: `${count.value}`,
        name: `Edward King ${count.value}`,
        ip: 32,
        port: `London, Park Lane no. ${count.value}`,
        description: `测试节点 ${count.value}`,
      };
      dataSource.value.push(newData);
    };
    onBeforeMount(async () => {
      const data = await getNodeInfo(1, 2);

      data.list.forEach((element) => {
        console.log(element);
      });
    });
    return {
      print,
      columns,
      onDelete,
      getStatus,
      handleAdd,
      dataSource,
      editableData,
      count,
      edit,
      save,
    };
  },
});
</script>