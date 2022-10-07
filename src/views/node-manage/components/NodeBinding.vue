<style lang="less" scoped>
.model {
  display: flex;
  flex-direction: column;
  top: 200px;
  &__title {
    margin-bottom: 10px;
  }
  &__select {
    width: 100%;
  }
}
</style>

<template>
  <a @click="addNodeVisiable=true">新增节点</a>
  <a-modal v-model:visible="addNodeVisiable" class="model" width="500px" :footer="null" :closable='false'>
    <h2 class="model__title">新增节点</h2>
    <a-divider />
    <a-form :model="formState" v-bind="layout" ref="formRef" name="new-node-bind" :rules="rules" @finish="handleFinish" @finishFailed="handleFinishFailed">
      <a-form-item has-feedback name="nodeID" label="节点名">
        <a-select v-model:value="formState.nodeID" class="model__select" placeholder="请选择" @change="handleChange" :field-names="{ label: 'value', value: 'id'}"
          :options="dataSource" showSearch />
      </a-form-item>
      <a-form-item has-feedback name="methodSource" label="方法源">
        <a-input v-model:value="formState.methodSource" />
      </a-form-item>
      <a-form-item has-feedback name="bindingName" label="绑定名">
        <a-input v-model:value="formState.bindingName" />
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 14, offset: 3 }">
        <a-button type="primary" html-type="submit">确定</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">清空</a-button>
        <a-button style="margin-left: 10px" @click="addNodeVisiable=false">取消</a-button>
      </a-form-item>
    </a-form>
  </a-modal>

</template>

<script>
import { defineComponent, ref, reactive, onBeforeMount } from 'vue';
import { getNodeInfo } from '@/api/node-api/nodeinfo';

export default defineComponent({
  name: 'NodeBinding',
  components: {},
  props: {},
  emits: ['nodeBindingMsg', 'nodeBinding'],
  setup(props, context) {
    const formRef = ref();
    const formState = reactive({
      nodeID: '',
      methodSource: '',
      bindingName: '',
    });
    const layout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 19,
      },
    };

    const checkNodeValue = async (_rule, value) => {
      if (value == undefined) {
        return Promise.reject('请选择类型!');
      }
    };
    const checkMethodSource = async (_rule, value) => {
      if (!value) {
        return Promise.reject('方法源不能为空!');
      }
    };
    const checkBindingName = async (_rule, value) => {
      if (!value) {
        return Promise.reject('绑定名不能为空!');
      }
    };

    const rules = {
      nodeID: [
        {
          required: true,
          validator: checkNodeValue,
          trigger: 'change',
        },
      ],
      methodSource: [
        {
          required: true,
          validator: checkMethodSource,
          trigger: 'change',
        },
      ],
      bindingName: [
        {
          required: true,
          validator: checkBindingName,
          trigger: 'change',
        },
      ],
    };

    const addNodeVisiable = ref(false);

    const resetForm = () => {
      formRef.value.resetFields();
    };

    const handleChange = (value) => {
      console.log(`selected ${value}`);
    };

    const dataSource = ref([]);

    const handleFinish = (value) => {
      // console.log(value);
      context.emit('nodeBindingMsg', value);
      context.emit('nodeBinding');
      addNodeVisiable.value = false;
      resetForm();
    };

    const handleFinishFailed = (errors) => {
      console.log(errors);
    };

    onBeforeMount(async () => {
      const data = await getNodeInfo();
      data.forEach((element, index) => {
        dataSource.value.push({ id: element.nodeID, value: element.nodeName + ' ' + element.host + ':' + element.port, disabled: false });
      });
    });

    return {
      rules,
      formRef,
      formState,
      addNodeVisiable,
      layout,
      handleChange,
      dataSource,
      resetForm,
      handleFinish,
      handleFinishFailed,
      checkNodeValue,
      checkMethodSource,
      checkBindingName,
    };
  },
});
</script>