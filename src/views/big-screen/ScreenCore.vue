<style scoped lang="less">
@import './Screen.less';
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
    <Activate @activateStatus="activateStatusHandler">
      <template #context="{ activateStatus }">
        <a-layout-content>
          <div style="padding:10px">
            <div style="display:flex;">
              <div style="flex: 2;display: flex;flex-direction: column;">
                <!-- NodeInfo. -->
                <NodeInfo />
                <!-- NodeInfo. -->
                <a-empty :image="require('@/assets/icon/wait.svg')" v-if="nodeServerAddr == null">
                  <template #description>
                    <p class="text-muted">请等待节点信息加载</p>
                  </template>
                </a-empty>
                <ServerNodeStatus v-else :nodeServerAddr="nodeServerAddr" ref="serverNodeStatus" :waitingOperation="waitingOperation" />
                <a-divider style="height: 1px; background-color: #7983bb; margin:5px 0" />
                <a-card style="margin:10px">
                  <p style="font-size:20px" class="text">关于</p>
                  <p class="text-muted" style="margin-bottom:5px">评估平台摘要</p>
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
                      <span class="text"> SEFI V{{systemVersion.sefiVersion}}
                      </span><a-divider type="vertical" />
                      SEFI Lib版本 <span class="text"> Build-in Lib V{{systemVersion.sefiLibVersion}}</span>
                    </p>
                    <a-divider style="height: 1px; background-color: #7983bb; margin:5px 0" />
                    <p class="text-muted" v-if="activateStatus">
                      许可证
                      <span class="text"> {{activateStatus['status']}}
                        <a-tag class="tag tag--green">{{activateStatus['type']}}</a-tag>
                      </span><a-divider type="vertical" />
                      许可证有效期 <span class="text"> {{activateStatus['validity']}}</span>
                    </p>
                  </a-card>
                </a-card>
              </div>
              <div style="flex: 5;">
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
                <div style="display: flex;" v-show="waitingOperation">
                  <a-card style="margin:10px;flex: 1;">
                    <div style="min-height: 815px; display: flex; justify-content: center; align-items: center;">
                      <a-result status="500" title="请等待操作人员启动测试" sub-title="请等待测试开始">
                        <template #extra>
                          <a-button type="primary" href="/TaskRealtimeBoard/" target="_blank">
                            <template #icon>
                              <PartitionOutlined />
                            </template>
                            操作端 任务实时看板</a-button>
                        </template>
                      </a-result>
                    </div>
                  </a-card>
                </div>
                <div style="display: flex;" v-show="!waitingOperation">
                  <div style="flex: 3; display: flex;flex-direction: column;">
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
                      <WebConsole ref="webConsole" v-if="taskInfo != null" :showTitle="false" maxHeight="95px" :nodeServerAddr="nodeServerAddr"
                        @received="onReceived" @receivedBase64Img="onBase64Received" @receivedSystemUsage="onSystemUsage" @receivedToken="onReceivedToken">
                      </WebConsole>
                      <a-empty :image="require('@/assets/icon/wait.svg')" v-else>
                        <template #description>
                          <p class="text-muted">请等待评估启动</p>
                        </template>
                      </a-empty>
                    </a-card>
                    <a-card style="margin:10px">
                      <p style="font-size:20px" class="text">当前测试任务结论</p>
                      <p class="text-muted">测试指标结果</p>
                      <a-tabs v-model:activeKey="activeModelName" @change="loadResultByModelName">
                        <a-tab-pane v-for="modelName in modelList" :tab="modelName" :key="modelName" size="small">
                          <div style="display: flex; align-items: center; flex-direction: row; justify-content: space-around;">

                            <div style="display: flex;flex-direction: row; align-items: center;">
                              <a-button class="tag tag--orange" type="primary">
                                <template #icon>
                                  <MyIcon type="icon-biaoqianlan" :style="{ fontSize: '24px' }" />
                                </template>
                              </a-button>
                              <div style="margin-left:10px">
                                <p style="font-size:14px" class="text">误分类率 / MR</p>
                                <p class="text-muted"> {{ parseFloat(modelCapabilityResult.MR).toFixed(3) * 100 + '%' }}
                                </p>
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
                                <p class="text-muted">AIAC {{ parseFloat(modelCapabilityResult.AIAC).toFixed(3) }} / ARTC
                                  {{ parseFloat(modelCapabilityResult.ARTC).toFixed(3) }}</p>
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
                                <p class="text-muted">AMD {{ parseFloat(modelCapabilityResult.AMD).toFixed(3) }} / AED {{
                              parseFloat(modelCapabilityResult.AED).toFixed(3) }} </p>
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
                                <p class="text-muted">ADMS {{ parseFloat(modelCapabilityResult.ADMS).toFixed(3) }} / ALMS
                                  {{ parseFloat(modelCapabilityResult.ALMS).toFixed(3) }}</p>
                              </div>
                            </div>

                          </div>
                        </a-tab-pane>
                      </a-tabs>
                    </a-card>
                  </div>
                  <div style="flex: 2; display: flex;flex-direction: column;">
                    <!-- TaskSummary. -->
                    <a-card style="margin:10px;">
                      <p style="font-size:20px" class="text">当前测试任务详情</p>
                      <p class="text-muted">测试任务简介 </p>
                      <TaskSummary v-if="taskInfo != null" />
                      <a-empty :image="require('@/assets/icon/wait.svg')" v-else>
                        <template #description>
                          <p class="text-muted">请等待评估启动</p>
                        </template>
                      </a-empty>
                    </a-card>
                    <!-- TaskSummary. -->
                    <a-card style="margin:10px;">
                      <p style="font-size:20px" class="text">当前测试任务详情</p>
                      <p class="text-muted">当前测试任务实时进度</p>
                      <ProcessingBoard ref="processingBoard" v-if="taskInfo != null" :nodeServerAddr="nodeServerAddr" :batchToken="taskInfo.batchToken">
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
                      <div style="display: flex; align-items: center; flex-direction: column;" v-if="taskInfo != null">
                        <a-carousel arrows dots-class="slick-dots slick-thumb" style="width: 500px">
                          <template #prevArrow>
                            <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
                              <LeftCircleOutlined />
                            </div>
                          </template>
                          <template #nextArrow>
                            <div class="custom-slick-arrow" style="right: 10px">
                              <RightCircleOutlined />
                            </div>
                          </template>
                          <div v-for="(imageSrc, index) in imageArray" :key="index">
                            <img style="width: 500px" :src="imageSrc" />
                          </div>
                        </a-carousel>

                      </div>
                      <a-empty :image="require('@/assets/icon/wait.svg')" v-else>
                        <template #description>
                          <p class="text-muted">请等待评估启动</p>
                        </template>
                      </a-empty>
                    </a-card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-layout-content>
      </template>
    </Activate>
  </a-layout>
