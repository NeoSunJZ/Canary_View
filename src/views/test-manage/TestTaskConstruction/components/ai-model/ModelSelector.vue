<style scoped lang="less">
@import '@/style.less';
.model-selector {
  display: flex;
  justify-content: center;
  padding-top: 0px !important;
  padding: 10px;
}
</style>

<template>
  <a-row>
    <a-col :span="16" class="model-selector">
      <CommonTransfer ref="commonTransfer" :leftTableColumns="leftTableColumns" :rightTableColumns="rightTableColumns" :fields="{id:'modelID'}" :getDataResource="getModelInfo"
        @move-item-change="handleMoveItemChange">

        <template #tableCell="{ column, record }">

          <template v-if="column.key === 'modelConfigStatus'">
            <CommonConfigProcessor :id="record.modelID" :field="{providerID: 'modelProviderID',configID: 'modelConfigID',
              paramsDesc: 'model_config_params', providerBindName: 'bindModelName', declarationBindName:'model_name' }"
              :configModelTitle="'模型 '+ record.modelName +' [ ModelID: '+record.modelID+' ] - 高级配置'" providerType="ModelConfig"
              :providerID="selectedProvider[record.modelID]==null?null:selectedProvider[record.modelID]['modelProviderID']" :currentServerInfo="currentServerInfo"
              :currentServerDeclaration="currentServerDeclaration['registered_component']['model_list']" :getConfig="getModelConfig" :getAllBindInfos="getAllModelBindInfos"
              @add-async-task="(task)=>{autoConfigTaskQueue.push(task)}" @confirm="handleModelConfigConfirm">
            </CommonConfigProcessor>
          </template>

          <template v-if="column.key === 'imgProcConfigStatus'">
            <CommonConfigProcessor :id="record.modelID" :field="{providerID: 'modelProviderID',configID: 'modelConfigID',
              paramsDesc: 'img_process_config_params', providerBindName: 'bindModelName', declarationBindName:'model_name' }"
              :configModelTitle="'模型 '+ record.modelName +' [ ModelID: '+record.modelID+' ] - 图片处理配置'" providerType="ImgProcConfig"
              :providerID="selectedProvider[record.modelID]==null?null:selectedProvider[record.modelID]['modelProviderID']" :currentServerInfo="currentServerInfo"
              :currentServerDeclaration="currentServerDeclaration['registered_component']['model_list']" :getConfig="getModelConfig" :getAllBindInfos="getAllModelBindInfos"
              @add-async-task="(task)=>{autoConfigTaskQueue.push(task)}" @confirm="handleImgProcConfigConfirm">
            </CommonConfigProcessor>
          </template>

          <template v-if="column.key === 'action'">
            <span>
              <a @click.stop="modelDetails.showDetails(record)">详情 - {{ record["modelName"] }}</a>
              <a-divider type="vertical" />
            </span>
          </template>

        </template>

      </CommonTransfer>
    </a-col>
    <a-col :span="8" class="model-selector">
      <ModelDetails ref="modelDetails">
        <template #extra="{ record }">
          <CommonProviderSelector :field="{providerID:'modelProviderID',source:'modelSource',bindName:'bindModelName'}" :id="record.modelID" :currentServerInfo="currentServerInfo"
            @selected-provider="handleSelectProvider" :getProviderList="getAllModelBindInfos">
            <template #extra="{ record }">
              <div style="margin-top:5px">
                <a-tag color="#cd201f">
                  <template #icon>
                    <DatabaseOutlined />
                  </template>
                  {{record.datasetInfo.datasetName}} 数据集
                </a-tag>

                <a-tag color="#3b5999">
                  <template #icon>
                    <CloudOutlined />
                  </template>
                  {{record.isApi=="false"?"本地实现":"远端API"}}
                </a-tag>
              </div>
            </template>
          </CommonProviderSelector>
        </template>
      </ModelDetails>
    </a-col>
  </a-row>
</template>

<script>
import { defineComponent, ref, nextTick } from 'vue';

import { getModelInfo, getModelConfig } from '@/api/model-api/modelInfo.js';
import { getAllModelBindInfos } from './ModelBindInfoStore';

import CommonTransfer from '@/components/core/CommonTransfer.vue';
import CommonProviderSelector from '@/components/core/CommonProviderSelector.vue';
import CommonConfigProcessor from '@/components/core/CommonConfigProcessor.vue';
import ModelDetails from './ModelDetails.vue';

