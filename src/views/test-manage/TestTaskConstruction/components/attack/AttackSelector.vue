<style scoped lang="less">
@import '~ant-design-vue/dist/antd.less';
.attack-selector {
  display: flex;
  justify-content: center;
  padding-top: 0px !important;
  padding: 10px;
}
.attack-transfer-selector {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>

<template>
  <div>
    <a-row>
      <a-col :span="24" style="padding: 10px;">
        <a-card size="small">
          <div class="attack-transfer-selector">
            <div>
              攻击转移测试配置:
              <a-radio-group v-model:value="transferAttackTest" button-style="solid">
                <a-radio-button value="NOT">不启用</a-radio-button>
                <a-radio-button value="SELF_CROSS">交叉攻击</a-radio-button>
                <a-radio-button value="APPOINT">单独指定</a-radio-button>
              </a-radio-group>
            </div>
            <a-alert message="将不启用转移测试，仅测试对抗样本在其靶向模型上的攻击效果" type="warning" show-icon v-if="transferAttackTest == 'NOT'" />
            <a-alert message="将启用转移测试，除靶向模型自身外，还将测试对抗样本在该对抗方法已选中的其他模型上的攻击效果" type="warning" show-icon v-if="transferAttackTest == 'SELF_CROSS'" />
            <a-alert type="warning" show-icon v-if="transferAttackTest == 'APPOINT'">
              <template #message>
                将启用转移测试，测试对抗样本在指定的其他模型上的攻击效果，请在对应攻击方法 <a-typography-text type="warning">[详情]</a-typography-text> 中指定
              </template>
            </a-alert>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="16" class="attack-selector">
        <CommonTransfer ref="commonTransfer" :leftTableColumns="leftTableColumns" :rightTableColumns="rightTableColumns" :fields="{id:'attackMethodID'}"
          :getDataResource="getAtkInfo" @move-item-change="handleMoveItemChange">

          <template #tableCell="{ column, record }">

            <template v-if="column.key === 'status'">
              <CommonConfigProcessor :id="record.attackMethodID" :field="{providerID: 'attackMethodProviderID',configID: 'attackMethodConfigID',
              paramsDesc: 'attack_config_params', providerBindName: 'bindAttackMethodName', declarationBindName:'attacker_name' }"
                :configModelTitle="'攻击方法 '+ record.attackMethodName +' [ AtkID: '+record.attackMethodID+' ] - 高级配置'" :providerType="null"
                :providerID="selectedProvider[record.attackMethodID]==null?null:selectedProvider[record.attackMethodID]['attackMethodProviderID']"
                :currentServerInfo="currentServerInfo" :currentServerDeclaration="currentServerDeclaration['registered_component']['attacker_list']" :getConfig="getAtkConfig"
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
            <CommonProviderSelector :field="{providerID:'attackMethodProviderID',source:'attackMethodSource',bindName:'bindAttackMethodName'}" :id="record.attackMethodID"
              :currentServerInfo="currentServerInfo" @selected-provider="handleSelectProvider" :getProviderList="getAllAtkBindInfos">
            </CommonProviderSelector>
            <a-divider></a-divider>
            <a-card size="small">
              <h3 style="margin:0">靶向模型</h3>
              <a-typography-text type="secondary">将在已选中的模型上尝试使用该攻击方法测试</a-typography-text>
              <a-checkbox-group v-model:value="attackAndModelComposeList[record.attackMethodID]" :options="modelList" />
              <a-divider></a-divider>
              <h3 style="margin:0">转移测试</h3>
              <div v-for="(bindModelList,index) in attackAndModelComposeList[record.attackMethodID]" :key="index">
                基于 {{bindModelList}} 生成的对抗样本在以下模型上进行转移测试:
                <a-checkbox-group v-if="transferAttackTest=='NOT'" disabled :value="[bindModelList]" :options="modelList" />
                <a-checkbox-group v-if="transferAttackTest=='SELF_CROSS'" disabled :value="modelList" :options="modelList" />
                <a-checkbox-group v-if="transferAttackTest=='APPOINT'" :options="modelList" v-model:value="transferAttackTestOnModelList[record.attackMethodID][bindModelList]" />
              </div>
            </a-card>
          </template>
        </AttackDetails>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { defineComponent, ref, nextTick, computed, onMounted } from 'vue';

import { getAtkInfo, getAtkConfig } from '@/api/atk-api/atkInfo.js';
import { getAllAtkBindInfos } from './AtkBindInfoStore';

import CommonTransfer from '@/components/core/CommonTransfer.vue';
import CommonProviderSelector from '@/components/core/CommonProviderSelector.vue';
import CommonConfigProcessor from '@/components/core/CommonConfigProcessor.vue';
import AttackDetails from './AttackDetails.vue';

export default defineComponent({
  name: 'AttackSeletor',
  props: {
    currentServerInfo: Object,
    currentServerDeclaration: Object,
    modelList: Array,
  },
  components: {
    CommonTransfer,
    AttackDetails,
    CommonProviderSelector,
    CommonConfigProcessor,
  },
  setup(props, context) {
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

    const attackAndModelComposeList = ref({});

    const submit = () => {
      let selectedAttack = commonTransfer.value.submit();
      if (selectedAttack.length == 0) {
        throw new Error('尚未选择任何攻击方法');
      } else {
        let attackerList = {};
        let configList = {};
        let transferAttackList = {};

        selectedAttack.forEach((element) => {
          let attackMethodID = element['attackMethodID'];
          if (confirmedConfig.value[attackMethodID] != null) {
            let bindName = Object.keys(confirmedConfig.value[attackMethodID])[0];
            let config = Object.values(confirmedConfig.value[attackMethodID])[0];
            attackerList[bindName] = attackAndModelComposeList.value[attackMethodID];
            transferAttackList[bindName] = transferAttackTestOnModelList.value[attackMethodID];
            configList[bindName] = JSON.parse(config);
          } else {
            throw new Error('尚未正确配置已选的攻击方法: ' + element['attackMethodName']);
          }
        });
        return [attackerList, transferAttackTest.value, transferAttackList, configList];
      }
    };

    // 处理选中(穿梭框移动)事件
    const handleMoveItemChange = (targetKeys, direction, moveKeys) => {
      if (direction == 'right') {
        nextTick(() => {
          runConfigTaskQueue(); // 触发配置流程
        });
        moveKeys.forEach((element) => {
          attackAndModelComposeList.value[element] = props.modelList;
          transferAttackTestOnModelList.value[element] = {};
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

    const transferAttackTest = ref('NOT');
    const transferAttackTestOnModelList = ref({});

    return {
      leftTableColumns,
      rightTableColumns,
      attackDetails,
      selectedProvider,
      autoConfigTaskQueue,

      commonTransfer,

      attackAndModelComposeList,
      transferAttackTest,
      transferAttackTestOnModelList,

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