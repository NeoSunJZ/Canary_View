<style scoped lang="less">
@import '~ant-design-vue/dist/antd.less';
.processor {
  &__refresh {
    color: @primary-color;
  }
}
</style>
<template>
  <div>
    <div>
      <a-tag :color="notice.status">
        <template #icon>
          <CloseCircleOutlined v-if="notice.status == 'error'" />
          <CheckCircleOutlined v-if="notice.status == 'success'" />
          <SyncOutlined :spin="true" v-if="notice.status == 'processing'" />
          <ExclamationCircleOutlined v-if="notice.status == 'warning'" />
        </template>
        {{notice.info}}
      </a-tag>
      <span v-if="attackParamsDesc!=null">
        <a-divider type="vertical" />
        <a class="ant-dropdown-link" @click="openConfigModel(false)">
          参数配置
        </a>
      </span>
      <a-divider type="vertical" />
      <SyncOutlined @click="task(true)" class="processor__refresh" />
    </div>

    <CommonConfigModel ref="configModel" :title="'攻击方法 '+ atkInfo.attackMethodName +' [ AtkID: '+atkInfo.attackMethodID+' ] - 高级配置'"
      :paramsDesc="attackParamsDesc" :providerID="providerID!=null?providerID:defaultProviderID" :getPresetConfig="getAtkConfig" @submit="handleSubmit"
      @cancel="handleCancel">
    </CommonConfigModel>

  </div>
</template>
<script>
import { defineComponent, onMounted, ref, toRef, nextTick } from 'vue';
import { CloseCircleOutlined, CheckCircleOutlined, SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';

import CommonConfigModel from '../CommonConfigModel';
import { attackConfigNotice, initStore, getAttackDeclaration, getAttackBindInfosByNodeID } from './store';
import { getAtkConfig } from '@/api/atk-api/atkInfo.js';

export default defineComponent({
  name: 'AttackConfigProcessor',
  components: {
    CloseCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    ExclamationCircleOutlined,
    CommonConfigModel,
  },
  props: {
    atkInfo: Object,
    providerID: Number,
    currentServerInfo: Object,
    currentServerDeclaration: Object,
  },
  setup(props, context) {
    const atkInfo = toRef(props, 'atkInfo');
    const atkID = atkInfo.value['attackMethodID'];

    const configModel = ref();

    const notice = ref({
      status: 'processing',
      info: '请稍后',
    });

    const setNotice = (info, status) => {
      notice.value.info = info;
      notice.value.status = status;
    };

    onMounted(() => {
      context.emit('add-async-task', task);
    });

    const task = async (update = false) => {
      initStore(atkID, update);

      notice.value = attackConfigNotice[atkID];

      await openConfigModel(true);
    };

    let promiseFunc = {};

    const defaultProviderID = ref();
    const attackParamsDesc = ref();

    const openConfigModel = async (autoConfig = false) => {
      // 检查是否已获取SEFI的声明
      let attackDeclaration = await getAttackDeclaration(atkID, props.currentServerInfo.nodeID, props.currentServerDeclaration, props.providerID);
      // 检查是否获取成功了
      if (attackDeclaration == null) return;

      // 如果未指定providerID，使用第一个可用的
      if (props.providerID == null) {
        let attackBindInfos = await getAttackBindInfosByNodeID(atkID, props.currentServerInfo.nodeID);
        defaultProviderID.value = attackBindInfos[0]['attackMethodProviderID']; // 默认取第一个ProviderID
      }

      attackParamsDesc.value = attackDeclaration['attackMethodArgsHandlerParamsDesc'];
      nextTick(async () => {
        await new Promise((resolve, reject) => {
          setNotice('正在完成参数配置', 'processing');
          if (!autoConfig) {
            configModel.value.openConfigModel();
          } else {
            configModel.value.autoConfig();
          }

          promiseFunc.resolve = resolve;
          promiseFunc.reject = reject;
        });
      });
    };

    const handleSubmit = (paramsJSONStr) => {
      setNotice('就绪', 'success');
      promiseFunc.resolve(paramsJSONStr);
    };

    const handleCancel = () => {
      setNotice('未完成参数配置', 'warning');
      promiseFunc.reject();
    };

    return {
      atkID,
      configModel,
      notice,
      defaultProviderID,
      attackParamsDesc,
      task,
      openConfigModel,
      handleSubmit,
      handleCancel,
      getAtkConfig,
    };
  },
});
</script>