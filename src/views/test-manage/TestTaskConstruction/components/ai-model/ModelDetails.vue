<template>
  <a-card size="small" style="width: 100%; overflow:hidden">
    <template #title>
      <div>
        模型详情<span v-if="modelInfo != null"> - {{ modelInfo.modelName }}</span>
      </div>
    </template>
    <a-empty :image="simpleImage" v-if="modelInfo == null" />
    <div v-else>
      <a-row type="flex">
        <a-col flex="0 1 100px">模型名称</a-col>
        <a-col flex="1 1">{{modelInfo.modelName}}</a-col>
      </a-row>
      <a-row type="flex">
        <a-col flex="0 1 100px">简介</a-col>
        <a-col flex="1 1">{{modelInfo.modelDesc }}</a-col>
      </a-row>
      <a-row type="flex">
        <a-col flex="0 1 100px">模型详情</a-col>
        <a-col flex="1 1"><a @click="modelDetailsVisible = true">查看详情</a></a-col>
      </a-row>
      <a-row type="flex">
        <a-col flex="100px">参考论文</a-col>
        <a-col flex="auto"><a :href="modelInfo.modelPaperUrl">{{ modelInfo.modelPaper }}</a></a-col>
      </a-row>
      <a-row type="flex">
        <a-col flex="100px">模型类别</a-col>
        <a-col flex="auto">{{ modelInfo.modelType.modelTypeName }}</a-col>
      </a-row>
      <a-divider />
      <slot name="extra" :record="modelInfo"></slot>
      <a-drawer title="模型详情" placement="right" :visible="modelDetailsVisible" :get-container="false" width="90%" :style="{ position: 'absolute' }"
        @close="modelDetailsVisible = false">
        <p v-html="modelInfo.attackMethodDetails"></p>
      </a-drawer>
    </div>
  </a-card>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { Empty } from 'ant-design-vue';

export default defineComponent({

  name: 'AttackDetails',
  setup() {
    const modelDetailsVisible = ref(false);

    const modelInfo = ref();

    const showDetails = (data) => {
      modelInfo.value = data;
    };

    return {
      modelDetailsVisible,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      modelInfo,
      showDetails,
    };
  },
});
</script>
