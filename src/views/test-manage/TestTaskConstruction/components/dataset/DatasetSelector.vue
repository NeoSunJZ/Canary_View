<style scoped lang="less">
@import '@/style.less';
.dataset-selector {
  display: flex;
  justify-content: center;
  padding-top: 0px !important;
  padding: 10px;
}
.dataset-seed {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  &__item {
    margin-right: 10px;
  }
}
</style>

<template>
  <div>
    <a-row>
      <a-col :span="16" class="dataset-selector">
        <CommonTransfer ref="commonTransfer" :leftTableColumns="leftTableColumns" :rightTableColumns="rightTableColumns" :fields="{id:'datasetID'}"
          :getDataResource="getDatasetInfo" :maxItem="1">

          <template #tableCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <span>
                <a @click.stop="datasetDetails.showDetails(record)">详情 - {{ record["datasetName"] }}</a>
                <a-divider type="vertical" />
              </span>
            </template>

          </template>

        </CommonTransfer>
      </a-col>
      <a-col :span="8" class="dataset-selector">
        <DatasetDetails ref="datasetDetails">
          <template #extra="{ record }">
            <CommonProviderSelector :field="{providerID:'datasetProviderID',source:'datasetSource',bindName:'bindDatasetName'}" :id="record.datasetID"
              :currentServerInfo="currentServerInfo" @selected-provider="handleSelectProvider" :getProviderList="getAllDatasetBindInfos">
              <template #extra="{ record }">
                <a-tag color="#cd201f" style="margin-top:5px">
                  <template #icon>
                    <DatabaseOutlined />
                  </template>
                  分类 {{record.datasetTypeDesc}}
                </a-tag>

                <a-tag color="#3b5999" style="margin-top:5px">
                  <template #icon>
                    <TagsOutlined />
                  </template>
                  {{record.isProvideTags=="true"?"提供标签":"不提供标签"}}
                </a-tag>
              </template>
            </CommonProviderSelector>
          </template>
        </DatasetDetails>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24" style="padding: 10px;">
        <a-card size="small">
          <div class="dataset-seed">
            <span class="dataset-seed__item">数据集随机种子</span>
            <a-input-search class="dataset-seed__item" v-model:value="datasetSeed" placeholder="请输入随机数种子" enter-button="随机生成" @search="seed_create" style="width:300px"
              :disabled="!datasetSeedUserAppoint" />
            <span class="dataset-seed__item">自行指定</span>
            <a-switch class="dataset-seed__item" v-model:checked="datasetSeedUserAppoint" />
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';

import { getDatasetInfo } from '@/api/dataset-api/datasetInfo.js';
import { getAllDatasetBindInfos } from './DatasetBindInfoStore';

import CommonTransfer from '@/components/core/CommonTransfer.vue';
import CommonProviderSelector from '@/components/core/CommonProviderSelector.vue';
import DatasetDetails from './DatasetDetails.vue';

import { DatabaseOutlined, TagsOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'ModelSelector',
  props: {
    currentServerInfo: Object,
  },
  components: {
    CommonTransfer,
    DatasetDetails,
    CommonProviderSelector,

    DatabaseOutlined,
    TagsOutlined,
  },
  setup() {
    const leftTableColumns = [
      {
        dataIndex: 'datasetName',
        title: '数据集名称',
        width: '140px',
        fixed: 'left',
      },
      {
        dataIndex: 'datasetDesc',
        width: '480px',
        title: '简介',
      },
      {
        dataIndex: 'datasetClassNumber',
        title: '数据集分类数',
      },
    ];
    const rightTableColumns = [
      {
        dataIndex: 'datasetName',
        title: '数据集名称',
        width: '140px',
        fixed: 'left',
      },
      {
        dataIndex: 'action',
        title: '操作',
        key: 'action',
      },
    ];

    const datasetSeedUserAppoint = ref(false);
    const datasetSeed = ref(null);

    const seed_create = () => {
      let max = 100000000000000000;
      let min = 10000000000000000;
      datasetSeed.value = Math.floor(Math.random() * (max - min + 1)) + min;
    };

    onMounted(() => {
      seed_create();
    });

    const datasetDetails = ref();

    // 处理Provider选中
    const selectedProvider = ref({});
    const handleSelectProvider = (datasetID, providerData) => {
      selectedProvider.value[datasetID] = providerData;
    };

    const commonTransfer = ref();

    const submit = () => {
      let selectedDataset = commonTransfer.value.submit();
      if (selectedDataset.length == 0) {
        throw new Error('尚未选择任何数据集');
      } else {
        let datasetID = selectedDataset[0]['datasetID'];
        if (selectedProvider.value[datasetID] != null) {
          return [selectedProvider.value[datasetID]['bindDatasetName'], datasetSeed];
        } else {
          throw new Error('尚未为已选的数据集选定服务提供者(点击详情选择) : ' + selectedDataset[0]['datasetName']);
        }
      }
    };

    return {
      leftTableColumns,
      rightTableColumns,
      datasetDetails,
      selectedProvider,

      commonTransfer,

      handleSelectProvider,
      getDatasetInfo,
      getAllDatasetBindInfos,

      submit,
      datasetSeedUserAppoint,
      datasetSeed,
      seed_create,
    };
  },
});
</script>