<style scoped lang="less">
@import '~ant-design-vue/dist/antd.less';
.submenu {
  height: 50px;
}

.attack-task {
  margin-bottom: 10px;
  &__title {
    margin-bottom: 20px;
  }
  &__type-select {
    &__title {
      margin-bottom: 5px;
    }
    &__notice {
      margin-bottom: 20px;
      &__title {
        color: @primary-color;
      }
      &__warning {
        color: @error-color;
      }
    }
  }
  &__steps {
    margin-bottom: 10px;
  }
  &__attack-selector {
    display: flex;
    justify-content: center;
    padding: 10px;
  }
}
</style>

<template>
  <MainPageNavigation :selectedKeys="['6']" :openKeys="['sub2']">
    <template v-slot:submenu>
      <a-menu :selectedKeys="['attackTest']" mode="horizontal" class="submenu">
        <a-menu-item key="defenseTest" @click="toPage('TestTaskConstruction/DefenseTest')"> 防御测试 </a-menu-item>
        <a-menu-item key="attackTest" @click="toPage('TestTaskConstruction/AttackTest')"> 攻击测试 </a-menu-item>
        <a-menu-item key="modelTest" @click="toPage('TestTaskConstruction/ModelTest')"> 模型测试 </a-menu-item>
      </a-menu>
    </template>
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>测试任务管理</a-breadcrumb-item>
      <a-breadcrumb-item>测试任务构建</a-breadcrumb-item>
      <a-breadcrumb-item>攻击测试</a-breadcrumb-item>
    </template>
    <template v-slot:content>
      <a-row type="flex" class="attack-task">
        <a-col flex="1 1">
          <h2 class="attack-task__title">攻击测试构建</h2>
          <div>
            <p class="attack-task__type-select__title">
              <deployment-unit-outlined /> 构建向导类型
            </p>
            <a-select ref="select" v-model:value="attackType" style="width: 100%" :options="attackTypes"></a-select>
          </div>
        </a-col>
        <ServerNodeCard @serverSelected="handleServerChange"></ServerNodeCard>
      </a-row>

      <a-alert class="attack-task__type-select__notice" message="构建向导指南" type="info" show-icon closable close-text="我已了解">
        <template #description>
          <div>
            <span class="attack-task__type-select__notice__title">仅生成对抗样本</span> - 将根据您选定的攻击方法在数据集上生成对抗样本。
          </div>
          <div>
            <span class="attack-task__type-select__notice__title">最佳扰动限制估算</span> - 依据您指定的步长与范围，尝试所有可能的扰动配置并加以比较，估算出最佳的扰动限制配置（所选攻击方法须支持该操作）。
          </div>
          <div>
            <span class="attack-task__type-select__notice__title">单一方法测评</span> - 将依据您指定的配置，对某一方法进行测试，并就其表现进行综合排序。该测试其他方法采取历史测评数据。
          </div>
          <div>
            <span class="attack-task__type-select__notice__title">全量方法测评</span> - 将依据您指定的配置，对所有攻击方法进行测试，并就其表现进行综合排序。
            <span class="attack-task__type-select__notice__warning">该测试不依赖历史测评数据，耗时极长。</span>
          </div>
          <br />
          <div>
            攻击测试通常需要指定待攻击的人工智能模型（目标模型），并基于此生成对抗样本。每一攻击方法可为其指定多个待攻击模型。
          </div>
          <div>
            欲验证对抗样本的迁移性，则需额外指定迁移攻击测试的模型。迁移测试默认只测试基于第一个待攻击模型生成的对抗样本的迁移性，若需全量测试则需开启相关选项，耗时可能极长。
          </div>
        </template>
      </a-alert>

      <div>
        <a-steps :current="current" class="attack-task__steps">
          <a-step :key="1" title="选择攻击方法" description="选择白盒/黑盒方法" />
          <a-step :key="2" title="选择AI模型" description="选择欲攻击的AI模型" />
          <a-step :key="3" title="启动测试" description="配置测试任务" />
        </a-steps>
        <div class="steps-content">
          <div v-if="current == 0">
            <a-row>
              <a-col :span="16" class="attack-task__attack-selector">
                <a-transfer v-model:target-keys="targetKeys" :data-source="attackInfo" show-search :rowKey="(record) => record.attackMethodID"
                  :showSelectAll="false" :list-style="{'min-width': '250px', 'min-height': '300px', flex: 1,}" :titles="[' 可选方法', ' 已选定方法']"
                  :operations="['加入队列', '移除队列']" @change="handleMoveItemChange" style="width: 100%">
                  <template #children="{direction, filteredItems, selectedKeys, disabled: listDisabled, onItemSelectAll, onItemSelect}">
                    <a-table :row-selection="getRowSelection({disabled: listDisabled, selectedKeys, onItemSelectAll, onItemSelect,})"
                      :columns="direction === 'left' ? leftTableColumns : rightTableColumns" :data-source="filteredItems" size="small"
                      :style="{ pointerEvents: listDisabled ? 'none' : null }" :pagination="direction === 'left' ? pagination : { pageSize: 5 }"
                      @change="(...args) => { direction === 'left' ? handleTableChange(...args) : ()=>{} }"
                      :custom-row="({ key, disabled: itemDisabled }) => ({onClick: () => { if (itemDisabled || listDisabled) return; onItemSelect(key, !selectedKeys.includes(key));},})"
                      :scroll="direction === 'left' ? { x: 800 } : { x: 700 }">

                      <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'status'">
                          <AttackConfigProcessor :atkInfo="record" :currentServerInfo="currentServerInfo" :currentServerDeclaration="currentServerDeclaration"
                            :providerID="record.providerID" @add-async-task="(task)=>{autoConfigTaskQueue.push(task)}">
                          </AttackConfigProcessor>
                        </template>
                        <template v-if="column.key === 'action'">
                          <span>
                            <a @click="showMethodInfo(record.attackMethodID)">详情 - {{ record.attackMethodName }}</a>
                            <a-divider type="vertical" />
                          </span>
                        </template>
                      </template>
                    </a-table>
                  </template>

                  <template #footer="{ direction }">
                    <a-button v-if="direction === 'left'" size="small" style="float: left; margin: 5px" @click="getAttackInfo">
                      刷新方法列表
                    </a-button>
                    <div v-if="direction === 'right'" style="float: left; margin: 5px">
                      <a-popconfirm ok-text="关闭" :showCancel="false">
                        <template #title>
                          <div>
                            配置状态可能为如下类型
                            <br />
                            <br />
                            <div style="margin-bottom:5px">
                              <a-tag color="success">
                                就绪
                              </a-tag>: 该方法的配置已经成功完成
                            </div>
                            <div style="margin-bottom:5px">
                              <a-tag color="processing">
                                请稍后/正在获取……
                              </a-tag>: 表示正在请求数据，请等待网络请求
                            </div>
                            <div style="margin-bottom:5px">
                              <a-tag color="warning">
                                未完成参数配置
                              </a-tag>: 该方法在配置时被用户取消或失败而没有完成配置，请点击 <a-typography-text type="warning">[参数配置]</a-typography-text> 重新配置
                            </div>
                            <div style="margin-bottom:5px">
                              <a-tag color="warning">
                                该攻击方法在当前服务节点有多个绑定
                              </a-tag>: 请在 <a-typography-text type="warning">[详情]</a-typography-text> 内选择所希望使用的攻击方法实现，然后点击 <a-typography-text type="warning">
                                [刷新]</a-typography-text> 继续操作
                            </div>
                            <br />
                            以下两类严重错误<a-typography-text type="error">无法在本页面解决</a-typography-text>
                            <br />
                            <div style="margin-bottom:5px">
                              <a-tag color="error">
                                该攻击方法在当前服务节点没有绑定
                              </a-tag>: 请将当前节点已实现的攻击方法绑定至该攻击方法后重试
                            </div>
                            <div style="margin-bottom:5px">
                              <a-tag color="error">
                                当前服务节点未提供绑定的方法实现
                              </a-tag>: 请检查当前节点是否已经实现攻击方法，其名称是否与绑定的名称一致
                            </div>
                          </div>
                        </template>
                        <a>
                          <QuestionCircleOutlined /> 配置状态含义
                        </a>
                      </a-popconfirm>
                    </div>
                  </template>
                </a-transfer>
              </a-col>
              <a-col :span="8" class="attack-task__attack-selector">
                <a-card size="small" style="width: 100%; overflow:hidden">
                  <template #title>
                    <div>
                      攻击方法详情<span v-if="selectedAttackMethodInfo != null">
                        - {{ selectedAttackMethodInfo.attackMethodName }}</span>
                    </div>
                  </template>
                  <a-empty :image="simpleImage" v-if="selectedAttackMethodInfo == null" />
                  <div v-else>
                    <a-row type="flex">
                      <a-col flex="0 1 100px">方法名称</a-col>
                      <a-col flex="1 1">{{
                        selectedAttackMethodInfo.attackMethodName
                      }}</a-col>
                    </a-row>
                    <a-row type="flex">
                      <a-col flex="0 1 100px">简介</a-col>
                      <a-col flex="1 1">{{
                        selectedAttackMethodInfo.attackMethodDesc
                      }}</a-col>
                    </a-row>
                    <a-row type="flex">
                      <a-col flex="0 1 100px">方法详情</a-col>
                      <a-col flex="1 1"><a @click="methodDetailsVisible = true">查看详情</a></a-col>
                    </a-row>
                    <a-row type="flex">
                      <a-col flex="100px">参考论文</a-col>
                      <a-col flex="auto"><a :href="selectedAttackMethodInfo.attackMethodPaperUrl">{{ selectedAttackMethodInfo.attackMethodPaper }}</a></a-col>
                    </a-row>
                    <a-row type="flex">
                      <a-col flex="100px">方法类别</a-col>
                      <a-col flex="auto">{{
                        selectedAttackMethodInfo.attackMethodType
                          .attackMethodTypeName
                      }}</a-col>
                    </a-row>
                    <a-divider />
                    <AttackBindNode :atkID="selectedAttackMethodInfo['attackMethodID']" :currentServerInfo="currentServerInfo"
                      @selectedProvider="selectedAttackProvider"></AttackBindNode>
                    <a-drawer title="方法详情" placement="right" :visible="methodDetailsVisible" :get-container="false" width="90%"
                      :style="{ position: 'absolute' }" @close="methodDetailsVisible = false">
                      <p v-html="selectedAttackMethodInfo.attackMethodDetails"></p>
                    </a-drawer>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </div>
        </div>
        <div class="steps-action">
          <a-button v-if="current < 2" type="primary" @click="next">Next</a-button>
          <a-button v-if="current == 2" type="primary" @click="message.success('Processing complete!')">
            Done
          </a-button>
          <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">Previous</a-button>
        </div>
      </div>
    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';
