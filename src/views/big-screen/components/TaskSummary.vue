<style scoped lang="less">
.ant-layout {
  background: #25293c;
}

.ant-layout-header {
  background-color: rgba(47, 51, 73, 0.95);
  box-shadow: 0 1px 0 #434968;
}

/deep/ .ant-card-bordered {
  border: unset;
  box-shadow: 0 0.25rem 1.25rem rgba(15, 20, 34, 0.4);
  border-radius: 0.375rem;
  background-clip: padding-box;
  background-color: unset;
}

/deep/ .ant-card-body {
  padding: 16px;
  border-radius: 0.375rem;
  background-color: #2f3349e5;
  border: 0 solid #434968;
}

.ant-divider {
  border-left: 1px solid #7983bb;
}
</style>
<style scoped>
.text {
  margin-top: 0;
  font-weight: 500;
  color: #cfd3ec;
  line-height: unset;
}

.text-muted {
  color: #7983bb !important;
  line-height: unset;
}
</style>
<style scoped lang="less">
.tag {
  border: unset;
  border-radius: 0.375rem !important;

  &__text {
    color: #b6bee3;
  }

  &--green {
    color: #28c76f;
    background-color: #2e4b4f;
  }

  &--purple {
    color: #7367f0;
    background-color: #3a3b64;
  }

  &--cyan {
    color: #00cfe8;
    background-color: #274c62;
  }

  &--red {
    color: #ea5455;
    background-color: #4d384b;
  }

  &--orange {
    color: #ff9f43;
    background-color: #504448;
  }
}
</style>
<style lang="less" scoped>
/deep/ .console {
  &__log-info {
    background-color: #25293c;
  }

  &__log-area {
    border-color: #434968;
  }

  &__log {
    color: #cfd3ec;
  }
}
</style>
<style lang="less" scoped>
.logo {
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 30%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  opacity: 0.4;
}
</style>

<template>
  <a-card style="margin:10px;">
    <p style="font-size:20px" class="text">当前测试任务详情</p>
    <p class="text-muted">测试任务简介 </p>
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
  </a-card>
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