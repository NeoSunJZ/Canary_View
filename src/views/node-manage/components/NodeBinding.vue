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
    margin-bottom: 200px;
  }
}
</style>

<template>
  <a @click="addNodeVisiable=true">新增节点</a>
  <a-modal v-model:visible="addNodeVisiable" class="model" width="500px" :footer="null" :closable='false'>
    <h2 class="model__title">新增节点</h2>
    <a-select v-model:value="value" mode="multiple" class="model__select" placeholder="Please select" @change="handleChange"
      :options="[...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }))"></a-select>
    <div>
      <a-button type="primary">确定</a-button>
      <a-button>清空</a-button>
      <a-button>取消</a-button>
    </div>

  </a-modal>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
  name: 'NodeBinding',
  components: {},
  props: {},
  emits: ['nodeList'],
  setup(props, context) {
    const addNodeVisiable = ref(false);
    const value = ref([]);
    const handleChange = (value) => {
      console.log(`selected ${value}`);
    };

    return {
      addNodeVisiable,
      handleChange,
      value,
    };
  },
});
</script>