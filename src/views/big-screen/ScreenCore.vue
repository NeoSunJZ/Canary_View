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
  <a-layout style="min-height: 100vh;">
    <div class="logo" :style="{ 'background-image': 'url(' + require('@/assets/image/logo/screen_logo.png') + ')' }">
    </div>
    <a-layout-header>
      <div style="display: flex; align-items: center;">
        <img src="@/assets/image/logo/logo_2.png" height="50" />
        <h1 class="text" style="margin:0px 10px"> 人工智能模型鲁棒性评估平台</h1>
        <p class="text"><a-tag class="tag tag--green">数据大盘</a-tag></p>
      </div>
    </a-layout-header>
    <a-layout-content>
      <div style="padding:10px">
        <div style="display:flex;">
          <div style="flex: 1;display: flex;flex-direction: column;">
            <!-- NodeInfo. -->
            <NodeInfo />
            <!-- NodeInfo. -->
            <a-empty :image="require('@/assets/icon/wait.svg')" v-if="nodeServerAddr == null">
              <template #description>
                <p class="text-muted">请等待节点信息加载</p>
              </template>
            </a-empty>
            <ServerNodeStatus v-else :nodeServerAddr="nodeServerAddr" />
            <a-divider style="height: 1px; background-color: #7983bb; margin:5px 0" />
            <a-card style="margin:10px">
              <p style="font-size:20px" class="text">关于</p>
              <p class="text-muted">评估平台摘要</p>
              <br />
              <a-card style="border: 1px solid #434968 !important; box-shadow:unset;">
                <p style="font-size:16px" class="text">
                  金丝雀人工智能鲁棒性评估平台（定制版）
                </p>
                <p class="text-muted">
                  核心系统版本
                  <span class="text"> Canary V2.2.1.32_CUSTOM
                  </span>
                </p>
                <p class="text-muted">
                  SEFI版本
                  <span class="text"> SEFI V2.0.3
                  </span><a-divider type="vertical" />
                  SEFI Lib版本 <span class="text"> Build-in Lib V1.0.1</span>
                </p>
                <a-divider style="height: 1px; background-color: #7983bb; margin:5px 0" />
                <p class="text-muted">
                  许可证
                  <span class="text"> 不限数量的设备
                    <a-tag class="tag tag--green">Pro+ 控制中心版</a-tag>
                  </span><a-divider type="vertical" />
                  许可证有效期 <span class="text"> 永久</span>
                </p>
              </a-card>
            </a-card>
          </div>
          <div style="flex: 2;">
            <div style="display: flex;flex-direction: row;">
              <a-card style="flex: 1;margin:10px">
                <div style="display: flex;flex-direction: row; align-items: center;">
                  <a-button class="tag tag--orange" type="primary">
                    <template #icon>
                      <MyIcon type="icon-shougongji" :style="{ fontSize: '24px' }" />
                    </template>
                  </a-button>
                  <div style="margin-left:20px">
                    <p style="font-size:16px" class="text">可用攻击方法数量</p>
                    <p class="text-muted"><span class="text">15</span> 白盒 | <span class="text">14</span> 黑盒</p>
                  </div>
                </div>
              </a-card>
              <a-card style="flex: 1;margin:10px">
                <div style="display: flex;flex-direction: row; align-items: center;">
                  <a-button class="tag tag--orange" type="primary">
                    <template #icon>
                      <MyIcon type="icon-shield-full" :style="{ fontSize: '24px' }" />
                    </template>
                  </a-button>
                  <div style="margin-left:20px">
                    <p style="font-size:16px" class="text">可用防御方法数量</p>
                    <p class="text-muted"><span class="text">3</span> 对抗训练 | <span class="text">3</span> 预处理</p>
                  </div>
                </div>
              </a-card>
              <a-card style="flex: 1;margin:10px">
                <div style="display: flex;flex-direction: row; align-items: center;">
                  <a-button class="tag tag--cyan" type="primary">
                    <template #icon>
                      <MyIcon type="icon-renwu" :style="{ fontSize: '24px' }" />
                    </template>
                  </a-button>
                  <div style="margin-left:20px">
                    <p style="font-size:16px" class="text">已构建测试任务</p>
                    <p class="text-muted">今日 <span class="text">8</span> 次 / 共 <span class="text">291</span> 次</p>
                  </div>
                </div>
              </a-card>
              <a-card style="flex: 1;margin:10px">
                <div style="display: flex;flex-direction: row; align-items: center;">
                  <a-button class="tag tag--cyan" type="primary">
                    <template #icon>
                      <MyIcon type="icon-renwu" :style="{ fontSize: '24px' }" />
                    </template>
                  </a-button>
                  <div style="margin-left:20px">
                    <p style="font-size:16px" class="text">已完成测试任务</p>
                    <p class="text-muted">今日 <span class="text">5</span> 次 / 共 <span class="text">258</span> 次</p>
                  </div>
                </div>
              </a-card>
              <a-card style="flex: 1;margin:10px">
                <div style="display: flex;flex-direction: row; align-items: center;">
                  <a-button class="tag tag--red" type="primary">
                    <template #icon>
                      <MyIcon type="icon-shibai" :style="{ fontSize: '24px' }" />
                    </template>
                  </a-button>
                  <div style="margin-left:20px">
                    <p style="font-size:16px" class="text">已失败测试任务</p>
                    <p class="text-muted">今日 <span class="text">0</span> 次 / 共 <span class="text">1</span> 次</p>
                  </div>
                </div>
              </a-card>
            </div>
            <div style="display: flex;">
              <div style="flex: 2; display: flex;flex-direction: column;">
                <a-card style="margin:10px;">
                  <p style="font-size:20px" class="text">服务节点任务执行组件态势</p>
                  <p class="text-muted">各组件工作状态实时监控</p>
                  <br />
                  <div style="display: flex; align-items: center; flex-direction: column;">
                    <DMGraph ref="dmGraph" />
                  </div>
                </a-card>
                <a-card style="margin:10px">
                  <p style="font-size:20px" class="text">实时SEFI系统日志</p>
                  <p class="text-muted">节点Console</p>
                  <WebConsole ref="webConsole" v-if="taskInfo != null" :showTitle="false" maxHeight="95px"
                    :nodeServerAddr="nodeServerAddr" @received="onReceived">
                  </WebConsole>
                </a-card>
                <a-card style="margin:10px">
                  <p style="font-size:20px" class="text">当前测试任务结论</p>
                  <p class="text-muted">测试指标结果</p>
                  <br />

                  <div style="display: flex; align-items: center; flex-direction: row; justify-content: space-around;">
                    <div style="display: flex;flex-direction: row; align-items: center;">
                      <a-button class="tag tag--orange" type="primary">
                        <template #icon>
                          <MyIcon type="icon-biaoqianlan" :style="{ fontSize: '24px' }" />
                        </template>
                      </a-button>
                      <div style="margin-left:10px">
                        <p style="font-size:14px" class="text">误分类率 / MR</p>
                        <p class="text-muted">98%</p>
                      </div>
                    </div>
                    <div style="display: flex;flex-direction: row; align-items: center;">
                      <a-button class="tag tag--orange" type="primary">
                        <template #icon>
                          <MyIcon type="icon-flow-suanzi-shenduxuexituili" :style="{ fontSize: '24px' }" />
                        </template>
                      </a-button>
                      <div style="margin-left:10px">
                        <p style="font-size:14px" class="text">置信偏移 / ACC</p>
                        <p class="text-muted">AIAC 0.7 / ARTC 0.8</p>
                      </div>
                    </div>
                    <div style="display: flex;flex-direction: row; align-items: center;">
                      <a-button class="tag tag--orange" type="primary">
                        <template #icon>
                          <MyIcon type="icon-juliceliang" :style="{ fontSize: '24px' }" />
                        </template>
                      </a-button>
                      <div style="margin-left:10px">
                        <p style="font-size:14px" class="text">范数距离 / AND</p>
                        <p class="text-muted">AMD 0.01 / AED 0.7 </p>
                      </div>
                    </div>
                    <div style="display: flex;flex-direction: row; align-items: center;">
                      <a-button class="tag tag--orange" type="primary">
                        <template #icon>
                          <MyIcon type="icon-ic_huazhi" :style="{ fontSize: '24px' }" />
                        </template>
                      </a-button>
                      <div style="margin-left:10px">
                        <p style="font-size:14px" class="text">图像质量 / AMS</p>
                        <p class="text-muted">ADMS 0.01 / ALMS 0.01</p>
                      </div>
                    </div>
                  </div>
                </a-card>
              </div>
              <div style="flex: 1; display: flex;flex-direction: column;">
                <!-- TaskSummary. -->
                <TaskSummary />
                <!-- TaskSummary. -->
                <a-card style="margin:10px;">
                  <p style="font-size:20px" class="text">当前测试任务详情</p>
                  <p class="text-muted">当前测试任务实时进度</p>
                  <ProcessingBoard ref="processingBoard" v-if="taskInfo != null" :nodeServerAddr="nodeServerAddr"
                    :batchToken="taskInfo.batchToken">
                  </ProcessingBoard>
                  <a-empty :image="require('@/assets/icon/wait.svg')" v-else>
                    <template #description>
                      <p class="text-muted">请等待评估启动</p>
                    </template>
                  </a-empty>
                </a-card>
                <a-card style="margin:10px;">
                  <p style="font-size:20px" class="text">对抗攻击实例</p>
                  <p class="text-muted">对抗样本图片展示</p>
                  <br />
                  <div style="display: flex; align-items: center; flex-direction: column;">
                    <a-carousel dot-position="bottom" style="width: 400px; height: 225px;">
                      <div v-for="index in Array.from({ length: 20 }, (v, k) => k)" :key="index">
                        <img style="height: 225px;width: 400px"
                          src="https://raw.githubusercontent.com/vueComponent/ant-design-vue/main/components/carousel/demo/abstract01.jpg" />
                      </div>
                    </a-carousel>
                  </div>
                </a-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>


