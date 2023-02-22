<style scoped lang="less">
.title {
  margin-bottom: 15px;
}
.model-paper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.model-desc {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  &__details {
    overflow: auto;
    height: 70px;
  }
}
.model-link {
  word-break: break-all;
}
</style>

<template>
  <MainPageNavigation :selectedKeys="['3']" :openKeys="['sub1']">
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>节点管理</a-breadcrumb-item>
      <a-breadcrumb-item>模型绑定</a-breadcrumb-item>
    </template>

    <template v-slot:content>
      <h2 class="title">模型绑定</h2>
      <AddModelForm @addModelInfoSucceed="addModelInfoSucceed"></AddModelForm>

      <a-table tableLayout="fixed" :columns="columns" :data-source="modelInfo" :pagination="pagination" @change="(...args) => handleTableChange(...args)">
        <template #bodyCell="{column,record}">
          <template v-if="column.dataIndex === 'operation'">
            <NodeBinding></NodeBinding>
            <a @click="showDetails(record)"> 详情</a>
            <a-popconfirm title="确认删除?" okText="确定" cancelText="取消" @confirm="deleteModel(record.modelID)">
              <a> 删除</a>
            </a-popconfirm>
          </template>
          <template v-if="column.dataIndex === 'modelPaper'">
            <div class="model-paper">
              <a class="model-link" :href="record.modelPaperUrl" target="_blank">{{record.modelPaper}}</a>
              <UpdatePaperForm :paper="record.modelPaper" :url="record.modelPaperUrl" @newPaper="(...args)=>updatePaper(args,record)">
              </UpdatePaperForm>
            </div>
          </template>
          <template v-if="column.dataIndex === 'modelDesc'">
            <div class="model-desc">
              <p class="model-desc__details">{{record.modelDesc}}</p>
              <UpdateDesc :oldDesc="record.modelDesc" @newDesc="(...args)=>changeDesc(args,record)"></UpdateDesc>
            </div>
          </template>
        </template>
        <!-- 附加子表 -->
        <template #expandedRowRender="{record}">
          <ModelBindSubMenu :modelID="record.modelID"></ModelBindSubMenu>
        </template>
      </a-table>

      <!-- 右侧详情栏 -->
      <a-drawer title="方法详情" placement="right" :visible="modelDetailsVisible" :get-container="false" width="30%" :style="{ position: 'fixed'}"
        @close="modelDetailsVisible = false">
        <a @click="editAtkInfo(modelSelected.modelDetails)"> 编辑</a>
        <p v-html="modelSelected.modelDetails"></p>
      </a-drawer>

      <!-- 修改详情 -->
      <a-modal v-model:visible="editable" @ok="saveAtkDetails()" :closable='false' :width="700">
        <tinyEditor :height="400" :width="650" :initialValue="initAtkDetails" @updateValue="updateValue" />
      </a-modal>
    </template>
  </MainPageNavigation>
</template>

<script>
import { deleteModelInfo, getModelInfo, updateModelInfo, getModelProvider } from '@/api/model-api/modelInfo';
import MainPageNavigation from '@/components/MainPageNavigation.vue';
import { defineComponent, ref, onMounted, computed } from 'vue';
import tinyEditor from '@/components/TinyEditor.vue';
import ModelBindSubMenu from '@/views/node-manage/components/ModelBindSubMenu.vue';
import AddModelForm from '@/views/node-manage/components/AddModelForm.vue';
import UpdatePaperForm from '@/views/node-manage/components/UpdatePaperForm.vue';
import NodeBinding from '@/views/node-manage/components/NodeBinding.vue';
import UpdateDesc from '@/views/node-manage/components/UpdateDesc.vue';

