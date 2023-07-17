<style scoped lang="less">
.submenu {
  height: 50px;
}
</style>

<template>
  <SingleBarCharts :dimensions="dimensions" :source="Object.values(inferenceResultDataset)" :series="chartsSeries"></SingleBarCharts>
</template>

<script>
import { ref, onBeforeMount } from 'vue';
import SingleBarCharts from './components/SingleBarCharts.vue';

export default {
  name: 'TrueLabelChangeCharts',
  components: {
    SingleBarCharts,
  },
  props: {
    inferenceResult: Object,
    modelName: String,
  },
  setup(props, context) {
    const id = ref(Math.random().toString(36).substring(2));
    const dimensions = ref(['oriImgID']);
    const inferenceResultDataset = ref({});
    const chartsSeries = ref([]);
    onBeforeMount(async () => {
      let series = new Set();
      props.inferenceResult['clean'].forEach((element) => {
        inferenceResultDataset.value[element['img_id']] = {
          oriImgID: element['img_id'],
          ORI: element['inference_img_conf_array'].split(',').map(Number)[element['ori_img_label']],
        };
        series.add('ORI');
      });
      props.inferenceResult['adv'].forEach((element) => {
        let atkName = element['atk_name'] + '(' + element['base_model'] + ')';
        inferenceResultDataset.value[element['ori_img_id']][atkName] = element['inference_img_conf_array'].split(',').map(Number)[element['ori_img_label']];
        series.add(atkName);
      });
      let seriesItem = {
        type: 'bar',
        emphasis: {
          focus: 'series',
        },
      };
      series = Array.from(series);
      for (let i = 0; i < series.length; i++) {
        if (series[i] == 'ORI') {
          dimensions.value.push({
            name: 'ORI',
            displayName: '原始样本',
          });
        } else {
          dimensions.value.push({
            name: series[i],
            displayName: '对抗样本' + series[i],
          });
        }
        chartsSeries.value.push(seriesItem);
      }
    });
    return {
      id,
      dimensions,
      inferenceResultDataset,
      chartsSeries,
    };
  },
};
</script>
