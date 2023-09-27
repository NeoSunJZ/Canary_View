<style scoped lang="less">
.submenu {
  height: 50px;
}
</style>

<template>
  <a-spin tip="正在加载" :spinning="loading">
    <a-card size="small" v-if="inferenceResultDataset[imgID] != null"
      :title="'图片 ' + imgID + ' 在 ' + modelName + ' 上的预测结果'">
      <a-descriptions :column="4" :bordered="true" size="small">
        <a-descriptions-item label="图片ID">{{ imgID }}</a-descriptions-item>
        <a-descriptions-item label="原始标签">{{ inferenceResultDataset[imgID].ori }}</a-descriptions-item>
        <a-descriptions-item label="干净预测标签">{{ inferenceResultDataset[imgID].cleanInference }}</a-descriptions-item>
        <a-descriptions-item label="有效性">
          <a-badge status="success" text="有效样本" v-if="inferenceResultDataset[imgID].isEffective" />
          <a-badge status="error" text="无效样本(预测错误)" v-else />
        </a-descriptions-item>
      </a-descriptions>
      <a-tabs v-model:activeKey="advImgInfoKey" @change="loadAdvInfo">
        <a-tab-pane v-for="(data, key) in inferenceResultDataset[imgID]['attack']" :key="key" :tab="key">
          <a-descriptions :column="5" bordered size="small">
            <a-descriptions-item label="对抗预测标签">{{ data.inferenceImgLabel }}</a-descriptions-item>
            <a-descriptions-item label="迁移攻击">
              {{ data.baseModel != modelName ? "是" : "否" }}
            </a-descriptions-item>
            <a-descriptions-item label="攻击状态">
              <a-badge status="success" text="攻击成功" v-if="data.isEffectiveAttackOnTrueLabel" />
              <a-badge status="error" text="攻击失败" v-else />
            </a-descriptions-item>
            <a-descriptions-item label="是否偏转预测">
              <a-badge status="success" text="偏转结果成功" v-if="data.isEffectiveAttackOnInferenceLabel" />
              <a-badge status="error" text="偏转结果失败" v-else />
            </a-descriptions-item>
          </a-descriptions>
          <a-descriptions :column="3" bordered size="small" v-if="advInfoList[data.advImgID] != null">
            <a-descriptions-item label="生成耗时">{{ parseFloat(advInfoList[data.advImgID]['cost_time']).toFixed(5) }}
              秒(s)</a-descriptions-item>
            <a-descriptions-item label="最大像素扰动">
              {{ parseFloat(advInfoList[data.advImgID]['adv_da_info']['maximum_disturbance']).toFixed(7) }}
            </a-descriptions-item>
            <a-descriptions-item label="像素平均欧式距离">
              {{ parseFloat(advInfoList[data.advImgID]['adv_da_info']['euclidean_distortion']).toFixed(10) }}
            </a-descriptions-item>
            <a-descriptions-item label="像素变化率">
              {{ parseFloat(advInfoList[data.advImgID]['adv_da_info']['pixel_change_ratio']).toFixed(5) * 100 + "%" }}
            </a-descriptions-item>
            <a-descriptions-item label="深度特征相似性">
              {{ parseFloat(advInfoList[data.advImgID]['adv_da_info']['deep_metrics_similarity']).toFixed(7) }}
            </a-descriptions-item>
            <a-descriptions-item label="结构特征相似性">
              {{ parseFloat(advInfoList[data.advImgID]['adv_da_info']['low_level_metrics_similarity']).toFixed(7) }}
            </a-descriptions-item>
          </a-descriptions>
          <a-row :gutter="10">
            <a-col :span="16">
              <div style="width:100%;padding:10px">置信矩阵对比</div>
              <ConfHotCharts :inferenceResult="inferenceResult" :modelName="modelName" :imgID="imgID" :attackName="key">
              </ConfHotCharts>
            </a-col>
            <a-col :span="8">
              <div style="width:100%;padding:10px">对抗样本对比</div>
              <a-image v-if="advInfoList[data.advImgID] != null" :src="advInfoList[data.advImgID]['adv_img']['diff']"
                style="width:100%;padding:10px" />
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-spin>
</template>

<script>
import { useRoute } from 'vue-router';
import { createVNode, onMounted, ref, h, watch, computed, reactive } from 'vue';
import ConfHotCharts from './charts/ConfHeatmapCharts.vue';
import { getAdvInfo } from '@/api/framework-api/analyzer.js';

export default {
  name: 'ImgInfoBox',
  components: {
    ConfHotCharts,
  },
  props: {
    nodeServerAddr: String,
    batchToken: String,
    inferenceResult: Object,
    modelName: String,
    imgID: Number,
  },
  setup(props, context) {
    const loading = ref(true);
    const inferenceResultDataset = reactive({});
    const advImgInfoKey = ref();
    onMounted(async () => {
      loading.value = true;
      props.inferenceResult['clean'].forEach((element) => {
        inferenceResultDataset[element['img_id']] = {
          imgID: element['img_id'],
          ori: element['ori_img_label'],
          cleanInference: element['inference_img_label'],
          isEffective: element['inference_img_label'] == element['ori_img_label'],
          attack: {},
        };
      });
      props.inferenceResult['adv'].forEach((element) => {
        let atkName = element['atk_name'] + '(' + element['base_model'] + ')';
        inferenceResultDataset[element['ori_img_id']]['attack'][atkName] = {
          atkName: element['atk_name'],
          baseModel: element['base_model'],
          advImgID: element['img_id'],
          inferenceImgLabel: element['inference_img_label'],
          isEffectiveAttackOnTrueLabel: element['inference_img_label'] != inferenceResultDataset[element['ori_img_id']]['ori'],
          isEffectiveAttackOnInferenceLabel: element['inference_img_label'] != inferenceResultDataset[element['ori_img_id']]['cleanInference'],
        };
      });
      advImgInfoKey.value = Object.keys(inferenceResultDataset[props.imgID]['attack'])[0];
      await loadAdvInfo(advImgInfoKey.value);
      loading.value = false;
    });

    watch(
      () => props.imgID,
      (newValue, oldValue) => {
        loadAdvInfo(advImgInfoKey.value);
      }
    );

    const advInfoList = reactive({});

    const loadAdvInfo = async (key) => {
      loading.value = true;
      let advImgID = inferenceResultDataset[props.imgID]['attack'][key]['advImgID'];
      if (advInfoList[advImgID] == null) {
        advInfoList[advImgID] = await getAdvInfo(props.nodeServerAddr, advImgID, props.batchToken, 1);
      }
      loading.value = false;
    };

    return {
      loading,
      inferenceResultDataset,
      advImgInfoKey,
      advInfoList,
      loadAdvInfo,
    };
  },
};
</script>
