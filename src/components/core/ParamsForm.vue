<style scoped lang="less">
.form {
  &__input {
    width: 100%;
    &__notice {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
    <a-form ref="formRef" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :model="params" @submit="finish">
      <a-row :gutter="24">
        <template v-for="(content,name) in paramsDesc" :key="name">
          <a-col :span="8">
            <a-form-item :name="name" :label="name" :rules="rules(content)" has-feedback>
              <a-input class="form__input" v-model:value="params[name]" placeholder="placeholder" width="100%" v-if="content.type==='STR'"></a-input>
              <a-input-number class="form__input" v-model:value="params[name]" :step="1" v-if="content.type==='INT'" />
              <a-input-number class="form__input" v-model:value="params[name]" :step="0.01" v-if="content.type==='FLOAT'" />
              <a-select class="form__input" ref="select" v-model:value="params[name]" :options="content.selector" :fieldNames="{'label':'name'}"
                v-if="content.type==='SELECT'"></a-select>
              <template #extra>
                <a-tooltip placement="left">
                  <template #title>{{content.desc}}</template>
                  <div class="form__input__notice">
                    {{content.desc}}
                  </div>
                </a-tooltip>
              </template>
            </a-form-item>
          </a-col>
        </template>
      </a-row>
      <a-row>
        <a-col :span="24" style="text-align: right;padding-bottom:5px" v-if="expand">
          <a-textarea v-model:value="paramsJSONStr" placeholder="请输入JSON或点击按钮输出JSON" :rows="2" />
        </a-col>
        <a-col :span="24" style="text-align: right;padding-bottom:10px" v-if="expand">
          <a-button class="form__input__json__button" type="primary" @click="paramsToJSONStr">配置导出为JSON</a-button>
          <a-button class="form__input__json__button" type="primary" @click="jsonStrToparams">从JSON导入配置</a-button>
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
          <a-button class="form__input__json__button" type="primary" @click="submit" v-show="showConfirm">保存</a-button>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref, h, nextTick } from 'vue';
import { QuestionCircleOutlined, UpOutlined, DownOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
export default defineComponent({
  components: {
    QuestionCircleOutlined,
    UpOutlined,
    DownOutlined,
  },
  props: {
    paramsDesc: Object,
    showConfirm: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, context) {
    const formRef = ref(null);

    const expand = ref(false);
    const params = ref({});
    const paramsJSONStr = ref('');

    const loadParams = (data = {}) => {
      for (let name in props.paramsDesc) {
        let value = data[name] ? data[name] : props.paramsDesc[name].def ? props.paramsDesc[name].def : null;
        if (value == null) {
          params.value[name] = null;
        } else {
          switch (props.paramsDesc[name]['type']) {
            case 'INT':
              params.value[name] = parseInt(value);
              break;
            case 'FLOAT':
              params.value[name] = parseFloat(value);
              break;
            default:
              params.value[name] = String(value);
          }
        }
      }
    };

    const rules = ({ type, required }) => {
      let ruleList = [];
      if (required) {
        ruleList.push({ required: true, message: '警告:该参数必填' });
      }
      if (type == 'INT') {
        ruleList.push({ type: 'integer', message: '限制:该参数必须是整数' });
      }
      if (type == 'FLOAT') {
        ruleList.push({ type: 'number', message: '限制:该参数必须是整数或小数' });
      }
      return ruleList;
    };

    onMounted(() => {
      loadParams();
    });

    const finish = () => {
      return;
    };

    const submit = async () => {
      await formRef.value
        .validate()
        .then(() => {
          context.emit('submit', JSON.stringify(params.value));
        })
        .catch((e) => {
          context.emit('error', e);

          let errorFieldNames = [];
          e.errorFields.forEach((element) => {
            element.name.forEach((name) => {
              errorFieldNames.push(name);
            });
          });
          Modal.error({
            title: '失败',
            content: h('div', {}, [
              h('p', '配置保存失败，请检查字段是否填写正确'),
              h('p', '问题字段(' + errorFieldNames.length + ') : ' + errorFieldNames.join(' / ')),
            ]),
          });
        });
    };

    const paramsToJSONStr = () => {
      paramsJSONStr.value = JSON.stringify(params.value);
    };
    const jsonStrToparams = (jsonStr = null) => {
      if (jsonStr != null) {
        paramsJSONStr.value = jsonStr;
      }
      try {
        let data = JSON.parse(paramsJSONStr.value);
        loadParams(data);
        nextTick(() => {
          formRef.value.validate();
        });
      } catch (e) {
        message.error('JSON字符串验证失败，请检查重试');
        console.log(e);
      }
    };
    return {
      formRef,
      params,
      expand,
      paramsJSONStr,

      paramsToJSONStr,
      jsonStrToparams,
      rules,
      finish,
      submit,
    };
  },
});
</script>