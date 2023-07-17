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
              <DeploymentUnitOutlined /> 构建向导类型
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
            <span class="attack-task__type-select__notice__title">攻击方法测评</span> - 将依据您指定的配置，对一种或多种方法进行测试，并就其表现进行综合排序。
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
          <a-step :key="1" title="指定测试数据集" description="选择测试基于的数据集" />
          <a-step :key="2" title="选择AI模型" description="选择欲攻击的AI模型" />
          <a-step :key="3" title="选择攻击方法" description="选择白盒/黑盒方法" />
          <a-step :key="4" title="启动测试" description="配置测试任务" />
        </a-steps>
        <div class="steps-content" v-if="!showSuccess">
          <DatasetSelector ref="datasetSelector" :currentServerInfo="currentServerInfo" v-show="current == 0"></DatasetSelector>
          <ModelSelector ref="modelSelector" :currentServerInfo="currentServerInfo" :currentServerDeclaration="currentServerDeclaration" v-show="current == 1">
          </ModelSelector>
          <AttackSelector ref="attackSelector" :currentServerInfo="currentServerInfo" :currentServerDeclaration="currentServerDeclaration" :modelList="allConfig['model_list']"
            v-show="current==2">
          </AttackSelector>
          <div v-if="current == 3">
            <TaskSubmit ref="taskSubmit" :config="allConfig" :currentServerInfo="currentServerInfo" :taskTypeID="attackType" v-show="current == 3"
              @success="(id)=>{showSuccess = true;taskID = id}">
            </TaskSubmit>
          </div>
        </div>
        <div class="steps-action" v-if="!showSuccess">
          <a-button type="primary" @click="submitDataset" v-if="current == 0">确认数据集选择</a-button>
          <a-button type="primary" @click="submitModel" v-if="current == 1">确认AI模型选择</a-button>
          <a-button type="primary" @click="submitAttack" v-if="current == 2">确认攻击方法选择</a-button>
          <a-button type="primary" @click="taskSubmit.submit()" v-if="current == 3">
            提交测试
          </a-button>
          <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">返回上一步</a-button>
        </div>
        <div v-if="showSuccess">
          <a-result status="success" title="您的任务已完成构建" :sub-title="'TaskID : ' + taskID + ' . 请转至 [实时任务看板] 开启任务.'">
            <template #extra>
              <a-button type="primary">实时任务看板</a-button>
              <a-button>继续新建任务</a-button>
            </template>
          </a-result>
        </div>
      </div>
    </template>
  </MainPageNavigation>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { message } from 'ant-design-vue';
import { DeploymentUnitOutlined } from '@ant-design/icons-vue';
import router from '@/router';

import MainPageNavigation from '@/components/MainPageNavigation.vue';
import ServerNodeCard from '@/components/ServerNodeCard.vue';

import AttackSelector from './components/attack/AttackSelector.vue';
import ModelSelector from './components/ai-model/ModelSelector.vue';
import DatasetSelector from './components/dataset/DatasetSelector.vue';
import TaskSubmit from './components/TaskSubmit.vue';

export default defineComponent({
  name: 'AttackTest',
  components: {
    MainPageNavigation,
    ServerNodeCard,

    DeploymentUnitOutlined,
    DatasetSelector,
    ModelSelector,
    AttackSelector,
    TaskSubmit,
  },
  setup() {
    const showSuccess = ref(false);
    const current = ref(0);
    const attackType = ref(1);
    const attackTypes = [
      {
        value: 1,
        label: '攻击方法测评',
      },
    ];

    const toPage = (page) => {
      router.push({ path: '/' + page });
    };

    const selectedAttackMethodInfo = ref();

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

    const allConfig = ref({
      dataset_size: 10,
      model_list: [],
    });

    const datasetSelector = ref();
    const attackSelector = ref();
    const modelSelector = ref();
    const taskSubmit = ref();

    const submitDataset = () => {
      try {
        [allConfig.value['dataset'], allConfig.value['dataset_seed']] = datasetSelector.value.submit();
        current.value++;
      } catch (error) {
        message.error(error.message);
      }
    };
    const submitModel = () => {
      try {
        [allConfig.value['model_list'], allConfig.value['model_config'], allConfig.value['img_proc_config']] = modelSelector.value.submit();
        current.value++;
      } catch (error) {
        message.error(error.message);
      }
    };
    const submitAttack = () => {
      try {
        [
          allConfig.value['attacker_list'],
          allConfig.value['transfer_attack_test_mode'],
          allConfig.value['transfer_attack_test_on_model_list'],
          allConfig.value['attacker_config'],
        ] = attackSelector.value.submit();
        current.value++;
      } catch (error) {
        message.error(error.message);
      }
    };
    const taskID = ref(null);

    return {
      showSuccess,
      attackType,
      attackTypes,
      current,
      selectedAttackMethodInfo,
      handleServerChange,
      toPage,
      next,
      prev,
      //当前节点信息与声明
      currentServerInfo,
      currentServerDeclaration,

      datasetSelector,
      attackSelector,
      modelSelector,
      taskSubmit,

      submitDataset,
      submitAttack,
      submitModel,

      allConfig,
      taskID,
    };
  },
});
</script>
