<style scoped lang="less">
.title {
  margin-bottom: 15px;
}
.attack-binding {
  display: flex;
  flex-direction: row;

  &__table {
    padding-right: 30px;
    max-width: 65%;
  }
  &__card {
    width: 35%;
  }
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
      <div class="attack-binding">

        <!-- 这一部分是左边的表格，这里用tableLayout=fixed使之非弹性 -->
        <div class="attack-binding__table">
          <a-table tableLayout="fixed" :columns="columns" :data-source="attackInfo" :pagination="pagination" @change="(...args) => handleTableChange(...args)">
            <template #bodyCell="{column,record}">
              <template v-if="column.dataIndex === 'operation'">
                <a>新增节点</a>
                <a @click="atkDetails.showDetails(record)"> 详情</a>
              </template>
            </template>
            <template #expandedRowRender="{record}">
              <SubMenu :attackMethodID="record.attackMethodID"></SubMenu>
            </template>
          </a-table>
        </div>

        <div class="attack-binding__card">
          <a-card>
            <a-button @click="editAtkInfo()">编辑</a-button>
            <a-modal v-model:visible="editable" @ok="handleOk" :closable='false' :width="700">
              <tinyEditor :height="400" :width="650" :initialValue="string" @updateValue="updateValue" />
            </a-modal>
            <AttackDetails ref="atkDetails">
              <template #extra="{}">
              </template>
            </AttackDetails>
          </a-card>
        </div>
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
        width: '20%',
      },
      {
        title: '类别',
        dataIndex: ['attackMethodType', 'attackMethodTypeName'],
        width: '23%',
      },
      {
        title: '简介',
        dataIndex: 'attackMethodDesc',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '20%',
      },
    ];

    const editable = ref(false);

    const editAtkInfo = () => {
      editable.value = true;
    };

    const attackInfo = ref([]);
    const pageSize = ref(10);
    const totalAtkInfo = ref(0);
    const currentPage = ref(1);

    const dataSource = ref([]);

    const pagination = computed(() => {
      return {
        total: totalAtkInfo.value,
        current: currentPage.value,
        pageSize: pageSize.value,
      };
    });

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
      editAtkInfo,
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



