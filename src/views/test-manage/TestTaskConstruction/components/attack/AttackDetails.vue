<template>
  <a-card size="small" style="width: 100%; overflow:hidden">
    <template #title>
      <div>
        攻击方法详情<span v-if="attackMethodInfo != null"> - {{ attackMethodInfo.attackMethodName }}</span>
      </div>
    </template>
    <a-empty :image="simpleImage" v-if="attackMethodInfo == null" />
    <div v-else>
      <a-row type="flex">
        <a-col flex="0 1 100px">方法名称</a-col>
        <a-col flex="1 1">{{attackMethodInfo.attackMethodName}}</a-col>
      </a-row>
      <a-row type="flex">
        <a-col flex="0 1 100px">简介</a-col>
        <a-col flex="1 1">{{attackMethodInfo.attackMethodDesc }}</a-col>
      </a-row>
      <a-row type="flex">
        <a-col flex="0 1 100px">方法详情</a-col>
        <a-col flex="1 1"><a @click="methodDetailsVisible = true">查看详情</a></a-col>
      </a-row>
      <a-row type="flex">
        <a-col flex="100px">参考论文</a-col>
        <a-col flex="auto"><a :href="attackMethodInfo.attackMethodPaperUrl">{{ attackMethodInfo.attackMethodPaper }}</a></a-col>
      </a-row>
      <a-row type="flex">
        <a-col flex="100px">方法类别</a-col>
        <a-col flex="auto">{{ attackMethodInfo.attackMethodType.attackMethodTypeName }}</a-col>
      </a-row>
      <a-divider />
      <slot name="extra" :record="attackMethodInfo"></slot>
      <a-drawer title="方法详情" placement="right" :visible="methodDetailsVisible" :get-container="false" width="90%" :style="{ position: 'absolute' }"
        @close="methodDetailsVisible = false">
        <p v-html="attackMethodInfo.attackMethodDetails"></p>
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
    const methodDetailsVisible = ref(false);

    const attackMethodInfo = ref();

    const showDetails = (data) => {
      attackMethodInfo.value = data;
    };

    return {
      methodDetailsVisible,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      attackMethodInfo,
      showDetails,
    };
  },
});
</script>
