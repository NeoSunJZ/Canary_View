<style lang="less" scoped>
.title {
  margin-bottom: 20px;
}
</style>

<template>
  <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd">新增节点</a-button>

  <a-modal v-model:visible="visible" okText="确定" cancelText="取消" width="500px" @ok="handleOk" :closable='false'>
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
  </a-modal>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue';
export default defineComponent({
  props: {},
  setup() {
    const visible = ref(false);
    const handleAdd = () => {
      visible.value = true;
    };
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
      required: '${label}不能为空',
      types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
      },
      number: {
        range: '${label}必须是一个数字',
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
      visible,
      handleAdd,
      formState,
      layout,
      validateMessages,
    };
  },
});
</script>