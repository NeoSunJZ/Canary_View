<style scoped lang="less">
@import '~ant-design-vue/dist/antd.less';
.dataset-selector {
  display: flex;
  justify-content: center;
  padding-top: 0px !important;
  padding: 10px;
}
</style>

<template>
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
</template>

<script>
import { defineComponent, ref } from 'vue';

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
          return selectedProvider.value[datasetID]['bindDatasetName'];
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
    };
  },
});
</script>