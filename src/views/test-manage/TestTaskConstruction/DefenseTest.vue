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
      <a-menu :selectedKeys="['defenseTest']" mode="horizontal" class="submenu">
        <a-menu-item key="defenseTest" @click="toPage('TestTaskConstruction/DefenseTest')"> 防御测试 </a-menu-item>
        <a-menu-item key="attackTest" @click="toPage('TestTaskConstruction/AttackTest')"> 攻击测试 </a-menu-item>
        <a-menu-item key="modelTest"> 模型测试 </a-menu-item>
      </a-menu>
    </template>
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>测试任务管理</a-breadcrumb-item>
      <a-breadcrumb-item>测试任务构建</a-breadcrumb-item>
      <a-breadcrumb-item>防御测试</a-breadcrumb-item>
    </template>
    <template v-slot:content>
      <a-row type="flex" class="attack-task">
        <a-col flex="1 1">
          <h2 class="attack-task__title">防御测试构建</h2>
          <div>
            <p class="attack-task__type-select__title">
              <deployment-unit-outlined /> 构建向导类型
            </p>
            <a-select ref="select" v-model:value="attackType" style="width: 100%" :options="attackTypes" @focus="focus" @change="handleChange"></a-select>
          </div>
        </a-col>
        <ServerPointCard @serverSelected="handleServerChange"></ServerPointCard>
      </a-row>
    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';
import ServerPointCard from '@/components/ServerPointCard.vue';
import { defineComponent, ref, onMounted, computed } from 'vue';
import { message, Empty } from 'ant-design-vue';
import { DeploymentUnitOutlined, ClusterOutlined } from '@ant-design/icons-vue';
import router from '@/router';
// import { getModelInfo } from "@/api/model-api/modelInfo.js";
import { getAtkInfo } from '@/api/atk-api/atkInfo.js';

export default defineComponent({
  name: 'MainPage',
  setup() {
    const current = ref(0);
    const attackType = ref(0);
    const attackTypes = [
      {
        value: 0,
        label: '生成对抗样本',
      },
    ];
    const toPage = (page) => {
      router.push({ path: '/' + page });
    };
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
      },
      {
        dataIndex: 'action',
        title: '操作',
        key: 'action',
      },
    ];
    const handleServerChange = (currentServerInfo) => {
      console.log(currentServerInfo);
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

    const handleMoveItemChange = () => {
      loadMoreAttackMethodInfo();
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
    const showMethodDetails = (attackMethodID) => {
      attackInfo.value.forEach((element) => {
        if (element.attackMethodID == attackMethodID) {
          selectedAttackMethodInfo.value = element;
        }
      });
    };

    const handleChange = (keys, direction, moveKeys) => {
      console.log(keys, direction, moveKeys);
    };

    const getRowSelection = ({ disabled, selectedKeys, onItemSelectAll, onItemSelect }) => {
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
    };
    const next = () => {
      current.value++;
    };

    const prev = () => {
      current.value--;
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
      handleChange,
      toPage,
      pagination,

      attackInfo,
      handleTableChange,
      handleMoveItemChange,

      getAttackInfo,
      showMethodDetails,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      next,
      prev,
    };
  },
  components: {
    MainPageNavigation,
    ServerPointCard,
    DeploymentUnitOutlined,
    ClusterOutlined,
  },
});
</script>
