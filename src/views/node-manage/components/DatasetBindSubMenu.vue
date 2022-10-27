<style lang="less" scoped>
.editable-cell {
  position: relative;
  .editable-cell-input-wrapper {
    display: flex;
    align-items: center;
  }
  .editable-cell-text-wrapper {
    display: flex;
    align-items: center;
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
  <a-table :columns="Columns" :data-source="data" :pagination="false" :scroll="{x:1500}">
    <template #bodyCell="{ column,record,text }">
      <template v-if="column.dataIndex === 'operation'">
        <a-popconfirm v-if="data.length" title="确认删除?" okText="确定" cancelText="取消" @confirm="onDelete(record.datasetProviderID)">
          <a>删除</a>
        </a-popconfirm>
      </template>

      <template v-else-if="column.dataIndex === 'datasetSource'">
        <div class="editable-cell">
          <div v-if="editableData[record.datasetProviderID]&&editableElement[record.datasetProviderID]=='datasetSource'" class="editable-cell-input-wrapper">
            <a-input v-model:value="editableData[record.datasetProviderID].datasetSource" @pressEnter="save(record.datasetProviderID)" />
            <check-outlined class="editable-cell-icon-check" @click="save(record.datasetProviderID)" />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || ' ' }}
            <edit-outlined class="editable-cell-icon" @click="edit(record.datasetProviderID,'datasetSource')" />
          </div>
        </div>
      </template>

      <template v-else-if="column.dataIndex === 'bindDatasetName'">

        <div class="editable-cell">
          <div v-if="editableData[record.datasetProviderID]&&editableElement[record.datasetProviderID]=='bindDatasetName'" class="editable-cell-input-wrapper">
            <a-input v-model:value="editableData[record.datasetProviderID].bindDatasetName" @pressEnter="save(record.datasetProviderID)" />
            <check-outlined class="editable-cell-icon-check" @click="save(record.datasetProviderID)" />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || ' ' }}
            <edit-outlined class="editable-cell-icon" @click="edit(record.datasetProviderID,'bindDatasetName')" />
          </div>
        </div>

      </template>

    </template>
  </a-table>
</template>

<script>
import { defineComponent, onBeforeMount, ref, reactive, computed } from 'vue';
import { getDatasetProvider, deleteDatasetProvider, updateDatasetProvider } from '@/api/dataset-api/datasetInfo';
import { DeploymentUnitOutlined, ClusterOutlined, CheckOutlined, EditOutlined, SyncOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash-es';

export default defineComponent({
  name: 'AtkBindSubMenu',
  components: {
    DeploymentUnitOutlined,
    ClusterOutlined,
    CheckOutlined,
    EditOutlined,
    SyncOutlined,
  },
  props: {
    datasetID: {
      type: Number,
      default: -1,
    },
    refreshSubmenu: {
      type: Boolean,
    },
  },

  setup(props, context) {
    const Columns = [
      {
        title: '节点',
        dataIndex: 'nodeName',
        fixed: 'left',
        width: '15%',
      },
      {
        title: '节点路径',
        dataIndex: 'nodePath',
        width: '15%',
      },
      {
        title: '数据源',
        dataIndex: 'datasetSource',
        width: '18%',
      },
      {
        title: '绑定名',
        dataIndex: 'bindDatasetName',
        width: '10%',
      },
      {
        title: '类型',
        dataIndex: 'datasetTypeDesc',
        with: '13%',
      },
      {
        title: '提供标签',
        dataIndex: 'isProvideTags',
        with: '8%',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: '15%',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: '6%',
      },
    ];

    const data = ref();

    // 正在编辑的行数据proxy
    const editableData = reactive({});

    // 正在编辑的属性
    const editableElement = ref({});

    // 编辑
    const edit = (key, element) => {
      editableData[key] = cloneDeep(data.value.filter((item) => key === item.datasetProviderID)[0]);
      console.log(editableData[key]);
      editableElement.value[key] = element;
    };

    // 保存编辑，更为准确和详细的逻辑是先等待success再根据结果修改前端或是报错
    const save = async (key) => {
      Object.assign(data.value.filter((item) => key === item.datasetProviderID)[0], editableData[key]);
      // let success = await updateAtkMethodProvider(
      //   editableData[key].datasetProviderID,
      //   editableData[key].datasetID,
      //   editableData[key].nodeID,
      //   editableData[key].datasetSource,
      //   editableData[key].bindDatasetName
      // );
      delete editableData[key];
      editableElement.value[key] = '';
    };

    // 删除，同上可优化逻辑
    const onDelete = async (key) => {
      data.value = data.value.filter((item) => item.datasetProviderID !== key);
      // let success = await deleteAtkMethodProvider(key);
    };

    onBeforeMount(async () => {
      data.value = await getDatasetProvider(props.datasetID);
      data.value.forEach((element) => {
        element.nodeName = element.nodeInfo.nodeName + element.nodeInfo.nodeID;
        element.nodePath = element.nodeInfo.host + ':' + element.nodeInfo.port;
      });
    });
    return { Columns, data, edit, save, editableData, editableElement, onDelete };
  },
});
</script>