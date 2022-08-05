<style scoped lang="less">
.form {
  &__input {
    display: flex;
    align-items: center;
    &__notice-icon {
      margin-left: 10px;
    }
    &__json {
      &__button {
        margin-left: 8px;
      }
    }
  }
}
</style>
<template>
  <div>
    <a-form ref="formRef" name="advanced_search" class="ant-advanced-search-form" :model="formState" @finish="onFinish" :label-col="{ span: 12 }"
      :wrapper-col="{ span: 12 }">
      <a-row :gutter="24">
        <template v-for="(content,name) in paramsDesc" :key="name">
          <a-col :span="6">
            <a-form-item :name="name" :label="name">
              <div class="form__input">
                <a-input v-model:value="params[name]" placeholder="placeholder" v-if="content.type==='STR'"></a-input>
                <a-input-number v-model:value="params[name]" :step="1" v-if="content.type==='INT'" />
                <a-input-number v-model:value="params[name]" :step="0.01" v-if="content.type==='FLOAT'" />
                <a-select ref="select" v-model:value="params[name]" style="width: 120px" :options="content.selector" :fieldNames="{'label':'name'}"
                  v-if="content.type==='SELECT'"></a-select>
                <a-tooltip placement="right">
                  <template #title>{{content.desc}}</template>
                  <QuestionCircleOutlined class="form__input__notice-icon" />
                </a-tooltip>
              </div>
            </a-form-item>
          </a-col>
        </template>
      </a-row>
      <a-row>
        <a-col :span="24" style="text-align: right;padding-bottom:5px" v-if="expand">
          <a-textarea v-model:value="paramsJSONStr" placeholder="请输入JSON或点击按钮输出JSON" :rows="2" />
        </a-col>
        <a-col :span="24" style="text-align: right;padding-bottom:10px" v-if="expand">
          <a-button class="form__input__json__button" type="primary" html-type="submit" @click="paramsToJSONStr">配置导出为JSON</a-button>
          <a-button class="form__input__json__button" type="primary" html-type="submit" @click="jsonStrToparams">从JSON导入配置</a-button>
          <a-button class="form__input__json__button" @click="paramsJSONStr = null">清空</a-button>
        </a-col>
        <a-col :span="24" style="text-align: right">
          <a style="font-size: 12px" @click="expand = !expand">
            <template v-if="expand">
              <UpOutlined />
            </template>
            <template v-else>
              <DownOutlined />
            </template>
            JSON配置互转
          </a>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from 'vue';
import { QuestionCircleOutlined, UpOutlined, DownOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  components: {
    QuestionCircleOutlined,
    UpOutlined,
    DownOutlined,
  },
  props: {
    paramsDesc: Object,
  },
  setup(props, context) {
    const expand = ref(false);
    const params = ref({});
    const paramsJSONStr = ref('');

    const loadParams = (dataJSON = "{}") => {
      let data = JSON.parse(dataJSON);

      for (let name in props.paramsDesc) {
        params.value[name] = data[name] ? data[name] : props.paramsDesc[name].def ? props.paramsDesc[name].def : null;
      }
    };

    onMounted(() => {
      loadParams();
    });

    const finish = () => {
      return;
    };
    const paramsToJSONStr = () => {
      paramsJSONStr.value = JSON.stringify(params.value);
    };
    const jsonStrToparams = () => {
      loadParams(paramsJSONStr.value);
    };
    return {
      params,
      expand,
      paramsJSONStr,
      paramsToJSONStr,
      jsonStrToparams,
      finish,
    };
  },
});
</script>