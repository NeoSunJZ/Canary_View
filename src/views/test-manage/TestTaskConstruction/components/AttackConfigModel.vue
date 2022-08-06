<style scoped lang="less">
.config-model {
  &__notice {
    margin-bottom: 10px;
  }
}
</style>
<template>
  <div>
    <a-modal v-model:visible="visible" title="Basic Modal" @cancel="onCancel" width="80%">
      <template #footer>
        <a-button>使用节点默认配置</a-button>
        <a-button>刷新预设配置</a-button>
        <a-button type="primary" :loading="loading" @click="handleSubmit">提交配置</a-button>
      </template>
      <a-alert class="config-model__notice" :message="'[自动配置模式] 将在'+autoSubmitCountDown+'秒后自动使用默认配置(默认配置不存在时使用结点定义的缺省配置，可能需要补全)'" type="info" v-if="autoConifgFlag" show-icon>
        <template #icon>
          <SyncOutlined :spin="true" />
        </template>
      </a-alert>

      <ParamsForm ref="paramsForm" :paramsDesc="paramsDesc" :showConfirm="false" @submit="onSubmit " @error="onError"></ParamsForm>
      <a-divider></a-divider>

    </a-modal>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from 'vue';
import { SyncOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import ParamsForm from '@/components/core/ParamsForm.vue';

export default defineComponent({
  components: {
    ParamsForm,
    SyncOutlined,
  },
  props: {
    paramsDesc: Array,
  },
  setup(props, context) {
    const visible = ref(false);

    const autoConifgFlag = ref(false);
    const autoSubmitCountDown = ref(10);

    let autoTimer;

    const autoConifg = () => {
      autoConifgFlag.value = true;
      visible.value = true;

      autoTimer = setInterval(() => {
        if (autoSubmitCountDown.value <= 0) {
          stopAutoConifg();
          handleSubmit();
        } else {
          autoSubmitCountDown.value -= 1;
        }
      }, 1000);
    };

    const stopAutoConifg = () => {
      clearInterval(autoTimer);
      autoConifgFlag.value = false;
    };

    const paramsForm = ref();

    const handleSubmit = () => {
      stopAutoConifg();
      paramsForm.value.submit();
    };

    const onCancel = () => {
      stopAutoConifg();
      context.emit('cancel', null);
    };

    const onSubmit = (paramsJSONStr) => {
      visible.value = false;
      context.emit('submit', paramsJSONStr);
    };

    return {
      visible,
      autoConifgFlag,
      autoSubmitCountDown,
      handleSubmit,
      onSubmit,
      onCancel,
      autoConifg,

      paramsForm,
    };
  },
});
</script>