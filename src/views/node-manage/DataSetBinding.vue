<style scoped lang="less">
.title {
  margin-bottom: 15px;
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
      <AddDatasetForm @addAtkInfoSucceed="addAtkInfoSucceed"></AddDatasetForm>
      <!-- 表格，这里用tableLayout=fixed使之非弹性 -->
      <a-table tableLayout="fixed" :columns="columns" :data-source="datasetInfo" :pagination="pagination" @change="(...args) => handleTableChange(...args)">
        <template #bodyCell="{column,record}">
          <template v-if="column.dataIndex === 'operation'">
            <NodeBinding></NodeBinding>
            <a> 删除</a>
          </template>
          <template v-if="column.dataIndex === 'datasetDesc'">
            <div style="overflow:scroll;height:150px">{{record.datasetDesc}}</div>
          </template>
        </template>
        <!-- 附加子表 -->
        <template #expandedRowRender="{record}">
          <SubMenu :attackMethodID="record.datasetID"></SubMenu>
        </template>
      </a-table>

    </template>
  </MainPageNavigation>
</template>

<script>
import { getDatasetInfo } from '@/api/dataset-api/datasetInfo';
import MainPageNavigation from '@/components/MainPageNavigation.vue';
import { defineComponent, ref, onMounted, computed } from 'vue';
import tinyEditor from '@/components/TinyEditor.vue';
import SubMenu from '@/views/node-manage/components/SubMenu.vue';
import AttackDetails from '@/views/test-manage/TestTaskConstruction/components/attack/AttackDetails.vue';
import AddDatasetForm from '@/views/node-manage/components/AddDatasetForm.vue';
import UpdatePaperForm from '@/views/node-manage/components/UpdatePaperForm.vue';
import NodeBinding from '@/views/node-manage/components/NodeBinding.vue';

export default defineComponent({
  name: 'AttackMethodBinding',

  components: { MainPageNavigation, tinyEditor, SubMenu, AttackDetails, AddDatasetForm, UpdatePaperForm, NodeBinding },

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
    const totalAtkInfo = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(5);
    // 用于表格分页
    const pagination = computed(() => {
      return {
        total: totalAtkInfo.value,
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
      totalAtkInfo.value = dataInfo.total;
    };

    const addAtkInfoSucceed = (value) => {
      getDataSetInfo();
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

    // 是否编辑详情的弹出框可见
    const editable = ref(false);
    const initAtkDetails = ref('');
    const editAtkInfo = (attackMethodDetails) => {
      initAtkDetails.value = attackMethodDetails;
      editable.value = true;
    };

    const newDetails = ref();

    // 拉取攻击信息
    onMounted(async () => {
      await getDataSetInfo();
    });

    // 富文本编辑器实时更新后的内容
    const updateValue = (value) => {
      newDetails.value = value;
      console.log(value);
    };

    const addNodeVisiable = ref(false);

    return {
      columns,
      editable,
      initAtkDetails,
      editAtkInfo,
      methodDetailsVisible,
      methodSelected,
      newDetails,
      addAtkInfoSucceed,
      showDetails,
      datasetInfo,
      pageSize,
      totalAtkInfo,
      currentPage,
      pagination,
      handleTableChange,
      updateValue,
      addNodeVisiable,
    };
  },
});
</script>
