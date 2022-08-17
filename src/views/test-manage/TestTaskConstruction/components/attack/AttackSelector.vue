<style scoped lang="less">
@import '~ant-design-vue/dist/antd.less';
.attack-selector {
  display: flex;
  justify-content: center;
  padding-top: 0px !important;
  padding: 10px;
}
</style>

<template>
  <a-row>
    <a-col :span="16" class="attack-selector">
      <CommonTransfer ref="commonTransfer" :leftTableColumns="leftTableColumns" :rightTableColumns="rightTableColumns" :fields="{id:'attackMethodID'}"
        :getDataResource="getAtkInfo" @moveItemChange="handleMoveItemChange">

        <template #tableCell="{ column, record }">

          <template v-if="column.key === 'status'">
            <CommonConfigProcessor :id="record.attackMethodID" :field="{providerID: 'attackMethodProviderID',configID: 'attackMethodConfigID',
              paramsDesc: 'attackMethodArgsHandlerParamsDesc', providerBindName: 'bindAttackMethodName', declarationBindName:'attackMethodName' }"
              :configModelTitle="'攻击方法 '+ record.attackMethodName +' [ AtkID: '+record.attackMethodID+' ] - 高级配置'" :providerType="null"
              :providerID="selectedProvider[record.attackMethodID]==null?null:selectedProvider[record.attackMethodID]['attackMethodProviderID']"
              :currentServerInfo="currentServerInfo" :currentServerDeclaration="currentServerDeclaration['attack']['attackList']" :getConfig="getAtkConfig"
              :getAllBindInfos="getAllAtkBindInfos" @add-async-task="(task)=>{autoConfigTaskQueue.push(task)}" @confirm="handleConfigConfirm">
            </CommonConfigProcessor>
          </template>

          <template v-if="column.key === 'action'">
            <span>
              <a @click.stop="attackDetails.showDetails(record)">详情 - {{ record["attackMethodName"] }}</a>
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
            :id="record.attackMethodID" :currentServerInfo="currentServerInfo" @selected-provider="handleSelectProvider" :getProviderList="getAllAtkBindInfos">
          </CommonProviderSelector>
        </template>
      </AttackDetails>
    </a-col>
  </a-row>
</template>

<script>
import { defineComponent, ref, nextTick } from 'vue';

import { getAtkInfo, getAtkConfig } from '@/api/atk-api/atkInfo.js';
import { getAllAtkBindInfos } from './AtkBindInfoStore';

import CommonTransfer from '../CommonTransfer.vue';
import CommonProviderSelector from '../CommonProviderSelector.vue';
import CommonConfigProcessor from '../CommonConfigProcessor.vue';
import AttackDetails from './AttackDetails.vue';

export default defineComponent({
  name: 'AttackSeletor',
  props: {
    currentServerInfo: Object,
    currentServerDeclaration: Object,
  },
  components: {
    CommonTransfer,
    AttackDetails,
    CommonProviderSelector,
    CommonConfigProcessor,
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
    const handleSelectProvider = (atkID, providerData) => {
      selectedProvider.value[atkID] = providerData;
    };

    // 处理攻击配置
    const confirmedConfig = ref({});
    const handleConfigConfirm = (atkID, config) => {
      confirmedConfig.value[atkID] = config;
    };

    const commonTransfer = ref();

    const submit = () => {
      let selectedAttack = commonTransfer.value.submit();
      if (selectedAttack.length == 0) {
        throw new Error('尚未选择任何攻击方法');
      } else {
        let attackerList = [];
        let configList = {};

        selectedAttack.forEach((element) => {
          let attackMethodID = element['attackMethodID'];
          if (confirmedConfig.value[attackMethodID] != null) {
            let bindName = Object.keys(confirmedConfig.value[attackMethodID])[0];
            let config = Object.values(confirmedConfig.value[attackMethodID])[0];
            attackerList.push(bindName);
            configList[bindName] = JSON.parse(config);
          } else {
            throw new Error('尚未正确配置已选的攻击方法: ' + element['attackMethodName']);
          }
        });
        return [attackerList, configList];
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
      attackDetails,
      selectedProvider,
      autoConfigTaskQueue,

      commonTransfer,

      handleSelectProvider,
      handleConfigConfirm,

      handleMoveItemChange,
      runConfigTaskQueue,
      getAtkInfo,

      getAtkConfig,
      getAllAtkBindInfos,
      submit,
    };
  },
});
</script>