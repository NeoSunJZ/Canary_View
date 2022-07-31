<style lang="less" scoped>
.title {
  margin-bottom: 20px;
}
</style>

<template>
  <h2 class='title'>新增节点</h2>

  <a-form :model="formState" v-bind="layout" name="nest-messages" :validate-messages="validateMessages" @finish="onFinish">
    <a-form-item :name="['node', 'name']" label="名称" :rules="[{ required: true }]">
      <a-input v-model:value="formState.node.name" />
    </a-form-item>
    <a-form-item :name="['node', 'ip']" label="IP" :rules="[{ required: true }]">
      <a-input v-model:value="formState.node.ip" />
    </a-form-item>
    <a-form-item :name="['node', 'port']" label="端口" :rules="[{ type: 'number',required:true}]">
      <a-input-number v-model:value="formState.node.port" />
    </a-form-item>
    <a-form-item :name="['node', 'introduction']" label="简介">
      <a-textarea v-model:value="formState.node.introduction" />
    </a-form-item>
  </a-form>

</template>
<script>
import { defineComponent, reactive } from 'vue';
export default defineComponent({
  setup() {
    const layout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 5,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 16,
        },
      },
    };
    const validateMessages = {
      required: '${label} is required!',
      types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
      },
      number: {
        range: '${label} must be between ${min} and ${max}',
      },
    };
    const formState = reactive({
      node: {
        name: '',
        ip: '',
        port: '',
        introduction: '',
      },
    });

    return {
      formState,
      layout,
      validateMessages,
    };
  },
});
</script>