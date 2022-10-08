<style scoped lang="less">
.submenu {
  height: 50px;
}
.charts {
  margin: 5px;
}
</style>

<template>
  <a-spin tip="正在加载" :spinning="loading">
    <a-card size="small">
      <a-row>
        <a-col :span="8">
          <a-card size="small" title="误分类率" class="charts">
            <PerturbationChangeCharts :result="explorePerturbationData['MR']" v-if="!loading">
            </PerturbationChangeCharts>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card size="small" title="对抗类置信增加值" class="charts">
            <PerturbationChangeCharts :result="explorePerturbationData['AIAC']" v-if="!loading">
            </PerturbationChangeCharts>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card size="small" title="正确类置信降低值" class="charts">
            <PerturbationChangeCharts :result="explorePerturbationData['ARTC']" v-if="!loading">
            </PerturbationChangeCharts>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card size="small" title="平均耗时" class="charts">
            <PerturbationChangeCharts :result="explorePerturbationData['ACT']" v-if="!loading">
            </PerturbationChangeCharts>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card size="small" title="平均最大扰动" class="charts">
            <PerturbationChangeCharts :result="explorePerturbationData['AMD']" v-if="!loading">
            </PerturbationChangeCharts>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card size="small" title="平均欧式距离" class="charts">
            <PerturbationChangeCharts :result="explorePerturbationData['AED']" v-if="!loading">
            </PerturbationChangeCharts>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card size="small" title="平均像素改变率" class="charts">
            <PerturbationChangeCharts :result="explorePerturbationData['APCR']" v-if="!loading">
            </PerturbationChangeCharts>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card size="small" title="深度图像相似性偏离" class="charts">
            <PerturbationChangeCharts :result="explorePerturbationData['ADMS']" v-if="!loading">
            </PerturbationChangeCharts>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card size="small" title="低层图像相似性偏离" class="charts">
            <PerturbationChangeCharts :result="explorePerturbationData['ALMS']" v-if="!loading">
            </PerturbationChangeCharts>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </a-spin>
</template>

<script>
import { useRoute } from 'vue-router';
import { createVNode, onMounted, ref, h, watch, computed, reactive, nextTick, onBeforeMount } from 'vue';
import PerturbationChangeCharts from './charts/PerturbationChangeCharts.vue';
import { getAdvInfo } from '@/api/framework-api/analyzer.js';

export default {
  name: 'PerturbationChangeBox',
  components: {
    PerturbationChangeCharts,
  },
  props: {
    explorePerturbationResult: Object,
  },
  setup(props, context) {
    const loading = ref(true);
    const explorePerturbationData = reactive({});

    const addExplorePerturbationData = (itemName, modelName, testAdvType, perturbation, element) => {
      if (explorePerturbationData[itemName] == null) {
        explorePerturbationData[itemName] = {};
      }
      if (explorePerturbationData[itemName][modelName + testAdvType] == null) {
        explorePerturbationData[itemName][modelName + testAdvType] = [];
      }
      explorePerturbationData[itemName][modelName + testAdvType].push({
        perturbation: perturbation,
        data: element,
      });
    };

    const init = () => {
      for (let modelName in props.explorePerturbationResult) {
        props.explorePerturbationResult[modelName].forEach((element) => {
          let atk_perturbation_budget = element['atk_perturbation_budget'];
          let testAdvType = element['adv_example_file_type'] == 'ADVERSARIAL_EXAMPLE_IMG' ? '(Img-Data)' : '(Numpy-Data)';
          addExplorePerturbationData('MR', modelName, testAdvType, atk_perturbation_budget, element['MR']);
          addExplorePerturbationData('AIAC', modelName, testAdvType, atk_perturbation_budget, element['AIAC']);
          addExplorePerturbationData('ARTC', modelName, testAdvType, atk_perturbation_budget, element['ARTC']);
          addExplorePerturbationData('ACT', modelName, testAdvType, atk_perturbation_budget, element['ACT']);
          addExplorePerturbationData('AMD', modelName, testAdvType, atk_perturbation_budget, element['AMD']);
          addExplorePerturbationData('AED', modelName, testAdvType, atk_perturbation_budget, element['AED']);
          addExplorePerturbationData('APCR', modelName, testAdvType, atk_perturbation_budget, element['APCR']);
          addExplorePerturbationData('ADMS', modelName, testAdvType, atk_perturbation_budget, element['ADMS']);
          addExplorePerturbationData('ALMS', modelName, testAdvType, atk_perturbation_budget, element['ALMS']);
        });
      }
      loading.value = false;
    };

    onMounted(() => {
      init();
    });

    return {
      loading,
      explorePerturbationData,
    };
  },
};
</script>