<script>
import { defineComponent, onMounted, ref } from 'vue';
import DMGraph from './DMGraph.vue';
import TransferTestMap from './TransferTestMap.vue';
import WebConsole from '@/views/test-manage/TestTaskConsole/WebConsole.vue';
import ServerNodeStatus from './components/ServerNodeStatus.vue';
import { ClusterOutlined } from '@ant-design/icons-vue';
import NodeInfo from './components/NodeInfo.vue';
import TaskSummary from './components/TaskSummary.vue';
import ProcessingBoard from '@/views/test-manage/TestTaskConsole/ProcessingBoard.vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';
const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4168693_8vpkziypya4.js', // 在 iconfont.cn 上生成
});

import { getTaskByTaskID } from '@/api/task-api/taskInfo.js';

export default defineComponent({
  name: 'ScreenCore',
  components: {
    MyIcon,
    ClusterOutlined,
    ServerNodeStatus,
    TransferTestMap,
    ProcessingBoard,
    DMGraph,
    WebConsole,
    NodeInfo,
    TaskSummary,

  },
  props: {
    //
  },
  setup(props) {
    const nodeServerAddr = ref('127.0.0.1:5000');
    const processingBoard = ref();
    const taskID = ref();
    const taskInfo= ref();
    const webConsole=ref();
    const dmGraph =ref();
    onMounted(async () => {
      taskID.value = localStorage.getItem('nowTaskID');
      await loadTaskData(); 
      if (taskInfo.value.batchToken != null) { 
        await processingBoard.value.loadProcessingData();
      }
    });


    const loadTaskData = async () => {
      taskInfo.value = await getTaskByTaskID(taskID.value);
    };
    const onReceived = async (logMsg) => { 
      await processingBoard.value.loadProcessingData();
      await dmGraph.value.changeNodeStatus(processingBoard.value['processingData']); 
    };
    return {
      nodeServerAddr,
      taskID,
      taskInfo,
      webConsole,
      processingBoard,
      dmGraph,
      onReceived,
    };
  },
});
</script>
