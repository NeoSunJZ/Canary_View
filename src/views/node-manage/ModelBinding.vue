<style scoped lang="less">
.title {
  margin-bottom: 15px;
}
.attack-method-paper {
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
            <a> 删除</a>
          </template>
          <template v-if="column.dataIndex === 'modelPaper'">
            <div class="attack-method-paper">
              <a :href="record.modelPaperUrl" target="_blank">{{record.modelPaper}}</a>
              <UpdatePaperForm :methodSelected="record" @updatePaper="updatePaper"></UpdatePaperForm>
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
          <ModelBindSubMenu :attackMethodID="record.attackMethodID"></ModelBindSubMenu>
        </template>
      </a-table>

      <!-- 右侧详情栏 -->
      <a-drawer title="方法详情" placement="right" :visible="modelDetailsVisible" :get-container="false" width="30%" :style="{ position: 'fixed'}"
        @close="modelDetailsVisible = false">
        <a @click="editAtkInfo(methodSelected.modelDetails)"> 编辑</a>
        <p v-html="methodSelected.modelDetails"></p>
      </a-drawer>

      <!-- 修改详情 -->
      <a-modal v-model:visible="editable" @ok="saveAtkDetails()" :closable='false' :width="700">
        <tinyEditor :height="400" :width="650" :initialValue="initAtkDetails" @updateValue="updateValue" />
      </a-modal>
    </template>
  </MainPageNavigation>
</template>

<script>
import { getModelInfo, getModelProvider } from '@/api/model-api/modelInfo';
import MainPageNavigation from '@/components/MainPageNavigation.vue';
import { defineComponent, ref, onMounted, computed } from 'vue';
import tinyEditor from '@/components/TinyEditor.vue';
import ModelBindSubMenu from '@/views/node-manage/components/ModelBindSubMenu.vue';
import AddModelForm from '@/views/node-manage/components/AddModelForm.vue';
import UpdatePaperForm from '@/views/node-manage/components/UpdatePaperForm.vue';
import NodeBinding from '@/views/node-manage/components/NodeBinding.vue';
import UpdateDesc from '@/views/node-manage/components/UpdateDesc.vue';

export default defineComponent({
  name: 'AttackMethodBinding',

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
    const getAttackInfo = async () => {
      const atkInfo = await getModelInfo(currentPage.value, pageSize.value);
      modelInfo.value = [];
      modelInfo.value = modelInfo.value.concat(atkInfo.list);
      modelInfo.value.forEach((element, index) => {
        element.key = index;
      });
      totalModelInfo.value = atkInfo.total;
    };

    const addModelInfoSucceed = (value) => {
      getAttackInfo();
    };

    const loadMoreAttackMethodInfo = async () => {
      await getAttackInfo();
    };

    // 换页面
    const handleTableChange = (newPagination, filters, sorter) => {
      currentPage.value = newPagination.current;
      loadMoreAttackMethodInfo();
    };

    const methodSelected = ref('');
    const modelDetailsVisible = ref(false);
    // 显示某方法详情
    const showDetails = (attackMethod) => {
      methodSelected.value = attackMethod;
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
      // let success = await updateAtkMethod(
      //   methodSelected.value.attackMethodID,
      //   methodSelected.value.attackMethodName,
      //   methodSelected.value.attackMethodDesc,
      //   newDetails.value,
      //   methodSelected.value.modelPaper,
      //   methodSelected.value.modelPaperUrl,
      //   methodSelected.value.attackMethodTypeID
      // );
      // editable.value = false;
      // methodSelected.value.modelDetails = newDetails.value;
    };

    const changeDesc = async (args, record) => {
      // await updateAtkMethod(
      //   record.attackMethodID,
      //   record.attackMethodName,
      //   descTemp.value,
      //   record.attackMethodDetails,
      //   record.attackMethodPaper,
      //   record.attackMethodPaperUrl,
      //   record.attackMethodTypeID
      // );
      // attackInfo.value[record.key].attackMethodDesc = descTemp.value;
      // descTemp.value = '';
    };

    const updatePaper = (key, newPaper) => {
      modelInfo.value[key].modelPaper = newPaper.paper;
      modelInfo.value[key].modelPaperUrl = newPaper.url;
    };

    // 拉取攻击信息
    onMounted(async () => {
      await getAttackInfo();
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
      changeDesc,
      initAtkDetails,
      editAtkInfo,
      modelDetailsVisible,
      methodSelected,
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
    };
  },
});
</script>