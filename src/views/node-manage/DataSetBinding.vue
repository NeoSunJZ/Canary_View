<style scoped lang="less">
.title {
  margin-bottom: 15px;
}
.dataset-desc {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  &__details {
    overflow: auto;
    height: 70px;
  }
}
.dataset-website {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.dataset-link {
  word-break: break-all;
}
</style>

<template>
  <MainPageNavigation :selectedKeys="['2']" :openKeys="['sub1']">
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>节点管理</a-breadcrumb-item>
      <a-breadcrumb-item>数据集绑定</a-breadcrumb-item>
    </template>

    <template v-slot:content>
      <h2 class="title">数据集绑定</h2>
      <AddDatasetForm @addDatasetSucceed="addDatasetSucceed"></AddDatasetForm>
      <!-- 表格，这里用tableLayout=fixed使之非弹性 -->
      <a-table tableLayout="fixed" :columns="columns" :data-source="datasetInfo" :pagination="pagination" @change="(...args) => handleTableChange(...args)">
        <template #bodyCell="{column,record}">
          <template v-if="column.dataIndex === 'operation'">
            <NodeBinding></NodeBinding>
            <a-popconfirm title="确认删除?" okText="确定" cancelText="取消" @confirm="deleteDataset(record.datasetID)">
              <a> 删除</a>
            </a-popconfirm>
          </template>

          <template v-if="column.dataIndex === 'datasetWebsite'">
            <div class="dataset-website">
              <a class="dataset-link" :href="record.datasetWebsite" target="_blank">{{record.datasetWebsite}}</a>
              <UpdateDatasetWebsite :url="record.datasetWebsite" @newUrl="(...args)=>updateUrl(args,record)">
              </UpdateDatasetWebsite>
            </div>
          </template>

          <template v-if="column.dataIndex === 'datasetDesc'">
            <div class="dataset-desc">
              <p class="dataset-desc__details">{{record.datasetDesc}}</p>
              <UpdateDesc :oldDesc="record.datasetDesc" @newDesc="(...args)=>changeDesc(args,record)"></UpdateDesc>
            </div>
          </template>

        </template>
        <!-- 附加子表 -->
        <template #expandedRowRender="{record}">
          <DatasetBindSubMenu :datasetID="record.datasetID"></DatasetBindSubMenu>
        </template>
      </a-table>

    </template>
  </MainPageNavigation>
</template>

<script>
import { getDatasetInfo, updateDatasetInfo, deleteDatasetInfo } from '@/api/dataset-api/datasetInfo';
import MainPageNavigation from '@/components/MainPageNavigation.vue';
import { defineComponent, ref, onMounted, computed, reactive } from 'vue';
import tinyEditor from '@/components/TinyEditor.vue';
import DatasetBindSubMenu from '@/views/node-manage/components/DatasetBindSubMenu.vue';
import AttackDetails from '@/views/test-manage/TestTaskConstruction/components/attack/AttackDetails.vue';
import AddDatasetForm from '@/views/node-manage/components/AddDatasetForm.vue';
import NodeBinding from '@/views/node-manage/components/NodeBinding.vue';
import UpdateDesc from '@/views/node-manage/components/UpdateDesc.vue';
import UpdateDatasetWebsite from '@/views/node-manage/components/UpdateDatasetWebsite.vue';

export default defineComponent({
  name: 'AttackMethodBinding',

  components: { MainPageNavigation, tinyEditor, DatasetBindSubMenu, AttackDetails, AddDatasetForm, NodeBinding, UpdateDesc, UpdateDatasetWebsite },

  setup() {
    // 主表格列名
    const columns = [
      {
        title: '数据集',
        dataIndex: 'datasetName',
        width: '15%',
      },
      {
        title: '网址',
        dataIndex: 'datasetWebsite',
        width: '20%',
      },
      {
        title: '简介',
        dataIndex: 'datasetDesc',
        width: '40%',
      },
      {
        title: '类数量',
        dataIndex: 'datasetClassNumber',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '12%',
      },
    ];

    // 获取的全部攻击方法信息，用作表格数据源
    const datasetInfo = ref([]);
    const totalDatasetInfo = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(5);
    // 用于表格分页
    const pagination = computed(() => {
      return {
        total: totalDatasetInfo.value,
        current: currentPage.value,
        pageSize: pageSize.value,
      };
    });

    // 获取攻击方法信息
    const getDataSetInfo = async () => {
      const dataInfo = await getDatasetInfo(currentPage.value, pageSize.value);
      datasetInfo.value = [];
      datasetInfo.value = datasetInfo.value.concat(dataInfo.list);
      datasetInfo.value.forEach((element, index) => {
        element.key = index;
      });
      totalDatasetInfo.value = dataInfo.total;
    };

    const addDatasetSucceed = async (value) => {
      await getDataSetInfo();
    };

    const loadMoreAttackMethodInfo = async () => {
      await getDataSetInfo();
    };

    // 换页面
    const handleTableChange = (newPagination, filters, sorter) => {
      currentPage.value = newPagination.current;
      loadMoreAttackMethodInfo();
    };

    const methodSelected = ref('');
    const methodDetailsVisible = ref(false);
    // 显示某方法详情
    const showDetails = (attackMethod) => {
      methodSelected.value = attackMethod;
      methodDetailsVisible.value = true;
    };

    // 拉取攻击信息
    onMounted(async () => {
      await getDataSetInfo();
    });

    const addNodeVisiable = ref(false);

    const deleteDataset = async (datasetID) => {
      let success = await deleteDatasetInfo(datasetID);
      if (success) totalDatasetInfo.value--;
      if (totalDatasetInfo.value % pageSize.value == 0 && currentPage.value > 1) currentPage.value--;
      await getDataSetInfo();
    };

    const changeDesc = async (args, record) => {
      let success = await updateDatasetInfo(record.datasetID, record.datasetName, args[0], record.datasetWebsite, record.datasetClassNumber);
      datasetInfo.value[record.key].datasetDesc = args[0];
    };

    const changeWebVisible = ref(false);

    const formState = reactive({
      website: '',
    });

    const updateUrl = async (args, record) => {
      console.log(args);
      await updateDatasetInfo(record.datasetID, record.datasetName, record.datasetDesc, args[0], record.datasetClassNumber);
      datasetInfo.value[record.key].datasetWebsite = args[0];
    };

    const rules = {
      //
    };

    const layout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 21,
      },
    };

    return {
      layout,
      rules,
      formState,

      updateUrl,
      changeWebVisible,
      columns,
      changeDesc,
      methodDetailsVisible,
      methodSelected,

      addDatasetSucceed,
      showDetails,
      datasetInfo,
      pageSize,
      totalDatasetInfo,
      currentPage,
      pagination,
      handleTableChange,
      addNodeVisiable,
      deleteDataset,
    };
  },
});
</script>
