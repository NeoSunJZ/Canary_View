<!--
 * @FileDescription: 新增节点表单，基本功能完成，逻辑是使用addNodeInfo提交，同时传值给父组件刷新
 * @Todo: 美化表单、校验规则
 -->

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
      <a-form-item :name="['node', 'port']" label="端口" :rules="[{ required:true}]">
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
import { addNodeInfo } from '@/api/node-api/nodeinfo';
import { notification } from 'ant-design-vue';
export default defineComponent({
  props: {},
  setup(props, context) {
    const visible = ref(false);

    // 确认添加节点
    const handleOk = async () => {
      let success = await addNodeInfo(formState.node.ip, formState.node.port, formState.node.name, formState.node.introduction);
      visible.value = false;
      if (success == false) {
        notification['error']({
          message: '添加失败',
          description: '失败信息',
          duration: 2,
        });
      } else {
        notification['success']({
          message: '添加成功',
          description: '您已成功添加节点',
          duration: 2,
        });
      }
      context.emit('nodeInfo', formState);
    };

    // 新增节点按钮
    const handleAdd = () => {
      visible.value = true;
    };

    // 表单布局
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

    // 校验规则：未完成
    const validateMessages = {
      required: '${label}不能为空',
      types: {
        number: '${label} is not a valid number!',
      },
      number: {
        range: '${label}必须是一个数字',
      },
    };

    // 绑定的表单信息
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
      handleOk,
      handleAdd,
      formState,
      layout,
      validateMessages,
    };
  },
});
</script>