<style scoped lang="less">
.submenu {
  height: 50px;
}
</style>

<template>
  <MainPageNavigation :selectedKeys="['8']" :openKeys="['sub2']">
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>测试任务管理</a-breadcrumb-item>
      <a-breadcrumb-item>测试任务结果分析</a-breadcrumb-item>
      <a-breadcrumb-item>全部测试任务</a-breadcrumb-item>
      <a-breadcrumb-item>任务(TaskID:{{taskID}})</a-breadcrumb-item>
    </template>
    <template v-slot:content>
      <h2 class="attack-task__title">任务(TaskID:{{taskID}})结果分析 (模型测评视图)</h2>
      <a-descriptions bordered size="small" :column="4" v-if="taskInfo!=null" style="margin-top:10px">
        <a-descriptions-item label="任务名称" :span="1">{{taskInfo.taskName}}</a-descriptions-item>
        <a-descriptions-item label="任务创建者" :span="1">{{taskInfo.createUser}}</a-descriptions-item>
        <a-descriptions-item label="任务描述" :span="2">{{taskInfo.taskDesc}}</a-descriptions-item>
        <a-descriptions-item label="任务属类" :span="1">{{taskInfo.taskType.subTypeName}}</a-descriptions-item>
        <a-descriptions-item label="执行时间" :span="1">{{taskInfo.lastRunTime}}</a-descriptions-item>
        <a-descriptions-item label="SEFI任务批次" :span="1">{{taskInfo.batchToken}}</a-descriptions-item>
      </a-descriptions>
      <a-tabs v-model:activeKey="activeModelName" @change="loadResultByModelName">
        <a-tab-pane v-for="modelName in modelList" :tab="modelName" :key="modelName">
          <a-card size="small" :title="modelName+' 模型上的 安全测评结果'" style="margin-bottom:5px">
            <a-row :gutter="5">
              <a-col :span="12">
                <a-spin :spinning="loading" tip="加载中">
                  <a-card size="small" title="模型基础预测能力测试" style="margin-bottom:5px">
                    <a-skeleton :loading="loading">
                      <a-row>
                        <a-col :span="6">
                          <a-statistic title="准确率(C-Acc)" :value="modelCapabilityResult[modelName]['ACC']*100 +'%'" />
                        </a-col>
                        <a-col :span="6">
                          <a-statistic title="F1分数(C-F1)" :value="modelCapabilityResult[modelName]['F1'].toFixed(5)" />
                        </a-col>
                        <a-col :span="6">
                          <a-statistic title="平均置信度(C-Conf)" :value="modelCapabilityResult[modelName]['Conf'].toFixed(5)" />
                        </a-col>
                      </a-row>
                    </a-skeleton>
                  </a-card>
                </a-spin>
              </a-col>
              <a-col :span="12">
                <a-spin :spinning="loading" tip="加载中">
                  <a-card size="small" title="对抗样本攻击测试" style="margin-bottom:5px">
                    <a-skeleton :loading="loading">
                      <a-row>
                        <a-col :span="6">
                          <a-statistic title="误分类比例(MR)" :value="parseFloat(modelCapabilityResult[modelName]['MR']).toFixed(3)*100 +'%'" />
                        </a-col>
                        <a-col :span="6">
                          <a-statistic title="攻击时间代价(TC)" :value="parseFloat(modelCapabilityResult[modelName]['ACT']).toFixed(3) + '秒'" />
                        </a-col>
                        <a-col :span="6">
                          <a-statistic title="真实类平均置度偏离(ARTC)" :value="parseFloat(modelCapabilityResult[modelName]['ARTC']).toFixed(7)" />
                        </a-col>
                        <a-col :span="6">
                          <a-statistic title="对抗类平均置信偏离(AIAC)" :value="parseFloat(modelCapabilityResult[modelName]['AIAC']).toFixed(7)" />
                        </a-col>
                      </a-row>
                    </a-skeleton>
                  </a-card>
                </a-spin>
              </a-col>
              <a-col :span="18">
                <a-spin :spinning="loading" tip="加载中">
                  <a-card size="small" title="对抗样本质量(对抗强度)测试" style="margin-bottom:5px">
                    <a-skeleton :loading="loading">
                      <a-row>
                        <a-col :span="4">
                          <a-statistic title="平均欧式距离(AED)" :value="parseFloat(modelCapabilityResult[modelName]['AED']).toFixed(7)" />
                        </a-col>
                        <a-col :span="4">
                          <a-statistic title="平均像素变化比例(APCR)" :value="(parseFloat(modelCapabilityResult[modelName]['APCR'])*100).toFixed(5) +'%'" />
                        </a-col>
                        <a-col :span="4">
                          <a-statistic title="平均最大距离(AMD)" :value="parseFloat(modelCapabilityResult[modelName]['AMD']).toFixed(7)" />
                        </a-col>
                        <a-col :span="4">
                          <a-statistic title="平均深度特征相似性(ADMS)" :value="parseFloat(modelCapabilityResult[modelName]['ADMS']).toFixed(7)" />
                        </a-col>
                        <a-col :span="4">
                          <a-statistic title="平均低层特征相似性(ALMS)" :value="parseFloat(modelCapabilityResult[modelName]['ALMS']).toFixed(7)" />
                        </a-col>
                      </a-row>
                    </a-skeleton>
                  </a-card>
                </a-spin>
              </a-col>
            </a-row>
          </a-card>
          <a-row :gutter="5">
            <a-col :span="10">
              <a-spin :spinning="loading" tip="加载中">
                <a-card size="small" style="margin-bottom:5px" :title="modelName+ ' 模型 预测标签置信度攻击对比统计图'">
                  <a-skeleton :loading="loading">
                    <InferenceLabelChange :inferenceResult="inferenceResult[modelName]" :modelName="modelName" @select="selectImg">
                    </InferenceLabelChange>
                  </a-skeleton>
                </a-card>
              </a-spin>
              <a-spin :spinning="loading" tip="加载中">
                <a-card size="small" style="margin-bottom:5px" :title="modelName+ ' 模型 真实标签置信度攻击对比统计图'">
                  <a-skeleton :loading="loading">
                    <TrueLabelChangeCharts :inferenceResult="inferenceResult[modelName]" :modelName="modelName" @select="selectImg">
                    </TrueLabelChangeCharts>
                  </a-skeleton>
                </a-card>
              </a-spin>
            </a-col>
            <a-col :span="14">
              <a-card size="small" :title="'图片预测结果'" v-if="imgID==null">
                <a-empty>
                  <template #description>
                    <span>
                      请选择一个样本以查看详情
                    </span>
                  </template>
                </a-empty>
              </a-card>
              <ImgInfoBox v-if="imgID!=null" :nodeServerAddr="nodeServerAddr" :batchToken="taskInfo.batchToken" :inferenceResult="inferenceResult[modelName]" :modelName="modelName"
                :imgID="imgID">
              </ImgInfoBox>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';
