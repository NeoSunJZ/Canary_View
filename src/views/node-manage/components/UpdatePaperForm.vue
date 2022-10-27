<style lang="less" scoped>
</style>

<template>
  <Poptip placement="left-start" width="400" v-model="visible" @on-popper-show='showPaper'>
    <template #content>
      <a-form :model="formState" v-bind="layout" name="new-paper-info" :rules="rules" @finish="handleFinish" @finishFailed="handleFinishFailed">
        <a-form-item has-feedback name="paper" label="论文" style="margin-bottom:1px">
          <a-input size="small" v-model:value="formState.paper" />
        </a-form-item>
        <a-form-item has-feedback name="url" label="链接" style="margin-bottom:1px">
          <a-input size="small" v-model:value="formState.url" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 3 }" style="margin-bottom:1px">
          <a-button type="primary" size="small" html-type="submit">确定</a-button>
          <a-button style="margin-left: 10px" size="small" @click="resetForm">清空</a-button>
          <a-button style="margin-left: 10px" size="small" @click="visible=false">取消</a-button>
        </a-form-item>
      </a-form>
    </template>
    <a-button type="link">修改</a-button>
  </Poptip>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { updateAtkMethod } from '@/api/atk-api/atkInfo';

export default defineComponent({
  name: 'UpdatePaperForm',
  components: {},
  props: {
    paper: { type: String },
    url: { type: String },
  },
  emits: ['newPaper'],
  setup(props, context) {
    const visible = ref(false);

    // 绑定的表单信息
    const formState = reactive({
      paper: '',
      url: '',
    });

    // 表单布局
    const layout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 21,
      },
    };

    const rules = {
      //
    };
    // 提交表单且数据验证成功
    const handleFinish = async () => {
      context.emit('newPaper', formState);
      visible.value = false;
    };

    const resetForm = () => {
      formState.paper = '';
      formState.url = '';
    };

    const showPaper = () => {
      formState.paper = props.paper;
      formState.url = props.url;
    };

    // 提交表单且数据验证失败
    const handleFinishFailed = (errors) => {
      console.log(errors);
    };

    return {
      visible,
      formState,
      layout,
      rules,
      showPaper,
      handleFinish,
      resetForm,
      handleFinishFailed,
    };
  },
});
</script>