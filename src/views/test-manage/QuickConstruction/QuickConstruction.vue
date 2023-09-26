<style scoped lang="less">
@import '@/style.less';

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
  <MainPageNavigation :selectedKeys="['11']" :openKeys="['sub2']">
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>测试任务管理</a-breadcrumb-item>
      <a-breadcrumb-item>快速任务构建</a-breadcrumb-item>
      <a-breadcrumb-item>快速攻击测试</a-breadcrumb-item>
    </template>
    <template v-slot:content>

      <a-row type="flex" class="attack-task">
        <a-col flex="1 1">
          <h2 class="attack-task__title">快速攻击测试构建</h2>
          <div>
            <p class="attack-task__type-select__title">
              <DeploymentUnitOutlined /> 构建向导类型
            </p>
            <a-select ref="select" v-model:value="attackType" style="width: 100%" :options="attackTypes"></a-select>
          </div>
        </a-col>
        <ServerNodeCard @serverSelected="handleServerChange"></ServerNodeCard>
      </a-row>

      <a-alert class="attack-task__type-select__notice" message="快速攻击测试构建" type="info" show-icon closable close-text="我已了解">
        <template #description>
          <div>
            请选择预先配置的攻击方案，并确认或修改数据量，以进行模型鲁棒性评估。
          </div>
        </template>
      </a-alert>

      <div class="steps-content" v-if="!showSuccess">
        <!-- <a-collapse v-model:activeKey="activeKey" accordion>
          <a-collapse-panel v-for="(config, index) in configList" :key="index" :header="config.configName">
            <ConfigSummary :config="config" :currentServerDeclaration="currentServerDeclaration" />
          </a-collapse-panel>
        </a-collapse> -->
        <div style="overflow: scroll; overflow-y: hidden;">
          <div style="display: flex;flex-direction: row" v-if="currentServerDeclaration!=null">
            <ConfigSummary v-for="(config, index) in configList" :key="index" :index="index" :config="config" :currentServerDeclaration="currentServerDeclaration" style="flex-shrink:0"
            @selected="selectedConfig"/>
          </div>
        </div>
        <br />
        <a-form ref="formRef" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" @submit="finish" :model="params">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item name="taskName" label="任务名称" has-feedback :rules="[{ required: true, message: '必须输入任务名称' }]">
                <a-input style="width:100%" v-model:value="params.taskName" placeholder="请输入任务名称" width="100%"></a-input>
              </a-form-item>
              <a-form-item name="taskDesc" label="任务描述" has-feedback :rules="[{ required: true, message: '必须输入任务描述' }]">
                <a-textarea style="width:100%" v-model:value="params.taskDesc" placeholder="请输入任务描述" width="100%"></a-textarea>
              </a-form-item>
              <a-form-item name="datasetSize" label="数据量" has-feedback :rules="[{ type: 'integer', message: '数据量必须是整数' }]">
                <a-input-number style="width:100%" v-model:value="configContent['dataset_size']" placeholder="请输入测试数据数据量(需小于数据集总量)" :step="1" />
              </a-form-item>
              <a-form-item name="datasetSeed" label="数据集随机种子">
                <a-form-item-rest>
                  <a-input-search style="width:100%" v-model:value="configContent['dataset_seed']" placeholder="请输入随机数种子" enter-button="随机生成"
                    @search="seed_create" :disabled="!datasetSeedUserAppoint" />
                  <span>自行指定</span>
                  <a-switch v-model:checked="datasetSeedUserAppoint" />
                </a-form-item-rest>
              </a-form-item>
            </a-col>
            <a-col :span="16">
              <a-alert message="最终配置信息预览" type="success" show-icon>
                <template #description>
                  <p v-if="currentServerInfo != null">下列信息将被传递至服务节点 {{ currentServerInfo.nodeName }}(NodeID: {{
                    currentServerInfo.nodeID }}) : </p>
                  <a-textarea style="width:100%" :value="JSON.stringify(configContent)" placeholder="请选择配置信息" width="100%" readonly :rows="6"></a-textarea>
                </template>
              </a-alert>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="steps-action" v-if="!showSuccess">
        <a-button type="primary" @click="submit">
          提交测试
        </a-button>
      </div>
      <div v-if="showSuccess">
        <a-result status="success" title="您的任务已完成构建" :sub-title="'TaskID : ' + taskID + ' . 请转至 [实时任务看板] 开启任务.'">
          <template #extra>
            <a-button type="primary" @click="toPage('TaskRealtimeBoard')">实时任务看板</a-button>
            <a-button @click="showSuccess = !showSuccess">继续新建任务</a-button>
          </template>
        </a-result>
      </div>
    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';