import ServerNodeCard from '@/components/ServerNodeCard.vue';
import { defineComponent, ref, onMounted, computed, nextTick } from 'vue';
import { message, Empty } from 'ant-design-vue';
import { DeploymentUnitOutlined, ClusterOutlined, CloseCircleOutlined, CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
import router from '@/router';
// import { getModelInfo } from "@/api/model-api/modelInfo.js";
import { getAtkInfo } from '@/api/atk-api/atkInfo.js';

import AttackConfigProcessor from './components/AttackConfigProcessor';
import AttackBindNode from './components/AttackBindNode';

export default defineComponent({
  name: 'AttackTest',
  components: {
    MainPageNavigation,
    ServerNodeCard,
    AttackConfigProcessor,
    AttackBindNode,

    DeploymentUnitOutlined,
    ClusterOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    QuestionCircleOutlined,
  },
  setup() {
    const current = ref(0);
    const attackType = ref(0);
    const attackTypes = [
      {
        value: 0,
        label: '生成对抗样本',
      },
    ];
    const leftTableColumns = [
      {
        dataIndex: 'attackMethodName',
        title: '攻击方法',
        width: '140px',
        fixed: 'left',
      },
      {
        dataIndex: 'attackMethodDesc',
        width: '480px',
        title: '简介',
      },
      {
        dataIndex: ['attackMethodType', 'attackMethodTypeName'],
        title: '攻击类型',
      },
    ];
    const rightTableColumns = [
      {
        dataIndex: 'attackMethodName',
        title: '攻击方法',
        width: '140px',
        fixed: 'left',
      },
      {
        dataIndex: 'status',
        width: '300px',
        title: '配置状态',
        key: 'status',
      },
      {
        dataIndex: 'action',
        title: '操作',
        key: 'action',
      },
    ];

    const toPage = (page) => {
      router.push({ path: '/' + page });
    };
    const pageSize = ref(5);
    const totalAtkInfo = ref(0);
    const totalLoad = ref(0);

    const currentPage = ref(1);

    const attackInfo = ref([]);
    const targetKeys = ref([]);

    let loadPage = 1;
    let loadFinished = false;

    const pagination = computed(() => {
      return {
        total: totalAtkInfo.value - targetKeys.value.length,
        current: currentPage.value,
        pageSize: pageSize.value,
      };
    });

    // 拉取攻击方法信息
    onMounted(async () => {
      await getAttackInfo();
    });

    const getAttackInfo = async () => {
      const atkInfo = await getAtkInfo(loadPage, pageSize.value);

      attackInfo.value = attackInfo.value.concat(atkInfo.list);
      totalAtkInfo.value = atkInfo.total;
      totalLoad.value = totalLoad.value + atkInfo.size;

      loadFinished = atkInfo.isLastPage;
    };
    const handleMoveItemChange = (targetKeys, direction, moveKeys) => {
      loadMoreAttackMethodInfo();
      if (direction == 'right') {
        nextTick(() => {
          runConfigTaskQueue();
        });
      }
    };

    const loadMoreAttackMethodInfo = async () => {
      // 左侧待选已加载的项目数 totalLoad - targetKeys.value.length
      // 左侧需显示的项目数 pageSize*currentPage
      // 若已加载小于需显示，则继续向后加载
      while (totalLoad.value - targetKeys.value.length < pageSize.value * currentPage.value && !loadFinished) {
        loadPage++;
        await getAttackInfo();
      }
    };

    const handleTableChange = (newPagination, filters, sorter) => {
      currentPage.value = newPagination.current;
      loadMoreAttackMethodInfo();
    };

    const selectedAttackMethodInfo = ref();
    const showMethodInfo = (attackMethodID) => {
      attackInfo.value.forEach((element) => {
        if (element.attackMethodID == attackMethodID) {
          selectedAttackMethodInfo.value = element;
        }
      });
    };

    const getRowSelection = ({ disabled, selectedKeys, onItemSelectAll, onItemSelect }) => {
      return {
        getCheckboxProps: (item) => ({
          disabled: disabled || item.disabled,
        }),

        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows.filter((item) => !item.disabled).map(({ key }) => key);
          onItemSelectAll(treeSelectedKeys, selected);
        },

        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },

        selectedRowKeys: selectedKeys,
      };
    };

    const next = () => {
      current.value++;
    };

    const prev = () => {
      current.value--;
    };

    // 节点切换
    const currentServerInfo = ref(null);
    const currentServerDeclaration = ref(null);
    const handleServerChange = ({ declarationInfo, serverInfo }) => {
      currentServerDeclaration.value = declarationInfo;
      currentServerInfo.value = serverInfo;
    };

    //自动配置队列

    const autoConfigTaskQueue = ref([]);
    const runConfigTaskQueue = async () => {
      while (autoConfigTaskQueue.value.length > 0) {
        let task = autoConfigTaskQueue.value.shift();
        await task().catch(() => {});
      }
    };

    const methodDetailsVisible = ref(false);

    const selectedAttackProvider = async (atkID, providerID) => {
      attackInfo.value.forEach((element) => {
        if (element.attackMethodID == atkID) {
          element.providerID = providerID;
        }
      });
    };

    return {
      message,
      attackType,
      attackTypes,
      current,
      selectedAttackMethodInfo,
      leftTableColumns,
      rightTableColumns,
      targetKeys,
      getRowSelection,
      handleServerChange,

      pagination,
      toPage,
      attackInfo,
      handleTableChange,
      handleMoveItemChange,

      getAttackInfo,
      showMethodInfo,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      next,
      prev,
      //当前节点信息与声明
      currentServerInfo,
      currentServerDeclaration,
      //自动配置队列
      autoConfigTaskQueue,
      runConfigTaskQueue,

      methodDetailsVisible,
      selectedAttackProvider,
    };
  },
});
</script>
