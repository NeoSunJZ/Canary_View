<style lang="less" scoped>
</style>

<template>
  <Poptip placement="left-start" width="400" v-model="changeWebVisible" @on-popper-show='showUrl'>
    <template #content>
      <a-form :model="formState" v-bind="layout" name="new-paper-info" :rules="rules" @finish="handleFinish" @finishFailed="handleFinishFailed">
        <a-form-item has-feedback name="website" label="网址" style="margin-bottom:1px">
          <a-input size="small" v-model:value="formState.url" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 3 }" style="margin-bottom:1px">
          <a-button type="primary" size="small" html-type="submit">确定</a-button>
          <a-button style="margin-left: 10px" size="small" @click="formState.url=''">清空</a-button>
          <a-button style="margin-left: 10px" size="small" @click="changeWebVisible=false">取消</a-button>
        </a-form-item>
      </a-form>
    </template>
    <a-button type="link">修改</a-button>
  </Poptip>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
  name: 'UpdateDatasetWebsite',
  components: {},
  props: {
    url: { type: String },
  },
  emits: ['newUrl'],
  setup(props, context) {
    const changeWebVisible = ref(false);

    // 绑定的表单信息
    const formState = reactive({
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
    const handleFinish = () => {
      context.emit('newUrl', formState.url);
      changeWebVisible.value = false;
    };

    const resetForm = () => {
      formState.url = '';
    };

    const showUrl = () => {
      formState.url = props.url;
    };

    // 提交表单且数据验证失败
    const handleFinishFailed = (errors) => {
      console.log(errors);
    };

    return {
      changeWebVisible,
      formState,
      layout,
      rules,
      showUrl,
      handleFinish,
      resetForm,
      handleFinishFailed,
    };
  },
});
</script>