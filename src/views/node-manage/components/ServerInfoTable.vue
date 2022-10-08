<style scoped lang="less">
.title {
  margin-bottom: 15px;
}
.editable-cell {
  position: relative;
  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
    display: flex;
    align-items: center;
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

.state {
  display: flex;
  flex-direction: row;
  align-items: center;
  // justify-content: space-around;
  &__greenpoint {
    display: inline-block;
    height: 5px;
    width: 5px;
    border-radius: 16px;
    color: #fff;
    background: rgb(119, 228, 119);
    margin-right: 3px;
  }
  &__redpoint {
    display: inline-block;
    height: 5px;
    width: 5px;
    border-radius: 16px;
    color: #fff;
    background: rgb(175, 2, 2);
    margin-right: 3px;
  }
  &__running {
    margin-right: 10px;
    color: rgb(8, 179, 8);
  }
  &__stopping {
    margin-right: 10px;
    color: rgb(237, 6, 6);
  }
}
</style>

<template>
  <h2 class="title">服务资源列表</h2>

  <!-- 新增节点，还在构建中 -->
  <AddNodeForm @nodeInfo="getInfo"></AddNodeForm>

  <!-- 节点表 -->
  <a-table bordered :data-source="dataSource" :columns="columns" :pagination="pagination" @change="(...args) => handleTableChange(...args)" size="small">
    <!-- record是每一行数据的副本 -->
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

      <template v-else-if="column.dataIndex === 'status'">
        <StatusGrid :ip="record.ip" :port="record.port"></StatusGrid>
      </template>

      <template v-else-if="column.dataIndex === 'operation'">
        <a-popconfirm v-if="dataSource.length" title="确认删除?" okText="确定" cancelText="取消" @confirm="onDelete(record.key)">
          <a>删除</a>
        </a-popconfirm>
      </template>

    </template>
  </a-table>
</template>



<script>
import AddNodeForm from '@/views/node-manage/components/AddNodeForm.vue';
import StatusGrid from '@/views/node-manage/components/StatusGrid.vue';
import { defineComponent, ref, computed, reactive, onBeforeMount } from 'vue';
import { DeploymentUnitOutlined, ClusterOutlined, CheckOutlined, EditOutlined, SyncOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash-es';
import { getNodeInfo, deleteNodeInfo, updateNodeInfo } from '@/api/node-api/nodeinfo';

export default defineComponent({
  name: 'ServerInfoCard',
  components: {
    DeploymentUnitOutlined,
    ClusterOutlined,
    CheckOutlined,
    EditOutlined,
    SyncOutlined,
    AddNodeForm,
    StatusGrid,
  },
  props: {
    //
  },
  setup() {
    const getInfo = async (nodeInfo) => {
      // 新增节点了直接刷新
      const data = await getNodeInfo();
      data.forEach((element, index) => {
        dataSource.value[index] = {
          key: element.nodeID,
          index: index + 1,
          name: element.nodeName,
          ip: element.host,
          port: element.port,
          description: element.nodeDesc,
          createTime: element.createTime,
          status: 'unknown',
        };
      });
      totalNodeInfo.value = data.length;
    };

    // 表格显示的每一列的标题等属性
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
        width: '10%',
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '30%',
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '10%',
      },
      {
        title: '操作',
        dataIndex: 'operation',
      },
    ];

    const totalNodeInfo = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const pagination = computed(() => {
      return {
        total: totalNodeInfo.value,
        current: currentPage.value,
        pageSize: pageSize.value,
      };
    });

    // 换页面
    const handleTableChange = (newPagination, filters, sorter) => {
      currentPage.value = newPagination.current;
    };

    // 显示的数据源
    const dataSource = ref([]);

    // 正在编辑的行的数据副本
    const editableData = reactive({});

    // 正在编辑的属性
    const editableElement = ref({});

    const edit = (key, element) => {
      // 深拷贝一份原有数据
      editableData[key] = cloneDeep(dataSource.value.filter((item) => key === item.key)[0]);
      editableElement.value[key] = element;
    };

    const save = async (key) => {
      // 将编辑的数据覆盖数据源中对应的对象
      Object.assign(dataSource.value.filter((item) => key === item.key)[0], editableData[key]);
      let success = await updateNodeInfo(
        editableData[key].key,
        editableData[key].ip,
        editableData[key].port,
        editableData[key].name,
        editableData[key].description
      );
      console.log(success);
      delete editableData[key];
      editableElement.value[key] = '';
    };

    const onDelete = async (key) => {
      dataSource.value = dataSource.value.filter((item) => item.key !== key);
      let success = await deleteNodeInfo(key);
      console.log(success);
    };

    onBeforeMount(async () => {
      const data = await getNodeInfo();
      data.forEach((element, index) => {
        dataSource.value[index] = {
          key: element.nodeID,
          index: index + 1,
          name: element.nodeName,
          ip: element.host,
          port: element.port,
          description: element.nodeDesc,
          createTime: element.createTime,
          status: 'unknown',
        };
      });
      totalNodeInfo.value = data.length;
    });
    return {
      getInfo,
      columns,
      onDelete,
      dataSource,
      editableData,
      editableElement,
      totalNodeInfo,
      currentPage,
      pageSize,
      pagination,
      handleTableChange,
      edit,
      save,
    };
  },
});
</script>