export default defineComponent({
  name: 'ModelBinding',

  components: { MainPageNavigation, tinyEditor, ModelBindSubMenu, AddModelForm, UpdatePaperForm, NodeBinding, UpdateDesc },

  setup() {
    // 主表格列名
    const columns = [
      {
        title: '模型',
        dataIndex: 'modelName',
        width: '12%',
      },
      {
        title: '类别',
        dataIndex: ['modelType', 'modelTypeName'],
        width: '12%',
      },
      {
        title: '简介',
        dataIndex: 'modelDesc',
        width: '30%',
      },
      {
        title: '参考论文',
        dataIndex: 'modelPaper',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '15%',
      },
    ];

    // 获取的全部攻击方法信息，用作表格数据源
    const modelInfo = ref([]);
    const totalModelInfo = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(5);
    // 用于表格分页
    const pagination = computed(() => {
      return {
        total: totalModelInfo.value,
        current: currentPage.value,
        pageSize: pageSize.value,
      };
    });

    // 获取攻击方法信息
    const getModel = async () => {
      const newModelInfo = await getModelInfo(currentPage.value, pageSize.value);
      modelInfo.value = [];
      modelInfo.value = modelInfo.value.concat(newModelInfo.list);
      modelInfo.value.forEach((element, index) => {
        element.key = index;
      });
      totalModelInfo.value = newModelInfo.total;
    };

    const addModelInfoSucceed = async (value) => {
      await getModel();
    };

    const loadMoreModelInfo = async () => {
      await getModel();
    };

    // 换页面
    const handleTableChange = (newPagination, filters, sorter) => {
      currentPage.value = newPagination.current;
      loadMoreModelInfo();
    };

    const modelSelected = ref('');
    const modelDetailsVisible = ref(false);
    // 显示某方法详情
    const showDetails = (model) => {
      modelSelected.value = model;
      modelDetailsVisible.value = true;
    };

    // 是否编辑详情的弹出框可见
    const editable = ref(false);
    const initAtkDetails = ref('');
    const editAtkInfo = (modelDetails) => {
      initAtkDetails.value = modelDetails;
      editable.value = true;
    };

    const newDetails = ref();

    // 保存某一方法详情的修改
    const saveAtkDetails = async () => {
      let success = await updateModelInfo(
        modelSelected.value.modelID,
        modelSelected.value.modelName,
        modelSelected.value.modelDesc,
        newDetails.value,
        modelSelected.value.modelPaper,
        modelSelected.value.modelPaperUrl,
        modelSelected.value.modelTypeID
      );
      editable.value = false;
      modelSelected.value.modelDetails = newDetails.value;
    };

    const changeDesc = async (args, record) => {
      await updateModelInfo(record.modelID, record.modelName, args[0], record.modelDetails, record.modelPaper, record.modelPaperUrl, record.modelTypeID);
      modelInfo.value[record.key].modelDesc = args[0];
    };

    const updatePaper = async (args, record) => {
      modelInfo.value[record.key].modelPaper = args[0].paper;
      modelInfo.value[record.key].modelPaperUrl = args[0].url;

      await updateModelInfo(record.modelID, record.modelName, record.modelDesc, record.modelDetails, args[0].paper, args[0].url, record.modelTypeID);
    };

    // 拉取攻击信息
    onMounted(async () => {
      await getModel();
    });

    // 富文本编辑器实时更新后的内容
    const updateValue = (value) => {
      newDetails.value = value;
      console.log(value);
    };

    const addNodeVisiable = ref(false);

    const deleteModel = async (modelID) => {
      let success = await deleteModelInfo(modelID);
      if (success) totalModelInfo.value--;
      if (totalModelInfo.value % pageSize.value == 0 && currentPage.value > 1) currentPage.value--;
      await getModel();
    };

    return {
      columns,
      editable,
      changeDesc,
      initAtkDetails,
      editAtkInfo,
      modelDetailsVisible,
      modelSelected,
      newDetails,
      addModelInfoSucceed,
      showDetails,
      updatePaper,
      modelInfo,
      pageSize,
      totalModelInfo,
      currentPage,
      pagination,
      handleTableChange,
      updateValue,
      saveAtkDetails,
      addNodeVisiable,
      deleteModel,
    };
  },
});
</script>