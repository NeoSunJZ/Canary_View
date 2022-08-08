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
          <a-table :row-selection="rowSelection" :columns="columns" :data-source="attackInfo" :pagination="pagination"
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
            <a-button @click="editAtkInfo()">编辑</a-button>
            <a-modal v-model:visible="editable" @ok="handleOk" :closable='false' :width="700">
              <tinyEditor :height="400" :width="650" :initialValue="string" @updateValue="updateValue" />
            </a-modal>

            <div>
              <a-card style="height:350px">
                <div v-html='"<h1>hhh</h1><p>这里测试一下v-html</p>"'>
                </div>
              </a-card>
            </div>
            <a-divider></a-divider>
            <a-button>新增节点</a-button>

            <a-card>
              <div style="display:flex; flex-direction:row; flex:1; overflow-x:scroll;">
                <a-card v-for="(item,index) in dataSource" class="server" size="small" :key="index" style="min-width: 300px;">
                  <div v-if="dataSource.length == 0">
                    <p>请您新增服务节点</p>
                  </div>
                  <div v-else>
                    <div>
                      <cluster-outlined class="server__icon" /><span class="server__title">服务节点 -
                        {{item.appName }}</span>
                    </div>
                    <div>
                      IP地址 - {{ item.ip }}
                      <a-divider type="vertical" />
                      端口 - {{ item.port }}
                    </div>
                    <div class="server__detail">
                      <a>详情</a>
                      <a-divider type="vertical" /><a @click="showSelector">修改节点</a>
                      <!-- 对话框用于更换节点 -->
                    </div>
                  </div>
                </a-card>
              </div>
            </a-card>

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
    dataIndex: ['attackMethodType', 'attackMethodTypeName'],
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
    const editable = ref(false);

    const editAtkInfo = () => {
      editable.value = true;
    };
    const attackInfo = ref([]);
    const pageSize = ref(10);
    const totalAtkInfo = ref(0);
    const currentPage = ref(1);

    const dataSource = ref([
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        ip: '127.0.0.1',
        port: '8888',
        appID: '1',
        appName: 'Server 1',
        appDesc: '默认服务描述',
        appStatus: 'Running',
        createTime: '2022-01-02 13:40:20',
        createUser: 'admin',
        isDisabled: 'false',
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        ip: '127.0.0.2',
        port: '8888',
        appID: '2',
        appName: 'Server 2',
        appDesc: 'Alpha测试',
        appStatus: 'Stop',
        createTime: '2022-01-01 10:41:20',
        createUser: 'admin',
        isDisabled: 'false',
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        ip: '127.0.0.3',
        port: '8888',
        appID: '3',
        appName: 'Server 3',
        appDesc: 'Beta测试',
        appStatus: 'Running',
        createTime: '2021-01-01 10:41:20',
        createUser: 'admin',
        isDisabled: 'false',
      },
      {
        key: '4',
        name: 'Disabled User',
        age: 99,
        address: 'Sidney No. 1 Lake Park',
        ip: '127.0.0.4',
        port: '8888',
        appID: '3',
        appName: 'Server 4',
        appDesc: 'Beta测试',
        appStatus: 'Running',
        createTime: '2021-01-01 10:41:20',
        createUser: 'admin',
        isDisabled: 'false',
      },
    ]);

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
    };

    return {
      columns,
      rowSelection,
      editable,
      editAtkInfo,
      attackInfo,
      pageSize,
      totalAtkInfo,
      currentPage,
      pagination,
      dataSource,
      handleTableChange,
      updateValue,
    };
  },
});
</script>



