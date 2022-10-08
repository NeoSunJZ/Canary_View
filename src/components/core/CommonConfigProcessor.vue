<style scoped lang="less">
@import '~ant-design-vue/dist/antd.less';
.processor {
  &__refresh {
    color: @primary-color;
  }
}
</style>
<template>
  <div>
    <div>
      <a-tag :color="notice.status">
        <template #icon>
          <CloseCircleOutlined v-if="notice.status == 'error'" />
          <CheckCircleOutlined v-if="notice.status == 'success'" />
          <SyncOutlined :spin="true" v-if="notice.status == 'processing'" />
          <ExclamationCircleOutlined v-if="notice.status == 'warning'" />
        </template>
        {{notice.info}}
      </a-tag>
      <span v-if="declaration!=null">
        <a-divider type="vertical" />
        <a class="ant-dropdown-link" @click.stop="openConfigModel(false)">
          参数配置
        </a>
      </span>
      <a-divider type="vertical" />
      <SyncOutlined @click.stop="task(true)" class="processor__refresh" />
    </div>

    <CommonConfigModel ref="configModel" v-if="declaration!=null" :title="configModelTitle" :field="{configID: field['configID']}" :paramsDesc="declaration[field['paramsDesc']]"
      :providerID="providerID!=null?providerID:defaultProviderID" :providerType="providerType" :getPresetConfig="getConfig" @submit="handleSubmit" @cancel="handleCancel">
    </CommonConfigModel>

  </div>
</template>
<script>
import { defineComponent, onMounted, ref, toRef, nextTick } from 'vue';
import { CloseCircleOutlined, CheckCircleOutlined, SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';

import CommonConfigModel from './CommonConfigModel';

export default defineComponent({
  name: 'ModelConfigProcessor',
  components: {
    CloseCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    ExclamationCircleOutlined,
    CommonConfigModel,
  },
  props: {
    id: Number,
    field: Object,
    configModelTitle: String,

    providerType: String,

    providerID: Number,
    currentServerInfo: Object,
    currentServerDeclaration: Object,

    getConfig: Function,
    getAllBindInfos: Function,
  },
  setup(props, context) {
    const configModel = ref();

    const notice = ref({
      status: 'processing',
      info: '请稍后',
    });

    const setNotice = (info, status) => {
      notice.value.info = info;
      notice.value.status = status;
    };

    onMounted(() => {
      context.emit('add-async-task', task);
    });

    const task = async (update = false) => {
      await openConfigModel(true);
    };

    let promiseFunc = {};

    const defaultProviderID = ref();
    const declaration = ref();

    const openConfigModel = async (autoConfig = false) => {
      let providerBindName = null;
      let allBindInfos = await props.getAllBindInfos(props.id);
      let bindInfos = await getBindInfosByCurrentNodeID(allBindInfos, props.currentServerInfo.nodeID);

      [declaration.value, providerBindName] = await getDeclaration(bindInfos, props.currentServerDeclaration, props.providerID);
      // 检查是否获取成功了
      if (declaration.value == null) return;

      // 如果未指定providerID，使用第一个可用的
      if (props.providerID == null) {
        defaultProviderID.value = bindInfos[0][props.field['providerID']]; // 默认取第一个ProviderID
      }

      await new Promise((resolve, reject) => {
        setNotice('正在完成参数配置', 'processing');
        nextTick(async () => {
          if (!autoConfig) {
            configModel.value.openConfigModel();
          } else {
            configModel.value.autoConfig();
          }
        });

        promiseFunc.resolve = resolve;
        promiseFunc.reject = reject;
      }).then((paramsJSONStr) => {
        let data = {};
        data[providerBindName] = paramsJSONStr;
        context.emit('confirm', props.id, data);
      });
    };

    const handleSubmit = (paramsJSONStr) => {
      setNotice('就绪', 'success');
      promiseFunc.resolve(paramsJSONStr);
    };

    const handleCancel = () => {
      setNotice('未完成参数配置', 'warning');
      promiseFunc.reject();
    };

    const getBindInfosByCurrentNodeID = async (bindInfos, nodeID) => {
      let currentNodeBindInfos = [];
      bindInfos.forEach((element) => {
        if (element.nodeID == nodeID) {
          currentNodeBindInfos.push(element);
        }
      });
      return currentNodeBindInfos;
    };

    const getBindInfoByProviderID = (bindInfos, providerID) => {
      let bindInfo = null;
      bindInfos.forEach((element) => {
        if (element[props.field['providerID']] == providerID) {
          bindInfo = element;
        }
      });
      return bindInfo;
    };

    const getDeclaration = async (bindInfos, currentServerDeclaration, providerID = null) => {
      if (bindInfos.length == 0) {
        setNotice('当前服务节点没有绑定', 'error');
        return [null, null];
      }

      let bindInfo = null;
      if (bindInfos.length > 1) {
        if (providerID == null) {
          setNotice('当前服务节点有多个绑定', 'warning');
          return [null, null];
        } else {
          bindInfo = getBindInfoByProviderID(bindInfos, providerID);
        }
      } else {
        bindInfo = bindInfos[0];
      }

      setNotice('正在获取配置列表', 'processing');
      let declaration = null;
      currentServerDeclaration.forEach((element) => {
        if (element[props.field['declarationBindName']] == bindInfo[props.field['providerBindName']]) {
          declaration = element;
        }
      });
      if (declaration == null) {
        setNotice('当前服务节点未提供绑定的实现', 'error');
      }
      return [declaration, bindInfo[props.field['providerBindName']]];
    };

    return {
      configModel,
      notice,
      defaultProviderID,
      declaration,
      task,
      openConfigModel,
      handleSubmit,
      handleCancel,
    };
  },
});
</script>