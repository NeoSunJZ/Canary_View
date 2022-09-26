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
</style>

<template>
  <MainPageNavigation :selectedKeys="['4']" :openKeys="['sub1']">
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>节点管理</a-breadcrumb-item>
      <a-breadcrumb-item>攻击方法绑定</a-breadcrumb-item>
    </template>

    <template v-slot:content>
      <h2 class="title">攻击方法绑定</h2>
      <AddAtkMethodForm @addAtkInfoSucceed="addAtkInfoSucceed"></AddAtkMethodForm>
      <!-- 表格，这里用tableLayout=fixed使之非弹性 -->
      <a-table tableLayout="fixed" :columns="columns" :data-source="attackInfo" :pagination="pagination" @change="(...args) => handleTableChange(...args)">
        <template #bodyCell="{column,record}">
          <template v-if="column.dataIndex === 'operation'">
            <NodeBinding></NodeBinding>
            <a @click="showDetails(record)"> 详情</a>
            <a> 删除</a>
          </template>
          <template v-if="column.dataIndex === 'attackMethodPaper'">
            <div class="attack-method-paper">
              <a :href="record.attackMethodPaperUrl" target="_blank">{{record.attackMethodPaper}}</a>
              <UpdatePaperForm :methodSelected="record" @updatePaper="updatePaper"></UpdatePaperForm>
            </div>
          </template>
        </template>
        <!-- 附加子表 -->
        <template #expandedRowRender="{record}">
          <SubMenu :attackMethodID="record.attackMethodID"></SubMenu>
        </template>
      </a-table>

      <!-- 右侧详情栏 -->
      <a-drawer title="方法详情" placement="right" :visible="methodDetailsVisible" :get-container="false" width="30%" :style="{ position: 'fixed'}"
        @close="methodDetailsVisible = false">
        <a @click="editAtkInfo(methodSelected.attackMethodDetails)"> 编辑</a>
        <p v-html="methodSelected.attackMethodDetails"></p>
      </a-drawer>

      <!-- 修改详情 -->
      <a-modal v-model:visible="editable" @ok="saveAtkDetails()" :closable='false' :width="700">
        <tinyEditor :height="400" :width="650" :initialValue="initAtkDetails" @updateValue="updateValue" />
      </a-modal>
    </template>
  </MainPageNavigation>
</template>

<script>
import { getAtkInfo, updateAtkMethod } from '@/api/atk-api/atkInfo';
import MainPageNavigation from '@/components/MainPageNavigation.vue';
import { defineComponent, ref, onMounted, computed } from 'vue';
import tinyEditor from '@/components/TinyEditor.vue';
import SubMenu from '@/views/node-manage/components/SubMenu.vue';
import AttackDetails from '@/views/test-manage/TestTaskConstruction/components/attack/AttackDetails.vue';
import AddAtkMethodForm from '@/views/node-manage/components/AddAtkMethodForm.vue';
import UpdatePaperForm from '@/views/node-manage/components/UpdatePaperForm.vue';
import NodeBinding from '@/views/node-manage/components/NodeBinding.vue';

export default defineComponent({
  name: 'AttackMethodBinding',

  components: { MainPageNavigation, tinyEditor, SubMenu, AttackDetails, AddAtkMethodForm, UpdatePaperForm, NodeBinding },

  setup() {
    // 主表格列名
    const columns = [
      {
        title: '方法',
        dataIndex: 'attackMethodName',
        width: '15%',
      },
      {
        title: '类别',
        dataIndex: ['attackMethodType', 'attackMethodTypeName'],
        width: '15%',
      },
      {
        title: '简介',
        dataIndex: 'attackMethodDesc',
        width: '20%',
      },
      {
        title: '参考论文',
        dataIndex: 'attackMethodPaper',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '15%',
      },
    ];

    // 获取的全部攻击方法信息，用作表格数据源
    const attackInfo = ref([]);
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
    const getAttackInfo = async () => {
      const atkInfo = await getAtkInfo(currentPage.value, pageSize.value);
      attackInfo.value = [];
      attackInfo.value = attackInfo.value.concat(atkInfo.list);
      attackInfo.value.forEach((element, index) => {
        element.key = index;
      });
      totalAtkInfo.value = atkInfo.total;
    };

    const addAtkInfoSucceed = (value) => {
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

    // 保存某一方法详情的修改
    const saveAtkDetails = async () => {
      let success = await updateAtkMethod(
        methodSelected.value.attackMethodID,
        methodSelected.value.attackMethodName,
        methodSelected.value.attackMethodDesc,
        newDetails.value,
        methodSelected.value.attackMethodPaper,
        methodSelected.value.attackMethodPaperUrl,
        methodSelected.value.attackMethodTypeID
      );
      editable.value = false;
      methodSelected.value.attackMethodDetails = newDetails.value;
    };

    const updatePaper = (key, newPaper) => {
      attackInfo.value[key].attackMethodPaper = newPaper.paper;
      attackInfo.value[key].attackMethodPaperUrl = newPaper.url;
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
      initAtkDetails,
      editAtkInfo,
      methodDetailsVisible,
      methodSelected,
      newDetails,
      addAtkInfoSucceed,
      showDetails,
      updatePaper,
      attackInfo,
      pageSize,
      totalAtkInfo,
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