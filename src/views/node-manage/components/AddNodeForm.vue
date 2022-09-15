<!--
 * @FileDescription: 新增节点表单，基本功能完成，逻辑是使用addNodeInfo提交，同时传值给父组件刷新
 * @Todo: 美化表单、校验规则
 -->
<style lang="less" scoped>
.add-node-button {
  margin-bottom: 10px;
}
</style>

<template>
  <a-button class="add-node-button" type="primary" @click="handleAdd">新增节点</a-button>
  <a-modal v-model:visible="visible" width="500px" :footer="null" :closable='false'>
    <h2>新增节点</h2>
    <a-divider />
    <a-form :model="formState" v-bind="layout" ref="formRef" name="new-node-info" :rules="rules" @finish="handleFinish" @finishFailed="handleFinishFailed">
      <a-form-item has-feedback name="name" label="名称">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item has-feedback name="ip" label="IP">
        <a-input v-model:value="formState.ip" />
      </a-form-item>
      <a-form-item has-feedback name="port" label="端口">
        <a-input-number v-model:value="formState.port" />
      </a-form-item>
      <a-form-item name="introduction" label="简介">
        <a-textarea v-model:value="formState.introduction" style="height:100px" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 3 }">
        <a-button type="primary" html-type="submit">确定</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">清空</a-button>
        <a-button style="margin-left: 10px" @click="visible=false">取消</a-button>
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

    // 新增节点按钮
    const handleAdd = () => {
      visible.value = true;
    };

    const formRef = ref();
    // 绑定的表单信息
    const formState = reactive({
      name: '',
      ip: '',
      port: '',
      introduction: '',
    });

    // 表单布局
    const layout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 19,
      },
    };

    const isIP = (ip) => {
      let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      return reg.test(ip);
    };

    const checkName = async (_rule, value) => {
      if (!value) {
        return Promise.reject('名称不能为空!');
      }
    };

    const checkIP = async (_rule, value) => {
      if (!value) {
        return Promise.reject('IP不能为空!');
      } else if (!isIP(value)) {
        return Promise.reject('非法IP!');
      }
    };

    const checkPort = async (_rule, value) => {
      if (!value) {
        return Promise.reject('端口不能为空!');
      } else if (value > 65535 || value < 0) {
        return Promise.reject('非法端口!');
      }
    };

    const rules = {
      name: [
        {
          required: true,
          validator: checkName,
          trigger: 'change',
        },
      ],
      ip: [
        {
          required: true,
          validator: checkIP,
          trigger: 'change',
        },
      ],
      port: [
        {
          required: true,
          validator: checkPort,
          trigger: 'change',
        },
      ],
      introduction: [
        //
      ],
    };
    // 提交表单且数据验证成功
    const handleFinish = async (values) => {
      let success = await addNodeInfo(formState.ip, formState.port, formState.name, formState.introduction);
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

    const resetForm = () => {
      formRef.value.resetFields();
    };

    // 提交表单且数据验证失败
    const handleFinishFailed = (errors) => {
      console.log(errors);
    };

    return {
      formRef,
      visible,
      rules,
      checkName,
      checkIP,
      checkPort,
      handleFinish,
      handleFinishFailed,
      handleAdd,
      resetForm,
      isIP,
      formState,
      layout,
    };
  },
});
</script>