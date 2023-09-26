<style scoped lang="less">
@import '@/style.less';
.config-model {
  &__notice {
    margin-bottom: 10px;
  }
  &__preset-config {
    width: 500px;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
    &__box {
      display: flex;
      overflow-x: scroll;
    }
    &__con {
      width: 30px;
      height: 30px;
      position: absolute;
      background: @success-color;
      top: -15px;
      right: -15px;
      transform: rotate(45deg);
    }
    &__title {
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      &--text {
        margin-right: 5px;
        margin-bottom: 0;
      }
    }
    &__desc {
      margin-bottom: 10px;
    }
  }
}
</style>
<template>
  <div>
    <a-modal v-model:visible="visible" :title="title" @cancel="onCancel" width="80%">
      <template #footer>
        <a-button>使用节点默认配置</a-button>
        <a-button>刷新预设配置</a-button>
        <a-button type="primary" @click="handleSubmit">提交配置</a-button>
      </template>
      <a-alert class="config-model__notice" :message="'[自动提交] 将在'+autoSubmitCountDown+'秒后自动使用默认配置并提交(默认配置不存在时使用结点定义的缺省配置，可能需要补全)'" type="info" v-if="autoSubmitFlag" show-icon>
        <template #icon>
          <SyncOutlined :spin="true" />
        </template>
      </a-alert>

      <ParamsForm ref="paramsForm" :paramsDesc="paramsDesc" :showConfirm="false" @submit="onSubmit"></ParamsForm>

      <a-divider></a-divider>

      <a-alert class="config-model__notice" :message="'[自动配置] 存在预设配置，将在'+autoSelectConfigCountDown+'秒后自动选用第一项配置'" type="info" v-if="autoConifgFlag && presetConfig.length!=0 "
        show-icon>
        <template #icon>
          <SyncOutlined :spin="true" />
        </template>
      </a-alert>

      <a-card>
        <template #title>
          预设配置
          <SyncOutlined @click="loadPresetConfig()" />
        </template>
        <div class="config-model__preset-config__box">
          <a-card-grid v-for="(data, index) in presetConfig" :key="index" class="config-model__preset-config" @click="selectConfig(index)">
            <div class="config-model__preset-config__con" v-if="selectedConfigIndex == index"></div>
            <div class="config-model__preset-config__title">
              <h2 class="config-model__preset-config__title--text">{{data.configName}} </h2>
              <a-tag color="default">ConfigID: {{data[field.configID]}}</a-tag>
            </div>
            <div class="config-model__preset-config__desc">
              <a-typography-text type="secondary">{{data.configDesc}}</a-typography-text>
            </div>

            <div>配置信息: </div>
            <div class="config-model__preset-config__config-info">
              <a-textarea :value="data.configJson" :rows="4" readonly />
            </div>
            <div>新增时间: {{data.createTime}}</div>

          </a-card-grid>
        </div>
      </a-card>
    </a-modal>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue';
import { SyncOutlined } from '@ant-design/icons-vue';

import ParamsForm from '@/components/core/ParamsForm.vue';

export default defineComponent({
  components: {
    ParamsForm,
    SyncOutlined,
  },
  emits: ['cancel', 'submit'],
  props: {
    field: Object,
    title: String,
    providerID: Number,
    paramsDesc: Object,
    getPresetConfig: Function,
    providerType: String,
  },
  setup(props, context) {
    const visible = ref(false);

    const autoConifgFlag = ref(false);
    const autoSubmitFlag = ref(false);

    const autoSubmitCountDown = ref(0);
    const autoSelectConfigCountDown = ref(0);

    let autoSubmitTimer;
    let autoSelectConfigTimer;

    const openConfigModel = () => {
      loadPresetConfig();
      visible.value = true;
    };

    const autoConfig = () => {
      openConfigModel();

      autoConifgFlag.value = true;
      autoSubmitFlag.value = true;

      autoSubmitCountDown.value = 6;
      autoSubmitCountDown.value = 3;

      autoSubmitTimer = setInterval(() => {
        if (autoSubmitCountDown.value <= 0) {
          stopAutoSubmit();
          handleSubmit();
        } else {
          autoSubmitCountDown.value -= 1;
        }
      }, 1000);

      autoSelectConfigTimer = setInterval(() => {
        if (autoSelectConfigCountDown.value <= 0) {
          stopAutoSelectConifg();
          selectConfig(0);
        } else {
          autoSelectConfigCountDown.value -= 1;
        }
      }, 1000);
    };

    const stopAutoSubmit = () => {
      clearInterval(autoSubmitTimer);
      autoSubmitFlag.value = false;
    };

    const stopAutoSelectConifg = () => {
      clearInterval(autoSelectConfigTimer);
      autoConifgFlag.value = false;
    };

    const presetConfig = ref([]);
    const selectedConfigIndex = ref(0);

    const loadPresetConfig = async () => {
      presetConfig.value = await props.getPresetConfig(props.providerID, props.providerType);
    };

    const selectConfig = async (index) => {
      selectedConfigIndex.value = index;
      if (presetConfig.value.length != 0 && presetConfig.value[index]) {
        paramsForm.value.jsonStrToparams(presetConfig.value[index].configJson);
      }
    };

    const paramsForm = ref();

    const handleSubmit = () => {
      stopAutoSubmit();
      paramsForm.value.submit();
    };

    const onCancel = () => {
      stopAutoSubmit();
      context.emit('cancel', null);
    };

    const onSubmit = (paramsJSONStr) => {
      stopAutoSubmit();
      visible.value = false;
      context.emit('submit', paramsJSONStr);
    };

    return {
      visible,
      autoSubmitFlag,
      autoConifgFlag,
      autoSubmitCountDown,
      autoSelectConfigCountDown,

      presetConfig,
      selectedConfigIndex,

      handleSubmit,
      onSubmit,
      onCancel,
      autoConfig,
      openConfigModel,
      loadPresetConfig,
      selectConfig,

      paramsForm,
    };
  },
});
</script>