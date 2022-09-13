<style scoped lang="less">
.title {
  margin-bottom: 15px;
}
.add-attack-method-button {
  margin-bottom: 10px;
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
      <a-button class="add-attack-method-button" @click="addAtkMethodFormVisiable = true">新增方法</a-button>
      <a-modal v-model:visible="addAtkMethodFormVisiable" @ok="AddAtkMethod()" :closable='false' :width="1000">
        <h2>新增攻击方法</h2>
        ahhhh,chicken soup is coming!
      </a-modal>

      <!-- 表格，这里用tableLayout=fixed使之非弹性 -->
      <a-table tableLayout="fixed" :columns="columns" :data-source="attackInfo" :pagination="pagination" @change="(...args) => handleTableChange(...args)">
        <template #bodyCell="{column,record}">
          <template v-if="column.dataIndex === 'operation'">
            <a>新增节点</a>
            <a @click="showDetails(record.attackMethodDetails)"> 详情</a>
          </template>
          <template v-if="column.dataIndex === 'attackMethodPaper'">
            <div class="attack-method-paper">
              <a :href="record.attackMethodPaperUrl" target="_blank">{{record.attackMethodPaper}}</a>
              <a-button type="link">修改</a-button>
            </div>
          </template>
        </template>
        <!-- 附加子表 -->
        <template #expandedRowRender="{record}">
          <SubMenu :attackMethodID="record.attackMethodID"></SubMenu>
        </template>
      </a-table>

      <a-drawer title="方法详情" placement="right" :visible="methodDetailsVisible" :get-container="false" width="30%" :style="{ position: 'fixed' }"
        @close="methodDetailsVisible = false">
        <a @click="editAtkInfo(methodDetails)"> 编辑</a>
        <p v-html="methodDetails"></p>
      </a-drawer>

      <a-modal v-model:visible="editable" @ok="saveAtkDetails()" :closable='false' :width="700">
        <tinyEditor :height="400" :width="650" :initialValue="initAtkDetails" @updateValue="updateValue" />
      </a-modal>
    </template>
  </MainPageNavigation>
</template>

<script>
import { getAtkInfo } from '@/api/atk-api/atkInfo';
import MainPageNavigation from '@/components/MainPageNavigation.vue';
import { defineComponent, ref, onMounted, computed } from 'vue';
import tinyEditor from '@/components/TinyEditor.vue';
import SubMenu from '@/views/node-manage/components/SubMenu.vue';
import AttackDetails from '@/views/test-manage/TestTaskConstruction/components/attack/AttackDetails.vue';

export default defineComponent({
  name: 'AttackMethodBinding',

  components: { MainPageNavigation, tinyEditor, SubMenu, AttackDetails },

  setup() {
    // 新增攻击方法的表单是否可见
    const addAtkMethodFormVisiable = ref(false);
    // 新增攻击方法（未完成）
    const AddAtkMethod = () => {
      //
    };

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
      attackInfo.value = attackInfo.value.concat(atkInfo.list);
      attackInfo.value.forEach((element, index) => {
        element.key = index;
      });
      totalAtkInfo.value = atkInfo.total;
    };

    const loadMoreAttackMethodInfo = async () => {
      await getAttackInfo();
    };

    // 换页面
    const handleTableChange = (newPagination, filters, sorter) => {
      currentPage.value = newPagination.current;
      loadMoreAttackMethodInfo();
    };

    const methodDetails = ref('');
    const methodDetailsVisible = ref(false);
    // 显示某方法详情
    const showDetails = (attackMethodDetails) => {
      methodDetails.value = attackMethodDetails;
      methodDetailsVisible.value = true;
    };

    // 是否编辑详情的弹出框可见
    const editable = ref(false);
    const initAtkDetails = ref('');
    const editAtkInfo = (attackMethodDetails) => {
      initAtkDetails.value = attackMethodDetails;
      editable.value = true;
    };

    // 保存某一方法详情的修改
    const saveAtkDetails = () => {};

    // 拉取攻击信息
    onMounted(async () => {
      await getAttackInfo();
    });

    // 富文本编辑器实时更新后的内容
    const updateValue = (value) => {
      console.log(value);
    };

    return {
      columns,
      addAtkMethodFormVisiable,
      AddAtkMethod,
      editable,
      initAtkDetails,
      editAtkInfo,
      methodDetailsVisible,
      methodDetails,
      showDetails,
      attackInfo,
      pageSize,
      totalAtkInfo,
      currentPage,
      pagination,
      handleTableChange,
      updateValue,
      saveAtkDetails,
    };
  },
});
</script>



