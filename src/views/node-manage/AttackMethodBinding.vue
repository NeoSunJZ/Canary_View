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
          <a-table :row-selection="rowSelection" :columns="columns" :data-source="data">
            <template #bodyCell="{ column, text }">
              <template v-if="column.dataIndex === 'name'">
                <a>{{ text }}</a>
              </template>
            </template>
          </a-table>
        </div>
        <div>
          <a-card class="attack-binding__card">
            <h3>详情</h3>
          </a-card>
        </div>
      </div>

    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';

import { defineComponent } from 'vue';
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
];
export default defineComponent({
  name: 'AttackMethodBinding',
  components: { MainPageNavigation },
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
    return {
      data,
      columns,
      rowSelection,
    };
  },
});
</script>



