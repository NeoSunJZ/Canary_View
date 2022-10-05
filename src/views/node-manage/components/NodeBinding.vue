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
    <a-select v-model:value="nodeValue" class="model__select" placeholder="请选择" @change="handleChange" :options="dataSource" showSearch></a-select>
    <div>
      <a-button type="primary" html-type="submit" @click="nodeBinding">确定</a-button>
      <a-button style="margin-left: 10px" @click="resetSelect">清空</a-button>
      <a-button style="margin-left: 10px" @click="addNodeVisiable=false">取消</a-button>
    </div>

  </a-modal>
</template>

<script>
import { defineComponent, ref, reactive, onBeforeMount } from 'vue';
import { getAllNodeInfo, getNodeInfo } from '@/api/node-api/nodeinfo';

export default defineComponent({
  name: 'NodeBinding',
  components: {},
  props: {},
  emits: [''],
  setup(props, context) {
    const addNodeVisiable = ref(false);
    const nodeValue = ref([]);

    const resetSelect = () => {
      nodeValue.value = [];
    };

    const handleChange = (value) => {
      console.log(`selected ${value}`);
    };

    const nodeBinding = () => {};

    const dataSource = ref([]);

    onBeforeMount(async () => {
      const data = await getNodeInfo(1, 10);
      data.list.forEach((element, index) => {
        dataSource.value.push({ value: element.nodeName, disabled: false });
      });
    });

    return {
      addNodeVisiable,
      handleChange,
      nodeValue,
      dataSource,
      resetSelect,
      nodeBinding,
    };
  },
});
</script>