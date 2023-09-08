<style scoped lang="less">
@import '~ant-design-vue/dist/antd.less';
</style>

<template>
  <a-form ref="formRef" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" @submit="finish" :model="params">
    <a-row :gutter="24">
      <a-col :span="8">
        <a-form-item name="taskName" label="任务名称" has-feedback :rules="[{ required: true, message: '必须输入任务名称' }]">
          <a-input style="width:100%" v-model:value="params.taskName" placeholder="请输入任务名称" width="100%"></a-input>
        </a-form-item>
        <a-form-item name="taskDesc" label="任务描述" has-feedback :rules="[{ required: true, message: '必须输入任务描述' }]">
          <a-textarea style="width:100%" v-model:value="params.taskDesc" placeholder="请输入任务描述" width="100%"></a-textarea>
        </a-form-item>
        <a-form-item name="datasetSize" label="数据量" has-feedback :rules="[{ type: 'integer', message: '数据量必须是整数' }]">
          <a-input-number style="width:100%" v-model:value="allConfig['dataset_size']" placeholder="请输入测试数据数据量(需小于数据集总量)" :step="1" />
        </a-form-item>
      </a-col>
      <a-col :span="16">
        <a-alert message="最终配置信息预览" type="success" show-icon>
          <template #description>
            <p v-if="currentServerInfo!=null">下列信息将被传递至服务节点 {{currentServerInfo.nodeName}}(NodeID: {{currentServerInfo.nodeID}}) : </p>
            <a-textarea style="width:100%" :value="JSON.stringify(allConfig)" placeholder="请输入任务描述" width="100%" readonly :rows="6"></a-textarea>
          </template>
        </a-alert>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import { computed, defineComponent, reactive, ref, h } from 'vue';
import { newTask } from '@/api/task-api/taskInfo.js';
import { newQuickTaskConfig } from '@/api/config-api/quickTaskConfig.js';
import { Modal } from 'ant-design-vue';

export default defineComponent({
  name: 'TaskSubmit',
  components: {},
  props: {
    config: Object,
    currentServerInfo: String,
    taskTypeID: String,
  },
  setup(props, context) {
    const allConfig = ref(props.config);
    const params = reactive({
      taskName: null,
      taskDesc: null,
      datasetSize: computed(() => {
        return allConfig.value['dataset_size'];
      }),
    });

    const formRef = ref(null);

    const submit = async () => {
      await formRef.value
        .validate()
        .then(async () => {
          let taskID = await newTask(params.taskName, params.taskDesc, props.currentServerInfo['nodeID'], props.taskTypeID, JSON.stringify(allConfig.value));
          context.emit('success', taskID);
        })
        .catch((e) => {
          if (e.errorFields != null) {
            let errorFieldNames = [];
            e.errorFields.forEach((element) => {
              element.name.forEach((name) => {
                errorFieldNames.push(name);
              });
            });
            Modal.error({
              title: '失败',
              content: h('div', {}, [
                h('p', '提交失败，请检查字段是否填写正确'),
                h('p', '问题字段(' + errorFieldNames.length + ') : ' + errorFieldNames.join(' / ')),
              ]),
            });
          } else {
            Modal.error({
              title: '失败',
              content: h('div', {}, [h('p', '提交失败，服务器异常'), h('p', '问题:' + e)]),
            });
          }
        });
    };

    const newQuickConfig = async () => {
      await formRef.value
        .validate()
        .then(async () => {
          let configID = await newQuickTaskConfig(params.taskName, params.taskDesc, props.taskTypeID, JSON.stringify(allConfig.value));
          context.emit('saveSuccess', configID);
        })
        .catch((e) => {
          if (e.errorFields != null) {
            let errorFieldNames = [];
            e.errorFields.forEach((element) => {
              element.name.forEach((name) => {
                errorFieldNames.push(name);
              });
            });
            Modal.error({
              title: '失败',
              content: h('div', {}, [
                h('p', '提交失败，请检查字段是否填写正确'),
                h('p', '问题字段(' + errorFieldNames.length + ') : ' + errorFieldNames.join(' / ')),
              ]),
            });
          } else {
            Modal.error({
              title: '失败',
              content: h('div', {}, [h('p', '提交失败，服务器异常'), h('p', '问题:' + e)]),
            });
          }
        });
    };

    return {
      params,
      allConfig,
      formRef,

      submit,
      newQuickConfig,
    };
  },
});
</script>
