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
      <span v-if="attackDeclaration!=null">
        <a-divider type="vertical" />
        <a class="ant-dropdown-link" @click="setConfig(false)">
          参数配置
        </a>
      </span>
      <a-divider type="vertical" />
      <SyncOutlined @click="task(true)" class="processor__refresh" />
    </div>

    <AttackConfigModel ref="attackConfigModel" @submit="handleSubmit" @cancel="handleCancel">
    </AttackConfigModel>

  </div>
</template>
<script>
import { defineComponent, onBeforeMount, onMounted, ref, toRef } from 'vue';
import { CloseCircleOutlined, CheckCircleOutlined, SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import AttackConfigModel from './AttackConfigModel';

import { attackConfigNotice, initStore, getAttackDeclaration, getAttackBindInfosByNodeID, getBindInfoByProviderID } from './store';

export default defineComponent({
  components: {
    CloseCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    ExclamationCircleOutlined,
    AttackConfigModel,
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

    const attackConfigModel = ref();

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

      await setConfig(true);
    };

    const attackDeclaration = ref();

    let promiseFunc = {};
    const setConfig = async (autoConfig = false) => {
      // 检查是否已获取SEFI的声明
      attackDeclaration.value = await getAttackDeclaration(atkID, props.currentServerInfo.nodeID, props.currentServerDeclaration, props.providerID);
      // 检查是否获取成功了
      if (attackDeclaration.value == null) return;

      // 如果已经指定了providerID，直接使用指定的
      let atkProviderID = props.providerID;
      if (atkProviderID == null) {
        let attackBindInfos = await getAttackBindInfosByNodeID(atkID, props.currentServerInfo.nodeID);
        let attackBindInfo = attackBindInfos[0]; // 没指定，默认取第一个ProviderID
        atkProviderID = attackBindInfo['attackMethodProviderID'];
      }

      let paramsDesc = attackDeclaration.value['attackMethodArgsHandlerParamsDesc'];
      await new Promise((resolve, reject) => {
        setNotice('正在完成参数配置', 'processing');
        if (!autoConfig) {
          attackConfigModel.value.openConfigModel(paramsDesc, atkInfo.value, atkProviderID);
        } else {
          attackConfigModel.value.autoConfig(paramsDesc, atkInfo.value, atkProviderID);
        }

        promiseFunc.resolve = resolve;
        promiseFunc.reject = reject;
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
      attackConfigModel,
      notice,
      attackDeclaration,
      task,
      setConfig,
      handleSubmit,
      handleCancel,
    };
  },
});
</script>