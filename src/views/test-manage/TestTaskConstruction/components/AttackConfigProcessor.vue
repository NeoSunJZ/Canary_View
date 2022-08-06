<style scoped lang="less">
</style>
<template>
  <div>
    <a-tag color="error" v-if="errorNotice != null">
      <template #icon>
        <CloseCircleOutlined />
      </template>
      {{errorNotice}}
    </a-tag>

    <a-tag color="success" v-else-if="successNotice != null">
      <template #icon>
        <CheckCircleOutlined />
      </template>
      {{successNotice}}
    </a-tag>

    <a-tag color="processing" v-else-if="processingNotice != null">
      <template #icon>
        <SyncOutlined :spin="true" />
      </template>
      {{processingNotice}}
    </a-tag>

    <div v-else>
      暂时不可用
    </div>

    <AttackConfigModel ref="attackConfigModel" :paramsDesc="attackDeclaration.attackMethodArgsHandlerParamsDesc" @submit="handleSubmit" @cancel="handleCancel"></AttackConfigModel>

  </div>
</template>
<script>
import { defineComponent, onBeforeMount, ref } from 'vue';
import { CloseCircleOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import AttackConfigModel from './AttackConfigModel';

import { getAtkProvider } from '@/api/atk-api/atkInfo.js';

export default defineComponent({
  components: {
    CloseCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    AttackConfigModel,
  },
  props: {
    attackMethodID: Number,
    currentServerInfo: Object,
    currentServerDeclaration: Object,
  },
  setup(props, context) {
    const processingNotice = ref('请等待');
    const errorNotice = ref(null);
    const successNotice = ref(null);

    const attackBindInfo = ref({});
    const attackDeclaration = ref({});

    const attackConfigModel = ref();

    onBeforeMount(() => {
      context.emit('add-async-task', task);
    });

    let promiseFunc = {};
    const task = async() => {
      // 获取绑定
      processingNotice.value = '正在获取方法绑定的节点信息';
      let attackBindInfoList = await getAtkProvider(props.attackMethodID, props.currentServerInfo.nodeID);
      if (attackBindInfoList.length == 1) {
        attackBindInfo.value = attackBindInfoList[0];
      } else {
        errorNotice.value = '方法未绑定当前服务节点';
        return;
      }

      processingNotice.value = '正在获取配置列表';
      let isfindDeclaration = false;
      props.currentServerDeclaration['attack']['attackList'].forEach((element) => {
        if (element.attackMethodName == attackBindInfo.value.bindAttackMethodName) {
          attackDeclaration.value = element;
          isfindDeclaration = true;
        }
      });
      if (!isfindDeclaration) {
        errorNotice.value = '方法绑定名称在当前节点中不存在';
        return;
      }

      await new Promise((resolve, reject) => {
        processingNotice.value = '正在完成参数配置';
        attackConfigModel.value.autoConifg();

        promiseFunc.resolve = resolve;
        promiseFunc.reject = reject;
      });
    };

    const handleSubmit = (paramsJSONStr) => {
      successNotice.value = '就绪';
      promiseFunc.resolve(paramsJSONStr);
    };

    const handleCancel = () => {
      errorNotice.value = '未完成参数配置';
      promiseFunc.reject();
    };

    return {
      processingNotice,
      errorNotice,
      successNotice,

      attackDeclaration,

      attackConfigModel,

      task,
      handleSubmit,
      handleCancel,
    };
  },
});
</script>