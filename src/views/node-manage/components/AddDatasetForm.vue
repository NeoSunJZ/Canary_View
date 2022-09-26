<style lang="less" scoped>
.add-attack-method-button {
  margin-bottom: 10px;
}
</style>

<template>
  <a-button class="add-attack-method-button" type="primary" @click="addDatasetFormVisiable = true">新增数据集</a-button>
  <a-modal v-model:visible="addDatasetFormVisiable" :footer="false" :closable='false' :width="600" :bodyStyle="{height:'500px' ,overflow:'scroll'}">
    <h2>新增数据集</h2>
    <a-divider />
    <a-form :model="formState" v-bind="layout" ref="formRef" name="new-dataset-info" :rules="rules" @finish="handleFinish" @finishFailed="handleFinishFailed">
      <a-form-item has-feedback name="name" label="数据集">
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item name="website" label="网址">
        <a-input v-model:value="formState.website" />
      </a-form-item>

      <a-form-item name="introduction" label="简介">
        <a-textarea v-model:value="formState.introduction" style="height:100px" />
      </a-form-item>
      <a-form-item name="classNumber" label="类数量">
        <a-input-number v-model:value="formState.classNumber" />
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 14, offset: 3 }">
        <a-button type="primary" html-type="submit">确定</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">清空</a-button>
        <a-button style="margin-left: 10px" @click="addDatasetFormVisiable=false">取消</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';
import { addAtkMethod } from '@/api/atk-api/atkInfo';

export default defineComponent({
  name: 'AddDatasetForm',
  props: {},
  setup(props, context) {
    const addDatasetFormVisiable = ref(false);
    const formRef = ref();
    const formState = reactive({
      name: '',
      website: '',
      introduction: '',
      classNumber: '',
    });

    // 标签和输入框的布局
    const layout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 19,
      },
    };

    const checkName = async (_rule, value) => {
      if (!value) {
        return Promise.reject('名称不能为空!');
      }
    };
    const checkNumber = async (_rule, value) => {
      if (!value) {
        //
      }
      if (!Number.isInteger(value)) {
        return Promise.reject('Please input digits');
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
      introduction: [
        //
      ],
      classNumber: [
        {
          validator: checkNumber,
          trigger: 'change',
        },
      ],
    };
    const handleFinish = async (value) => {
      //   let success = await addAtkMethod(value.name, value.introduction, value.details, value.paper, value.paperUrl, value.type);
      //   addDatasetFormVisiable.value = false;
      //   context.emit('addAtkInfoSucceed', value);
    };

    const resetForm = () => {
      formRef.value.resetFields();
    };

    // 提交表单且数据验证失败
    const handleFinishFailed = (errors) => {
      console.log(errors);
    };

    return {
      addDatasetFormVisiable,
      formRef,
      formState,
      layout,
      handleFinish,
      handleFinishFailed,
      resetForm,
      checkName,
      checkNumber,
      rules,
    };
  },
});
</script>