<style scoped lang="less">
@import '~ant-design-vue/dist/antd.less';
.attack-selector {
  display: flex;
  justify-content: center;
  padding: 10px;
}
</style>

<template>
  <a-row>
    <a-col :span="16" class="attack-selector">
      <CommonTransfer :leftTableColumns="leftTableColumns" :rightTableColumns="rightTableColumns" :fields="{id:'attackMethodID'}" :getDataResource="getAtkInfo"
        @change="handleMoveItemChange">

        <template #tableCell="{ column, record }">

          <template v-if="column.key === 'status'">
            <AttackConfigProcessor :atkInfo="record" :currentServerInfo="currentServerInfo" :currentServerDeclaration="currentServerDeclaration"
              :providerID="selectedProvider[record.attackMethodID]" @add-async-task="(task)=>{autoConfigTaskQueue.push(task)}">
            </AttackConfigProcessor>
          </template>

          <template v-if="column.key === 'action'">
            <span>
              <a @click="attackDetails.showDetails(record)">详情 - {{ record["attackMethodName"] }}</a>
              <a-divider type="vertical" />
            </span>
          </template>

        </template>

      </CommonTransfer>
    </a-col>
    <a-col :span="8" class="attack-selector">
      <AttackDetails ref="attackDetails">
        <template #extra="{ record }">
          <CommonProviderSelector :field="{providerID:'attackMethodProviderID',source:'attackMethodSource',bindName:'bindAttackMethodName'}"
            :atkID="record.attackMethodID" :currentServerInfo="currentServerInfo" @selected-provider="handleSelectProvider">
          </CommonProviderSelector>
        </template>
      </AttackDetails>
    </a-col>
  </a-row>
</template>

<script>
import { defineComponent, ref, nextTick } from 'vue';

import { getAtkInfo } from '@/api/atk-api/atkInfo.js';

import CommonTransfer from '../CommonTransfer.vue';
import AttackDetails from './AttackDetails.vue';
import CommonProviderSelector from '../CommonProviderSelector.vue';
import AttackConfigProcessor from '../AttackConfigProcessor.vue';

export default defineComponent({
  name: 'AttackTest',
  props: {
    currentServerInfo: Object,
    currentServerDeclaration: Object,
  },
  components: {
    CommonTransfer,
    AttackDetails,
    AttackConfigProcessor,
    CommonProviderSelector,
  },
  setup() {
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

    const attackDetails = ref();

    // 处理Provider选中
    const selectedProvider = ref({});
    const handleSelectProvider = (atkID, providerID) => {
      selectedProvider.value[atkID] = providerID;
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
      attackDetails,
      selectedProvider,
      autoConfigTaskQueue,

      handleSelectProvider,
      handleMoveItemChange,
      runConfigTaskQueue,
      getAtkInfo,
    };
  },
});
</script>