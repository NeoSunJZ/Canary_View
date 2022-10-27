<style lang="less" scoped>
</style>

<template>
  <Poptip placement="left-start" width="400" v-model="visible" @on-popper-show='showDesc'>
    <template #content>
      <a-form :model="formState" v-bind="layout" name="new-desc" :rules="rules" @finish="handleFinish" @finishFailed="handleFinishFailed">
        <a-form-item has-feedback name="details" label="" style="margin-bottom:1px">
          <a-textarea v-model:value="formState.desc" style="height:100px" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 0, offset: 0 }" style="margin-bottom:1px">
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

export default defineComponent({
  name: 'UpdateDesc',
  components: {},
  props: {
    oldDesc: { type: String },
  },
  emits: ['newDesc'],
  setup(props, context) {
    const visible = ref(false);

    // 绑定的表单信息
    const formState = reactive({
      desc: '',
    });

    // 表单布局
    const layout = {
      labelCol: {
        span: 10,
      },
      wrapperCol: {
        span: 0,
      },
    };

    const rules = {
      //
    };
    // 提交表单且数据验证成功
    const handleFinish = async () => {
      context.emit('newDesc', formState.desc);
      visible.value = false;
    };

    const resetForm = () => {
      formState.desc = '';
    };

    const showDesc = () => {
      formState.desc = props.oldDesc;
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
      showDesc,
      handleFinish,
      resetForm,
      handleFinishFailed,
    };
  },
});
</script>