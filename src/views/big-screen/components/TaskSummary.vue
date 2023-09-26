<style scoped lang="less">
@import "../Screen.less";
</style>

<template>
    <div style="display: flex; align-items: center; flex-direction: row;">
      <div style="flex:1">
        <div style="display: flex;flex-direction: row; align-items: center;">
          <a-button class="tag tag--red" type="primary">
            <template #icon>
              <MyIcon type="icon-shougongji" :style="{ fontSize: '24px' }" />
            </template>
          </a-button>
          <div style="margin-left:10px">
            <p style="font-size:14px" class="text">已选定攻击</p>
            <p class="text-muted">{{ attackSelectedNum }}</p>
          </div>
        </div>
        <div style="display: flex;flex-direction: row; align-items: center;">
          <a-button class="tag tag--cyan" type="primary">
            <template #icon>
              <MyIcon type="icon-shujumoxing" :style="{ fontSize: '24px' }" />
            </template>
          </a-button>
          <div style="margin-left:10px">
            <p style="font-size:14px" class="text">已选定模型</p>
            <p class="text-muted">{{ modelSelectedNum }}</p>
          </div>
        </div>
        <div style="display: flex;flex-direction: row; align-items: center;">
          <a-button class="tag tag--orange" type="primary">
            <template #icon>
              <MyIcon type="icon-shujujiguanli" :style="{ fontSize: '24px' }" />
            </template>
          </a-button>
          <div style="margin-left:10px">
            <p style="font-size:14px" class="text">已选定数据集</p>
            <p class="text-muted" v-if="config.dataset == 'ILSVRC-2012'"> ImageNet </p>
            <p class="text-muted" v-else-if="config.dataset == 'CIFAR-100'"> CIFAR-100 </p>
            <p class="text-muted" v-else-if="config.dataset == 'FashionMNIST'"> F-MNIST </p>
            <p class="text-muted" v-else> CIFAR-10 </p>
          </div>
        </div>
        <div style="display: flex;flex-direction: row; align-items: center;">
          <a-button class="tag tag--orange" type="primary">
            <template #icon>
              <MyIcon type="icon-shuliangbiandongtongji" :style="{ fontSize: '24px' }" />
            </template>
          </a-button>
          <div style="margin-left:10px">
            <p style="font-size:14px" class="text">测试量</p>
            <p class="text-muted">{{ config.dataset_size }}</p>
          </div>
        </div>
      </div>
      <div style="flex:2; text-align: right">
        <TransferTestMap></TransferTestMap>
        <p class="text-muted">转移测试示意图</p>
      </div>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';
const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4168693_xvx31sr2sl8.js', // 在 iconfont.cn 上生成
});

import { async } from '@antv/x6/lib/registry/marker/async';
import TransferTestMap from '../TransferTestMap.vue';
import { getTaskByTaskID } from '@/api/task-api/taskInfo.js'
export default defineComponent({
  name: 'ServerNodeStatus',
  components: {
    MyIcon,
    TransferTestMap,
  },
  props: {
  },

  setup(props) {
    const taskID = ref();
    const taskInfo = ref({});
    const config = ref({});
    const attackSelectedNum = ref();
    const modelSelectedNum = ref();
    const loadTaskData = async () => {
      taskInfo.value = await getTaskByTaskID(taskID.value);
      config.value = JSON.parse(taskInfo.value['config']);
      modelSelectedNum.value = Object.keys(config.value['model_config']).length
      attackSelectedNum.value = Object.keys(config.value['attacker_list']).length
    };
    onMounted(() => {
      taskID.value = localStorage.getItem('nowTaskID');
      loadTaskData();
    });
    return {
      taskInfo,
      config,
      attackSelectedNum,
      modelSelectedNum,
    };
  },
},
);
</script>