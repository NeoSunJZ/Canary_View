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
      <span v-if="ready">
        <a-divider type="vertical" />
        <a class="ant-dropdown-link" @click="setConfig">
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

import { attackDeclarationStore, initAttackDeclarationStore, getAttackDeclaration } from './store';

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

    const ready = ref(false);

    const task = async (update = false) => {
      if (!attackDeclarationStore[atkID] || update) {
        initAttackDeclarationStore(atkID);
      }

      notice.value = attackDeclarationStore[atkID].notice;

      ready.value = await getAttackDeclaration(atkID, props.currentServerInfo.nodeID, props.currentServerDeclaration);
      if (!ready.value) return;
      await setConfig();
    };

    let promiseFunc = {};
    const setConfig = async () => {
      await new Promise((resolve, reject) => {
        setNotice('正在完成参数配置', 'processing');

        let paramsDesc = attackDeclarationStore[atkID].attackDeclaration['attackMethodArgsHandlerParamsDesc'];
        let atkProviderID = attackDeclarationStore[atkID].attackBindInfo['attackMethodProviderID'];
        attackConfigModel.value.autoConifg(paramsDesc, atkInfo.value, atkProviderID);

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
      attackDeclarationStore,
      attackConfigModel,
      notice,
      ready,
      task,
      setConfig,
      handleSubmit,
      handleCancel,
    };
  },
});
</script>