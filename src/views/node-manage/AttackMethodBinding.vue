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
      align-self: flex-end;
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
          <Layout>
            <Header>header</Header>
            <Layout>
              <Content>main content</Content>
            </Layout>
            <a-table :data-source="data" :scroll="{  x: 2000 }">
              <a-col :span="12" v-for="(item,index) in data" :value="index" :key="index">
                <a-badge-ribbon :text="serverStatus.text" :color="serverStatus.color">
                  <a-card class="server" size="small">
                    <div v-if="data.length == 0">
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
                        <a-divider type="vertical" /><a @click="showSelector">删除节点</a>
                        <!-- 对话框用于更换节点 -->
                      </div>
                    </div>
                  </a-card>
                </a-badge-ribbon>
              </a-col>
            </a-table>
          </Layout>
        </div>
      </div>
    </template>
  </MainPageNavigation>
</template>

<script>
  import MainPageNavigation from '@/components/MainPageNavigation.vue';

  import {
    defineComponent,
    ref,
    computed,
    onBeforeMount
  } from 'vue';
  import {
    getDeclaration
  } from '@/api/framework-api/declaration';
  import {
    DeploymentUnitOutlined,
    ClusterOutlined
  } from '@ant-design/icons-vue';
  const columns = [{
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

  export default ({

    name: 'AttackMethodBinding',
    components: {
      DeploymentUnitOutlined,
      ClusterOutlined,
      MainPageNavigation,
    },
    props: {
      //
    },
    setup(props, context) {
      const data = [{
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
      ];
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

      const visible = ref(false);
      const selectedServerIndex = ref(0); //选中的服务器的索引
      const serverStatusFlag = ref(true); //选中的服务器是否运行的标志

      const serverStatus = computed(() => {
        if (serverStatusFlag.value) {
          return {
            text: '运行中',
            color: 'green'
          };
        } else {
          return {
            text: '已断开',
            color: 'red'
          };
        }
      });

      const showSelector = () => {
        /*
         * 点击更换节点后的操作
         * 1.显示对话框
         * 2.向后端请求节点信息
         * 3.放入data
         */
        visible.value = !visible.value;
        // todo 请求所有我的服务器节点信息,放到了data里
      };

      const handleOk = async () => {
        /*
         * 确认更换节点后的操作
         * 1.关闭对话框
         * 2.向对应节点请求声明
         * 3.根据返回值确认状态
         */
        visible.value = !visible.value;
        let declarationInfo = await getDeclaration(data[selectedServerIndex.value].ip, data[selectedServerIndex
          .value].port);
        if (declarationInfo == null) {
          serverStatusFlag.value = false;
        } else {
          serverStatusFlag.value = true;
        }
        context.emit('serverSelected', {
          serverInfo: data[selectedServerIndex.value],
          declarationInfo: declarationInfo
        });
      };

      onBeforeMount(async () => {
        /*
         * 每次渲染前对默认节点做请求声明
         */
        let declarationInfo = await getDeclaration(data[0].ip, data[0].port);
        if (declarationInfo == null) {
          serverStatusFlag.value = false;
        } else {
          serverStatusFlag.value = true;
        }
        context.emit('serverSelected', {
          serverInfo: data[0],
          declarationInfo: declarationInfo
        });
      });





      return {
        visible,
        data,
        columns,
        rowSelection,
        serverStatus,
        serverStatusFlag,
        selectedServerIndex,
        handleOk,
        showSelector,
      };
    },

  });
</script>