import TrueLabelChangeCharts from '../components/charts/TrueLabelChangeCharts.vue';
import InferenceLabelChange from '../components/charts/InferenceLabelChangeCharts.vue';
import ImgInfoBox from '../components/ImgInfoBox.vue';
import { useRoute } from 'vue-router';
import { createVNode, onMounted, ref, h, watch, computed, reactive } from 'vue';

import { getInferenceResultByModelName, getModelSecuritySyntheticalCapabilityResult } from '@/api/framework-api/analyzer.js';
import { getTaskByTaskID } from '@/api/task-api/taskInfo.js';

import * as echarts from 'echarts';

export default {
  name: 'ModelView',
  components: { MainPageNavigation, TrueLabelChangeCharts, InferenceLabelChange, ImgInfoBox },
  setup() {
    const route = useRoute();

    const loading = ref(true);
    const taskID = ref();
    const taskInfo = ref();
    const modelList = ref();
    const activeModelName = ref();

    const inferenceResult = reactive({});
    const modelCapabilityResult = reactive({});
    const imgID = ref();

    const nodeServerAddr = computed(() => {
      if (taskInfo.value != null) return taskInfo.value.nodeInfo.host + ':' + taskInfo.value.nodeInfo.port;
      else return null;
    });

    const loadtaskInfo = async () => {
      taskInfo.value = await getTaskByTaskID(taskID.value);
      modelList.value = JSON.parse(taskInfo.value['config'])['model_list'];
      activeModelName.value = modelList.value[0];
      loadResultByModelName(modelList.value[0]);
    };

    const loadResultByModelName = async (modelName) => {
      imgID.value = null;
      loading.value = true;
      inferenceResult[modelName] = await getInferenceResultByModelName(nodeServerAddr.value, modelName, taskInfo.value.batchToken);
      modelCapabilityResult[modelName] = await getModelSecuritySyntheticalCapabilityResult(nodeServerAddr.value, modelName, taskInfo.value.batchToken);
      loading.value = false;
    };

    const selectImg = (data) => {
      imgID.value = data['oriImgID'];
    };

    onMounted(async () => {
      taskID.value = route['query']['taskID'];
      await loadtaskInfo();
    });

    return {
      loading,
      taskID,
      taskInfo,
      modelList,
      inferenceResult,
      modelCapabilityResult,
      imgID,
      nodeServerAddr,

      loadResultByModelName,
      selectImg,
    };
  },
};
</script>
