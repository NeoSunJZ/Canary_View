<style scoped lang="less">
.title {
  margin-bottom: 15px;
}
.button {
  margin-bottom: 10px;
}
.attack-binding {
  display: flex;
  flex-direction: row;
}
.attack-method-paper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
      <a-button class="button">新增方法</a-button>
      <div class="attack-binding">

        <!-- 这一部分是左边的表格，这里用tableLayout=fixed使之非弹性 -->
        <a-table tableLayout="fixed" :columns="columns" :data-source="attackInfo" :pagination="pagination" @change="(...args) => handleTableChange(...args)">
          <template #bodyCell="{column,record}">
            <template v-if="column.dataIndex === 'operation'">
              <a>新增节点</a>
              <a @click="showDetais(record.attackMethodDetails)"> 详情</a>
            </template>
            <template v-if="column.dataIndex === 'attackMethodPaper'">
              <div class="attack-method-paper">
                <a :href="record.attackMethodPaperUrl" target="_blank">{{record.attackMethodPaper}}</a>
                <a-button type="link">修改</a-button>

              </div>

            </template>
          </template>
          <template #expandedRowRender="{record}">
            <SubMenu :attackMethodID="record.attackMethodID"></SubMenu>
          </template>
        </a-table>
        <a-drawer title="方法详情" placement="right" :visible="methodDetailsVisible" :get-container="false" width="30%" :style="{ position: 'fixed' }"
          @close="methodDetailsVisible = false">
          <a @click="editAtkInfo(methodDetails)"> 编辑</a>
          <p v-html="methodDetails"></p>
        </a-drawer>
        <a-modal v-model:visible="editable" @ok="handleOk" :closable='false' :width="700">
          <tinyEditor :height="400" :width="650" :initialValue="initAtkDetails" @updateValue="updateValue" />
        </a-modal>
      </div>

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

    const editable = ref(false);
    const initAtkDetails = ref('');
    const editAtkInfo = (attackMethodDetails) => {
      initAtkDetails.value = attackMethodDetails;
      editable.value = true;
    };

    const attackInfo = ref([]);
    const pageSize = ref(10);
    const totalAtkInfo = ref(0);
    const currentPage = ref(1);
    const dataSource = ref([]);
    const methodDetailsVisible = ref(false);
    const methodDetails = ref('');

    const pagination = computed(() => {
      return {
        total: totalAtkInfo.value,
        current: currentPage.value,
        pageSize: pageSize.value,
      };
    });

    const showDetais = (attackMethodDetails) => {
      methodDetails.value = attackMethodDetails;
      methodDetailsVisible.value = true;
    };

    // 拉取攻击信息
    onMounted(async () => {
      await getAttackInfo();
    });

    const loadMoreAttackMethodInfo = async () => {
      await getAttackInfo();
    };

    const getAttackInfo = async () => {
      const atkInfo = await getAtkInfo(currentPage.value, pageSize.value);
      attackInfo.value = attackInfo.value.concat(atkInfo.list);
      attackInfo.value.forEach((element, index) => {
        element.key = index;
      });
      totalAtkInfo.value = atkInfo.total;
    };

    const handleTableChange = (newPagination, filters, sorter) => {
      currentPage.value = newPagination.current;
      loadMoreAttackMethodInfo();
    };

    const updateValue = (value) => {
      console.log(value);
    };

    const handleOk = () => {};

    const atkDetails = ref({});

    return {
      columns,
      editable,
      initAtkDetails,
      editAtkInfo,
      methodDetailsVisible,
      methodDetails,
      showDetais,
      attackInfo,
      pageSize,
      totalAtkInfo,
      currentPage,
      pagination,
      dataSource,
      atkDetails,
      handleTableChange,
      updateValue,
      handleOk,
    };
  },
});
</script>



