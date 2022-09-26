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
    margin-bottom: 280px;
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
      <a-button type="primary" html-type="submit" @click="nodeBinding">确定</a-button>
      <a-button style="margin-left: 10px" @click="resetSelect">清空</a-button>
      <a-button style="margin-left: 10px" @click="addNodeVisiable=false">取消</a-button>
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

    const resetSelect = () => {
      value.value = [];
    };

    const handleChange = (value) => {
      console.log(`selected ${value}`);
    };

    const nodeBinding = () => {
      context.emit('nodeList', value.value);
    };

    return {
      addNodeVisiable,
      handleChange,
      value,
      resetSelect,
      nodeBinding,
    };
  },
});
</script>