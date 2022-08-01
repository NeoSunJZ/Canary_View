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

.state {
  display: flex;
  flex-direction: row;
  align-items: center;
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
    color: rgb(8, 179, 8);
  }
  &__stopping {
    color: rgb(237, 6, 6);
  }
}
</style>

<template>
  <h2 class="title">服务资源列表</h2>

  <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd">新增节点</a-button>
  <!-- 新增节点的弹出框，还在构建中 -->
  <a-modal v-model:visible="visible" okText="确定" cancelText="取消" width="500px" @ok="handleOk" :closable='false'>
    <AddNodeForm @nodeInfo="getInfo"></AddNodeForm>
  </a-modal>

  <!-- 节点表 -->
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

      <template v-else-if="column.dataIndex === 'status'">
        <div v-if="record.status==='running'">
          <div class="state">
            <div class='state__greenpoint'></div>
            <p class="state__running">运行中</p>
          </div>
        </div>
        <div v-else>
          <div class="state">
            <div class='state__redpoint'></div>
            <p class="state__stopping">已断开</p>
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
import AddNodeForm from '@/components/AddNodeForm';
import { defineComponent, ref, computed, reactive, onBeforeMount } from 'vue';
import { DeploymentUnitOutlined, ClusterOutlined, CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash-es';
import { getNodeInfo, addNodeInfo, deleteNodeInfo, updateNodeInfo } from '@/api/node-api/nodeinfo';
import { getDeclaration } from '@/api/framework-api/declaration';
import { message } from 'ant-design-vue';

export default defineComponent({
  name: 'ServerInfoCard',
  components: {
    DeploymentUnitOutlined,
    ClusterOutlined,
    CheckOutlined,
    EditOutlined,
    AddNodeForm,
  },
  props: {
    //
  },
  setup() {
    // 新增节点弹出框是否可见
    const visible = ref(false);
    const addInfo = ref();
    const handleOk = () => {
      // Todo:
      // const newData = {
      //   key: `${count.value}`,
      //   name: `Edward King ${count.value}`,
      //   ip: 32,
      //   port: `London, Park Lane no. ${count.value}`,
      //   description: `测试节点 ${count.value}`,
      // };
      // dataSource.value.push(newData);
      // addNodeInfo()
    };
    const getInfo = (nodeInfo) => {
      addInfo.value = nodeInfo;
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
        width: '9%',
      },
      {
        title: '操作',
        dataIndex: 'operation',
      },
    ];
    // 显示的数据源
    const dataSource = ref([]);
    // const count = computed(() => dataSource.value.length + 1);
    // 正在编辑的行数据proxy
    const editableData = reactive({});
    // 正在编辑的属性
    const editableElement = ref({});

    const edit = (key, element) => {
      editableData[key] = cloneDeep(dataSource.value.filter((item) => key === item.key)[0]);
      editableElement.value[key] = element;
    };

    const save = (key) => {
      Object.assign(dataSource.value.filter((item) => key === item.key)[0], editableData[key]);
      updateNodeInfo(editableData[key].key, editableData[key].ip, editableData[key].port, editableData[key].name, editableData[key].description);
      // Todo:刷新
      delete editableData[key];
      editableElement.value[key] = '';
    };

    const onDelete = (key) => {
      dataSource.value = dataSource.value.filter((item) => item.key !== key);
      deleteNodeInfo(key);
    };

    const getStatus = (ip, port) => {
      console.log(ip, port);
    };

    const handleAdd = () => {
      visible.value = true;
    };
    onBeforeMount(async () => {
      const data = await getNodeInfo(1, 10);

      data.list.forEach((element, index) => {
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
        // let status = getDeclaration(dataSource.value[index].ip, dataSource.value[index].port);
        // Todo:根据状态赋予status值
      });
    });
    return {
      visible,
      addInfo,
      getInfo,
      handleOk,
      columns,
      onDelete,
      getStatus,
      handleAdd,
      dataSource,
      editableData,
      editableElement,
      edit,
      save,
    };
  },
});
</script>