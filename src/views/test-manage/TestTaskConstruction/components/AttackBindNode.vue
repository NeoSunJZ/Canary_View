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
      <a-card size="small" class="provider" v-for="(data,index) in attackBindInfoList" :key="index">
        <div>
          <ApiOutlined
            :class="'provider__icon '+(currentServerInfo.nodeID==data.attackMethodProviderNodeInfo.nodeID ? 'provider__icon--current' : 'provider__icon--disable')" />
          <span class="provider__title">
            <a-typography-text type="secondary">方法实现源: </a-typography-text>
            {{ data.attackMethodSource }}
          </span>
        </div>
        <div class="provider__detail">
          提供者 - {{ data.attackMethodProviderNodeInfo.nodeName }} (NodeID: {{ data.attackMethodProviderNodeInfo.nodeID }})
          <a-tag color="error" v-if="currentServerInfo.nodeID!=data.attackMethodProviderNodeInfo.nodeID">
            <CloseCircleOutlined /> 提供者非当前所选节点
          </a-tag>
          <br />
          提供者路径 - {{ data.attackMethodProviderNodeInfo.host }}:{{ data.attackMethodProviderNodeInfo.port }}<br />
          提供者绑定名 - {{ data.bindAttackMethodName }}
        </div>
        <a-tag color="processing">
          <template #icon>
            ProviderID:{{data.attackMethodProviderID}}
          </template>
        </a-tag>
      </a-card>
    </div>
  </div>
</template>
<script>
import { computed, defineComponent, onMounted, ref, toRef, watch } from 'vue';
import { ApiOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import { initStore, getAttackBindInfoList } from './store';

export default defineComponent({
  components: { ApiOutlined, CloseCircleOutlined },
  props: {
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
      attackBindInfoList.value = await getAttackBindInfoList(atkID.value);
    };

    return {
      attackBindInfoList,
      getAtkBindList,
    };
  },
});
</script>