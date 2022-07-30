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

  <a-modal v-model:visible="visible" okText="确定" cancelText="取消" width="1000px" @ok="handleOk" :closable='false'>
    123
  </a-modal>

  <a-table bordered :data-source="dataSource" :columns="columns">
    <template #bodyCell="{ column, text, record }">

      <template v-if="column.dataIndex === 'name'">
        <div class="editable-cell">
          <div v-if="editableData[record.key]&&editableElement[record.key]=='name'" class="editable-cell-input-wrapper">
            <a-input v-model:value="editableData[record.key].name" @pressEnter="save(record.key)" />
            <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || ' ' }}
            <edit-outlined class="editable-cell-icon" @click="edit(record.key,'name')" />
          </div>
        </div>
      </template>

      <template v-else-if="column.dataIndex === 'ip'">
        <div class="editable-cell">
          <div v-if="editableData[record.key]&&editableElement[record.key]=='ip'" class="editable-cell-input-wrapper">
            <a-input v-model:value="editableData[record.key].ip" @pressEnter="save(record.key)" />
            <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || ' ' }}
            <edit-outlined class="editable-cell-icon" @click="edit(record.key,'ip')" />
          </div>
        </div>
      </template>

      <template v-else-if="column.dataIndex === 'port'">
        <div class="editable-cell">
          <div v-if="editableData[record.key]&&editableElement[record.key]=='port'" class="editable-cell-input-wrapper">
            <a-input v-model:value="editableData[record.key].port" @pressEnter="save(record.key)" />
            <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || ' ' }}
            <edit-outlined class="editable-cell-icon" @click="edit(record.key,'port')" />
          </div>
        </div>
      </template>

      <template v-else-if="column.dataIndex === 'description'">
        <div class="editable-cell">
          <div v-if="editableData[record.key]&&editableElement[record.key]=='description'" class="editable-cell-input-wrapper">
            <a-input v-model:value="editableData[record.key].description" @pressEnter="save(record.key)" />
            <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || ' ' }}
            <edit-outlined class="editable-cell-icon" @click="edit(record.key,'description')" />
          </div>
        </div>
      </template>

      <template v-else-if="column.dataIndex === 'operation'">
        <a @click="getStatus(record.ip,record.port)">刷新</a>
        <a-popconfirm v-if="dataSource.length" title="Sure to delete?" @confirm="onDelete(record.key)">
          <a> 删除</a>
        </a-popconfirm>
      </template>

    </template>
  </a-table>
</template>



<script>
import { defineComponent, ref, computed, reactive, onBeforeMount } from 'vue';
import { DeploymentUnitOutlined, ClusterOutlined, CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import { cloneDeep, forEach } from 'lodash-es';
import { getNodeInfo, addNodeInfo, deleteNodeInfo, updateNodeInfo } from '@/api/node-api/nodeinfo';
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
    //
  },
  setup() {
    const visible = ref(false);
    // 表格显示的每一列的标题以及宽度
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
    const count = computed(() => dataSource.value.length + 1);
    const editableData = reactive({});
    const editableElement = ref({});
    const edit = (key, element) => {
      editableData[key] = cloneDeep(dataSource.value.filter((item) => key === item.key)[0]);
      editableElement.value[key] = element;
    };

    const save = (key) => {
      Object.assign(dataSource.value.filter((item) => key === item.key)[0], editableData[key]);
      delete editableData[key];
      editableElement.value[key] = '';
    };

    const onDelete = (key) => {
      dataSource.value = dataSource.value.filter((item) => item.key !== key);
    };
    const getStatus = (ip, port) => {
      console.log(ip, port);
    };
    const handleAdd = () => {
      visible.value = true;
      // const newData = {
      //   key: `${count.value}`,
      //   name: `Edward King ${count.value}`,
      //   ip: 32,
      //   port: `London, Park Lane no. ${count.value}`,
      //   description: `测试节点 ${count.value}`,
      // };
      // dataSource.value.push(newData);
    };
    onBeforeMount(async () => {
      // const data = await getNodeInfo(1, 2);
      // data.list.forEach((element) => {
      //   console.log(element);
      // });
    });
    return {
      visible,
      columns,
      onDelete,
      getStatus,
      handleAdd,
      dataSource,
      editableData,
      editableElement,
      count,
      edit,
      save,
    };
  },
});
</script>