<style scoped lang="less">
.title {
  margin-bottom: 15px;
}
.attack-binding {
  display: flex;
  flex-direction: row;
  &__table {
    margin-right: 30px;
  }
  &__card {
    width: 600px;
    height: 700px;
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
        <div class="attack-binding__table">
          <a-table :row-selection="rowSelection" 
          :columns="columns" 
          :data-source="attackInfo"
          :pagination="pagination"
          @change="(...args) => handleTableChange(...args)">
            <template #bodyCell="{ column }">
              <template v-if="column.dataIndex === 'operation'">
                <a>详情</a>
              </template>
              
            </template>
          </a-table>
        </div>
        <div>
          <a-card class="attack-binding__card">
            <h3>详情</h3>
            <tinyEditor :height="300" :width="500" :initialValue="string" @updateValue="updateValue">

            </tinyEditor>

            <a-divider></a-divider>
            <a-button>新增节点</a-button>



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

const columns = [
  {
    title: 'Name',
    dataIndex: 'attackMethodName',
  },
  {
    title: 'Type',
    dataIndex: ["attackMethodType","attackMethodTypeName"],
  },
  {
    title: ' ',
    dataIndex: 'operation',
  },
];

export default defineComponent({
  name: 'AttackMethodBinding',
  components: { MainPageNavigation, tinyEditor },
  setup() {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
        // Column configuration not to be checked
        name: record.name,
      }),
    };

    const attackInfo = ref([]);
    const pageSize = ref(5);
    const totalAtkInfo = ref(0);
    const currentPage = ref(1);

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
      totalAtkInfo.value = atkInfo.total;
    };

    const handleTableChange = (newPagination, filters, sorter) => {
      currentPage.value = newPagination.current;
      loadMoreAttackMethodInfo();
      console.log(pagination);
    };

    const updateValue = (value) => {
      console.log(value);
    }

    return {
      columns,
      rowSelection,
      attackInfo,
      pageSize,
      totalAtkInfo,
      currentPage,
      pagination,
      handleTableChange,
      updateValue,

    };
  },
});

</script>