import ServerNodeCard from '@/components/ServerNodeCard.vue';
import ConfigSummary from '@/views/test-manage/QuickConstruction/components/ConfigSummary.vue';
import { DeploymentUnitOutlined } from '@ant-design/icons-vue';
import { onMounted, ref, defineComponent, watch, reactive, computed, h } from 'vue';
import { newTask } from '@/api/task-api/taskInfo.js';
import { getAllQuickTaskConfig } from '@/api/config-api/quickTaskConfig.js';
import { Modal } from 'ant-design-vue';
import router from '@/router';

export default defineComponent({
  name: 'FastAttackTest',
  components: { MainPageNavigation, ServerNodeCard, ConfigSummary, DeploymentUnitOutlined },
  setup(props, context) {
    const params = reactive({
      taskName: null,
      taskDesc: null,
      datasetSize: computed(() => {
        return configContent.value['dataset_size'];
      }),
      datasetSeed: computed(() => {
        return configContent.value['dataset_seed'];
      }),
    });
    const showSuccess = ref(false);
    const formRef = ref(null);
    const activeKey = ref([]);
    const configContent = ref({});
    const taskTypeID = ref(1);
    const configList = ref([]);
    const taskListType = ref(['AttackTest']);
    const pageSize = ref(10);
    const currentPage = ref(0);
    const datasetSeedUserAppoint = ref(false);
    const taskID = ref(null);
    const nowConfigID = ref(null);
    const configSummary = ref();

    // 节点切换
    const currentServerInfo = ref(null);
    const currentServerDeclaration = ref(null);
    const handleServerChange = ({ declarationInfo, serverInfo }) => {
      currentServerDeclaration.value = declarationInfo;
      currentServerInfo.value = serverInfo;
    };

    const attackType = ref(1);
    const attackTypes = [
      {
        value: 1,
        label: '“攻击有效性-模型鲁棒性”综合评估测试',
      },
      {
        value: 2,
        label: '“防御有效性”综合评估测试',
        disabled: true
      },
    ];

    onMounted(async () => {
      let newLoadData = await getAllQuickTaskConfig(currentPage.value, pageSize.value);
      configList.value = configList.value.concat(newLoadData.list);
    });
    const seed_create = () => {
      let max = 100000000000000000;
      let min = 10000000000000000;
      configContent.value['dataset_seed'] = Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const selectedConfig = (id) =>{
      console.log(id)
      nowConfigID.value = JSON.parse(configList.value[id].id);
      configContent.value = JSON.parse(configList.value[id].config);
      taskTypeID.value = JSON.parse(configList.value[id].taskTypeID);
    };

    const submit = async () => {
      await formRef.value
        .validate()
        .then(async () => {
          taskID.value = await newTask(
            params.taskName,
            params.taskDesc,
            currentServerInfo.value['nodeID'],
            taskTypeID.value,
            JSON.stringify(configContent.value)
          );
          showSuccess.value = true;
        })
        .catch((e) => {
          if (e.errorFields != null) {
            let errorFieldNames = [];
            e.errorFields.forEach((element) => {
              element.name.forEach((name) => {
                errorFieldNames.push(name);
              });
            });
            Modal.error({
              title: '失败',
              content: h('div', {}, [
                h('p', '提交失败，请检查字段是否填写正确'),
                h('p', '问题字段(' + errorFieldNames.length + ') : ' + errorFieldNames.join(' / ')),
              ]),
            });
          } else {
            Modal.error({
              title: '失败',
              content: h('div', {}, [h('p', '提交失败，服务器异常'), h('p', '问题:' + e)]),
            });
          }
        });
    };
    const toPage = (page) => {
      router.push({ path: '/' + page });
    };

    return {
      activeKey,
      configContent,
      configList,
      datasetSeedUserAppoint,
      showSuccess,
      params,
      formRef,
      attackType,
      attackTypes,

      currentServerInfo,
      currentServerDeclaration,
      taskID,
      nowConfigID,

      configSummary,

      seed_create,
      submit,
      handleServerChange,
      toPage,
      selectedConfig,
    };
  },
});
</script>
