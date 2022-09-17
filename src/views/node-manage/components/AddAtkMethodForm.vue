<style lang="less" scoped>
.add-attack-method-button {
  margin-bottom: 10px;
}
</style>

<template>
  <a-button class="add-attack-method-button" type="primary" @click="addAtkMethodFormVisiable = true">新增方法</a-button>
  <a-modal v-model:visible="addAtkMethodFormVisiable" :footer="false" :closable='false' :width="800" :bodyStyle="{height:'550px' ,overflow:'scroll'}">
    <h2>新增攻击方法</h2>
    <a-divider />
    <a-form :model="formState" v-bind="layout" ref="formRef" name="new-atk-method-info" :rules="rules" @finish="handleFinish"
      @finishFailed="handleFinishFailed">
      <a-form-item has-feedback name="name" label="方法名">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item name="type" label="类别" has-feedback>
        <a-select v-model:value="formState.type" placeholder="请选择" style="width:200px">
          <a-select-option value="1">对抗样本攻击(白盒)</a-select-option>
          <a-select-option value="2">对抗样本攻击(黑盒)</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="introduction" label="简介">
        <a-textarea v-model:value="formState.introduction" style="height:100px" />
      </a-form-item>
      <a-form-item name="paper" label="参考论文">
        <a-input v-model:value="formState.paper" />
      </a-form-item>
      <a-form-item name="paperUrl" label="论文链接">
        <a-input v-model:value="formState.paperUrl" />
      </a-form-item>
      <a-form-item name="details" label="详情">
        <TinyEditor @updateValue="updateValue" :initialValue="initialValue" :width="editorWidth"></TinyEditor>
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 14, offset: 3 }">
        <a-button type="primary" html-type="submit">确定</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">清空</a-button>
        <a-button style="margin-left: 10px" @click="addAtkMethodFormVisiable=false">取消</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';
import TinyEditor from '@/components/TinyEditor.vue';
import { addAtkMethod } from '@/api/atk-api/atkInfo';
// import { notification } from 'ant-design-vue';

export default defineComponent({
  name: 'AddAtkMethodForm',
  components: { TinyEditor },
  props: {},
  setup(props, context) {
    const addAtkMethodFormVisiable = ref(false);
    const formRef = ref();
    const formState = reactive({
      name: '',
      introduction: '',
      paper: '',
      paperUrl: '',
      details: '',
      // type: '',
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

    // 编辑器宽度
    const editorWidth = ref('585px');

    const initialValue = ref('');

    // 接受组件的传值回调
    const updateValue = (value) => {
      formState.details = value;
      initialValue.value = value;
    };

    const checkName = async (_rule, value) => {
      if (!value) {
        return Promise.reject('名称不能为空!');
      }
    };

    const checkType = async (_rule, value) => {
      if (value == undefined) {
        return Promise.reject('请选择类型！');
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
      type: [
        {
          required: true,
          validator: checkType,
          trigger: 'change',
        },
      ],
      introduction: [
        //
      ],
    };
    const handleFinish = async (value) => {
      let success = await addAtkMethod(value.name, value.introduction, value.details, value.paper, value.paperUrl, value.type);
      addAtkMethodFormVisiable.value = false;
      context.emit('addAtkInfoSucceed', value);
    };

    const resetForm = () => {
      formRef.value.resetFields();
      initialValue.value = '';
    };

    // 提交表单且数据验证失败
    const handleFinishFailed = (errors) => {
      console.log(errors);
    };

    return {
      addAtkMethodFormVisiable,
      formRef,
      formState,
      layout,
      updateValue,
      handleFinish,
      handleFinishFailed,
      resetForm,
      initialValue,
      editorWidth,
      checkName,
      checkType,
      rules,
    };
  },
});
</script>