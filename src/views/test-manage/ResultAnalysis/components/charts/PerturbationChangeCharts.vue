<style scoped lang="less">
.submenu {
  height: 50px;
}
</style>

<template>
  <SingleLineCharts :dimensions="dimensions" :source="Object.values(resultDataset)" :series="chartsSeries"></SingleLineCharts>
</template>

<script>
import { ref, onBeforeMount, onMounted } from 'vue';
import SingleLineCharts from './components/SingleLineCharts.vue';

export default {
  name: 'PerturbationChangeCharts',
  components: {
    SingleLineCharts,
  },
  props: {
    result: Object,
  },
  setup(props, context) {
    const id = ref(Math.random().toString(36).substring(2));
    const dimensions = ref(['perturbation']);
    const resultDataset = ref({});
    const chartsSeries = ref([]);
    let seriesItem = {
      type: 'line',
      smooth: true,
    };
    onBeforeMount(async () => {
      Object.keys(props.result).forEach((modelName) => {
        dimensions.value.push(modelName);
        chartsSeries.value.push(seriesItem);
        props.result[modelName].forEach((element) => {
          let perturbation = element['perturbation'];
          if (resultDataset.value[perturbation] == null) {
            resultDataset.value[perturbation] = {};
          }
          resultDataset.value[perturbation]['perturbation'] = perturbation;
          resultDataset.value[perturbation][modelName] = element['data'];
        });
      });
    });
    return {
      id,
      chartsSeries,
      resultDataset,
      dimensions,
    };
  },
};
</script>
