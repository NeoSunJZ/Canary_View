<template>
  <a-card size="small" style="width: 100%; overflow:hidden">
    <template #title>
      <div>
        数据集详情<span v-if="datasetInfo != null"> - {{ datasetInfo.datasetName }}</span>
      </div>
    </template>
    <a-empty :image="simpleImage" v-if="datasetInfo == null" />
    <div v-else>
      <a-row type="flex">
        <a-col flex="0 1 100px">数据集名称</a-col>
        <a-col flex="1 1">{{datasetInfo.datasetName}}</a-col>
      </a-row>
      <a-row type="flex">
        <a-col flex="0 1 100px">简介</a-col>
        <a-col flex="1 1">{{datasetInfo.datasetDesc }}</a-col>
      </a-row>
      <a-row type="flex">
        <a-col flex="100px">数据集获取</a-col>
        <a-col flex="auto"><a :href="datasetInfo.modelPaperUrl">点击跳转</a></a-col>
      </a-row>
      <a-row type="flex">
        <a-col flex="100px">模型分类数</a-col>
        <a-col flex="auto">{{ datasetInfo.datasetClassNumber }}</a-col>
      </a-row>
      <a-divider />
      <slot name="extra" :record="datasetInfo"></slot>
    </div>
  </a-card>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { Empty } from 'ant-design-vue';

export default defineComponent({

  name: 'AttackDetails',
  setup() {
    const datasetInfo = ref();

    const showDetails = (data) => {
      datasetInfo.value = data;
    };

    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      datasetInfo,
      showDetails,
    };
  },
});
</script>
