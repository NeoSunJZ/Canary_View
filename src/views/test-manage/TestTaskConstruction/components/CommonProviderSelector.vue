<style scoped lang="less">
@import '~ant-design-vue/dist/antd.less';
.provider-list {
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
}
.provider {
  flex-shrink: 0;
  width: 260px;
  height: 100%;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  &__con {
    width: 30px;
    height: 30px;
    position: absolute;
    background: @success-color;
    top: -15px;
    right: -15px;
    transform: rotate(45deg);
  }
  &__icon {
    font-size: 32px;
    &--current {
      color: @primary-color;
    }
    &--disable {
      color: @error-color;
    }
  }
  &__title {
    margin-left: 10px;
  }
  &__detail {
    margin: 10px 0;
  }
}
</style>
<template>
  <div>
    <div class="provider-list">
      <a-card size="small" class="provider" v-for="(data,index) in attackBindInfoList" :key="index"
        @click="currentServerInfo.nodeID==data.nodeInfo.nodeID?selectProvider(data[field.providerID]):()=>{}">
        <div class="provider__con" v-if="data[field.providerID] == selectedProviderID"></div>
        <div>
          <ApiOutlined :class="'provider__icon '+(currentServerInfo.nodeID==data.nodeInfo.nodeID ? 'provider__icon--current' : 'provider__icon--disable')" />
          <span class="provider__title">
            <a-typography-text type="secondary">方法实现源: </a-typography-text>
            {{ data[field.source] }}
          </span>
        </div>
        <div class="provider__detail">
          提供者 - {{ data.nodeInfo.nodeName }} (NodeID: {{ data.nodeInfo.nodeID }})
          <a-tag color="error" v-if="currentServerInfo.nodeID!=data.nodeInfo.nodeID">
            <CloseCircleOutlined /> 提供者非当前所选节点
          </a-tag>
          <br />
          提供者路径 - {{ data.nodeInfo.host }}:{{ data.nodeInfo.port }}<br />
          提供者绑定名 - {{ data[field.bindName] }}
        </div>
        <a-tag color="processing">
          <template #icon>
            ProviderID:{{ data[field.providerID] }}
          </template>
        </a-tag>
      </a-card>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref, toRef, watch } from 'vue';
import { ApiOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';

import { initStore, getAllAttackBindInfos } from './store';

export default defineComponent({
  components: { ApiOutlined, CloseCircleOutlined },
  props: {
    field: Object,
    atkID: Number,
    currentServerInfo: Object,
  },
  setup(props, context) {
    const atkID = toRef(props, 'atkID');

    watch(
      () => atkID.value,
      async (newValue, oldValue) => {
        await getAtkBindList();
      }
    );

    onMounted(async () => {
      await getAtkBindList();
    });

    const attackBindInfoList = ref([]);
    const getAtkBindList = async (update = false) => {
      initStore(atkID.value, update);
      attackBindInfoList.value = await getAllAttackBindInfos(atkID.value);
    };

    const selectedProviderID = ref();
    const selectProvider = (providerID) => {
      selectedProviderID.value = providerID;
      context.emit('selected-provider', atkID.value, providerID);
    };

    return {
      attackBindInfoList,
      getAtkBindList,
      selectProvider,
      selectedProviderID,
    };
  },
});
</script>