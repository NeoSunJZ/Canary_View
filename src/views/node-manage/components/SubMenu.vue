<style lang="less" scoped>
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
  <a-table :columns="Columns" :data-source="data" :pagination="false" :scroll="{x:1000}">
    <template #bodyCell="{ column,record,text }">
      <template v-if="column.dataIndex === 'operation'">
        <a-popconfirm v-if="data.length" title="确认删除?" @confirm="onDelete(record.attackMethodProviderID)">
          <a>删除</a>
        </a-popconfirm>
      </template>

      <template v-else-if="column.dataIndex === 'attackMethodSource'">
        <div class="editable-cell">
          <div v-if="editableData[record.attackMethodProviderID]&&editableElement[record.attackMethodProviderID]=='attackMethodSource'"
            class="editable-cell-input-wrapper">
            <a-input v-model:value="editableData[record.attackMethodProviderID].attackMethodSource" @pressEnter="save(record.attackMethodProviderID)" />
            <check-outlined class="editable-cell-icon-check" @click="save(record.attackMethodProviderID)" />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || ' ' }}
            <edit-outlined class="editable-cell-icon" @click="edit(record.attackMethodProviderID,'attackMethodSource')" />
          </div>
        </div>
      </template>

      <template v-else-if="column.dataIndex === 'bindAttackMethodName'">

        <div class="editable-cell">
          <div v-if="editableData[record.attackMethodProviderID]&&editableElement[record.attackMethodProviderID]=='bindAttackMethodName'"
            class="editable-cell-input-wrapper">
            <a-input v-model:value="editableData[record.attackMethodProviderID].bindAttackMethodName" @pressEnter="save(record.attackMethodProviderID)" />
            <check-outlined class="editable-cell-icon-check" @click="save(record.attackMethodProviderID)" />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || ' ' }}
            <edit-outlined class="editable-cell-icon" @click="edit(record.attackMethodProviderID,'bindAttackMethodName')" />
          </div>
        </div>

      </template>

    </template>
  </a-table>
</template>

<script>
import { defineComponent, onBeforeMount, ref, reactive } from 'vue';
import { getAtkProvider, updateAtkMethodProvider, deleteAtkMethodProvider } from '@/api/atk-api/atkInfo';
import { DeploymentUnitOutlined, ClusterOutlined, CheckOutlined, EditOutlined, SyncOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash-es';

export default defineComponent({
  name: 'SubMenu',
  components: {
    DeploymentUnitOutlined,
    ClusterOutlined,
    CheckOutlined,
    EditOutlined,
    SyncOutlined,
  },
  props: {
    attackMethodID: {
      type: Number,
      default: -1,
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
        width: '20%',
      },
      {
        title: '方法源',
        dataIndex: 'attackMethodSource',
        width: '15%',
      },
      {
        title: '绑定名',
        dataIndex: 'bindAttackMethodName',
        width: '15%',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: '20%',
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

    const edit = (key, element) => {
      editableData[key] = cloneDeep(data.value.filter((item) => key === item.attackMethodProviderID)[0]);
      console.log(editableData[key]);
      editableElement.value[key] = element;
    };

    const save = async (key) => {
      Object.assign(data.value.filter((item) => key === item.attackMethodProviderID)[0], editableData[key]);
      let success = await updateAtkMethodProvider(
        editableData[key].attackMethodProviderID,
        editableData[key].attackMethodID,
        editableData[key].nodeID,
        editableData[key].attackMethodSource,
        editableData[key].bindAttackMethodName
      );
      delete editableData[key];
      editableElement.value[key] = '';
    };

    const onDelete = async (key) => {
      data.value = data.value.filter((item) => item.attackMethodProviderID !== key);
      let success = await deleteAtkMethodProvider(key);
    };

    onBeforeMount(async () => {
      data.value = await getAtkProvider(props.attackMethodID);
      data.value.forEach((element) => {
        element.nodeName = element.nodeInfo.nodeName + element.nodeInfo.nodeID;
        element.nodePath = element.nodeInfo.host + ':' + element.nodeInfo.port;
      });
    });
    return { Columns, data, edit, save, editableData, editableElement, onDelete };
  },
});
</script>