</template>


<script>
import { defineComponent, onMounted, ref, reactive } from 'vue';
import DMGraph from './DMGraph.vue';
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
import { getModelSecuritySyntheticalCapabilityResult } from '@/api/framework-api/analyzer.js';
import { async } from '@antv/x6/lib/registry/marker/async';
import { getSystemVersion } from '@/api/framework-api/system.js';

import { LeftCircleOutlined, RightCircleOutlined, PartitionOutlined } from '@ant-design/icons-vue';

import CryptoJS from 'crypto-js';
import Activate from '@/components/Activate.vue';

export default defineComponent({
  name: 'ScreenCore',
  components: {
    MyIcon,
    ClusterOutlined,
    ServerNodeStatus,
    ProcessingBoard,
    DMGraph,
    WebConsole,
    NodeInfo,
    TaskSummary,
    LeftCircleOutlined,
    RightCircleOutlined,
    PartitionOutlined,
    Activate,
  },
  props: {
    //
  },
  setup(props) {
    const nodeServerAddr = ref('127.0.0.1:5000');
    const processingBoard = ref();
    const taskID = ref();
    const taskInfo = ref();
    const webConsole = ref();
    const dmGraph = ref();
    const imageArray = ref([]);
    const modelList = ref();
    const modelCapabilityResult = ref({});
    const serverNodeStatus = ref();
    const systemVersion = ref({
      sefiVersion: '',
      sefiLibVersion: '',
    });
    let imageArraytmp = [];

    const waitingOperation = ref(true);

    window.addEventListener('storage', function (event) {
      if (event.key == 'nowTaskID') {
        if (!event.newValue) {
          location.reload();
        } else {
          waitingOperation.value = false;
          taskID.value = localStorage.getItem('nowTaskID');
          initScreen();
        }
      }
    });

    window.addEventListener('unload', (e) => {
      localStorage.setItem('bigScreenStatus', 'close');
    });

    const activateStatusHandler = (status) => {
      console.log(status)
      if (status) {
        localStorage.setItem('bigScreenStatus', 'open');
        taskID.value = localStorage.getItem('nowTaskID');
        if (!taskID.value) {
          waitingOperation.value = true;
        } else {
          waitingOperation.value = false;
          initScreen();
        }
      }
    };

    const initScreen = async () => {
      await loadTaskData();
      await loadImageArray();
      await loadResultByModelName(modelList.value[0]);
      if (taskInfo.value.batchToken != null) {
        processingBoard.value.loadProcessingData();
      }
      systemVersion.value = getSystemVersion(nodeServerAddr.value);
    };

    const loadResultByModelName = async (modelName) => {
      modelCapabilityResult.value = await getModelSecuritySyntheticalCapabilityResult(nodeServerAddr.value, modelName, taskInfo.value.batchToken);
    };
    const loadImageArray = async () => {
      isTaskIdChanged();
      let imageString = localStorage.getItem('advImg' + taskID.value);
      if (imageString) {
        imageArray.value = JSON.parse(imageString);
      }
    };
    const isTaskIdChanged = () => {
      if (localStorage.getItem('nowTaskID') != taskID.value) {
        localStorage.setItem('nowTaskID', taskID.value);
        imageArray.value = [];
        imageArraytmp = [];
      }
    };
    const loadTaskData = async () => {
      taskInfo.value = await getTaskByTaskID(taskID.value);
      modelList.value = JSON.parse(taskInfo.value['config'])['model_list'];
    };
    const onReceived = async (logMsg) => {
      await processingBoard.value.loadProcessingData();
      await dmGraph.value.changeNodeStatus(processingBoard.value['processingData']);
      isTaskIdChanged();
    };
    const onReceivedToken = async (token) => {
      taskInfo.value.batchToken = token;
      localStorage.removeItem('advImg' + taskID.value);
      imageArray.value = [];
      imageArraytmp = [];
    };
    const onBase64Received = async (msg) => {
      imageArraytmp.push(msg);
      let imageArrayToString = JSON.stringify(imageArraytmp);
      localStorage.setItem('advImg' + taskID.value, imageArrayToString);
      await loadImageArray();
    };
    const onSystemUsage = async (msg) => {
      await serverNodeStatus.value.ChangeSystemUsage(msg);
    };
    return {
      nodeServerAddr,
      taskID,
      taskInfo,
      webConsole,
      processingBoard,
      dmGraph,
      imageArray,
      modelList,
      modelCapabilityResult,
      serverNodeStatus,
      systemVersion,

      onReceived,
      onBase64Received,
      onReceivedToken,
      loadResultByModelName,
      onSystemUsage,

      waitingOperation,

      activateStatusHandler,
    };
  },
});
</script>