import { DatabaseOutlined, CloudOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'ModelSelector',
  props: {
    currentServerInfo: Object,
    currentServerDeclaration: Object,
  },
  components: {
    CommonTransfer,
    ModelDetails,
    CommonProviderSelector,
    CommonConfigProcessor,

    DatabaseOutlined,
    CloudOutlined,
  },
  setup() {
    const leftTableColumns = [
      {
        dataIndex: 'modelName',
        title: '人工智能模型',
        width: '140px',
        fixed: 'left',
      },
      {
        dataIndex: 'modelDesc',
        width: '480px',
        title: '简介',
      },
      {
        dataIndex: ['modelType', 'modelTypeName'],
        title: '模型类型',
      },
    ];
    const rightTableColumns = [
      {
        dataIndex: 'modelName',
        title: '人工智能模型',
        width: '140px',
        fixed: 'left',
      },
      {
        dataIndex: 'modelConfigStatus',
        width: '300px',
        title: '模型配置状态',
        key: 'modelConfigStatus',
      },
      {
        dataIndex: 'imgProcConfigStatus',
        width: '300px',
        title: '图片预处理配置状态',
        key: 'imgProcConfigStatus',
      },
      {
        dataIndex: 'action',
        title: '操作',
        key: 'action',
      },
    ];

    const modelDetails = ref();

    // 处理Provider选中
    const selectedProvider = ref({});
    const handleSelectProvider = (modelID, providerData) => {
      selectedProvider.value[modelID] = providerData;
    };

    // 处理模型配置
    const confirmedModelConfig = ref({});
    const handleModelConfigConfirm = (modelID, config) => {
      confirmedModelConfig.value[modelID] = config;
    };

    // 处理图片处理器配置
    const confirmedImgProcConfig = ref({});
    const handleImgProcConfigConfirm = (modelID, config) => {
      confirmedImgProcConfig.value[modelID] = config;
    };

    const commonTransfer = ref();

    const submit = () => {
      let selectedModel = commonTransfer.value.submit();
      if (selectedModel.length == 0) {
        throw new Error('尚未选择任何人工智能模型');
      } else {
        let modelList = new Set();
        let modelConfigList = {};
        let imgProcConfigList = {};

        selectedModel.forEach((element) => {
          let modelID = element['modelID'];
          if (confirmedModelConfig.value[modelID] != null) {
            let bindName = Object.keys(confirmedModelConfig.value[modelID])[0];
            let config = Object.values(confirmedModelConfig.value[modelID])[0];
            modelList.add(bindName);
            modelConfigList[bindName] = JSON.parse(config);
          } else {
            throw new Error('尚未正确配置已选的人工智能模型(模型配置): ' + element['modelName']);
          }

          if (confirmedImgProcConfig.value[modelID] != null) {
            let bindName = Object.keys(confirmedImgProcConfig.value[modelID])[0];
            let config = Object.values(confirmedImgProcConfig.value[modelID])[0];
            modelList.add(bindName);
            imgProcConfigList[bindName] = JSON.parse(config);
          } else {
            throw new Error('尚未正确配置已选的人工智能模型(图像处理器): ' + element['modelName']);
          }
        });
        return [Array.from(modelList), modelConfigList, imgProcConfigList];
      }
    };

    // 处理选中(穿梭框移动)事件
    const handleMoveItemChange = (targetKeys, direction, moveKeys) => {
      if (direction == 'right') {
        nextTick(() => {
          runConfigTaskQueue(); // 触发配置流程
        });
      }
    };

    // 自动配置队列
    const autoConfigTaskQueue = ref([]);
    const runConfigTaskQueue = async () => {
      while (autoConfigTaskQueue.value.length > 0) {
        let task = autoConfigTaskQueue.value.shift();
        await task().catch(() => {});
      }
    };

    return {
      leftTableColumns,
      rightTableColumns,
      modelDetails,
      selectedProvider,
      autoConfigTaskQueue,

      commonTransfer,

      handleSelectProvider,
      handleModelConfigConfirm,
      handleImgProcConfigConfirm,
      handleMoveItemChange,
      runConfigTaskQueue,

      getModelInfo,
      getModelConfig,
      getAllModelBindInfos,
      submit,
    };
  },
});
</script>