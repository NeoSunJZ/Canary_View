<style scoped lang="less">
.submenu {
  height: 50px;
}
</style>

<template>
  <div>
    <div v-for="(data,index) in confData" :key="index">
      <SingleHeatmapCharts v-if="attackName==null || data.yData[0]==attackName || data.yData[0]=='ORI'" :max="data.max" :xData="data.xData" :yData="data.yData" :data="data.data"
        :imgID="data.imgID" :seriesName="'分类置信度'">
      </SingleHeatmapCharts>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { createVNode, onMounted, ref, h, watch, computed, reactive } from 'vue';
import SingleHeatmapCharts from './components/SingleHeatmapCharts.vue';

export default {
  name: 'ConfHotCharts',
  components: {
    SingleHeatmapCharts,
  },
  props: {
    inferenceResult: Object,
    modelName: String,
    attackName: {
      default: null,
      type: String,
    },
    imgID: Number,
  },
  setup(props, context) {
    const id = ref(Math.random().toString(36).substring(2));
    const confData = ref([]);

    const inferenceResultDataset = reactive({});
    onMounted(async () => {
      props.inferenceResult['clean'].forEach((element) => {
        inferenceResultDataset[element['img_id']] = {
          ORI: element['inference_img_conf_array'].split(',').map(Number),
        };
      });
      props.inferenceResult['adv'].forEach((element) => {
        let atkName = element['atk_name'] + '(' + element['base_model'] + ')';
        inferenceResultDataset[element['ori_img_id']][atkName] = element['inference_img_conf_array'].split(',').map(Number);
      });
      init(props.imgID);
    });

    const init = (imgID) => {
      confData.value = [];
      for (let key in inferenceResultDataset[imgID]) {
        let data = [];
        let xData = new Set();
        let yData = [];
        let max = 0;

        yData.push(key);
        for (let i = 0; i < inferenceResultDataset[imgID][key].length; i++) {
          let value = inferenceResultDataset[imgID][key][i];
          if (max < value) {
            max = value;
          }
          data.push([i, key, inferenceResultDataset[imgID][key][i]]);
          xData.add(i);
        }
        xData = Array.from(xData);
        confData.value.push({
          data: data,
          xData: xData,
          yData: yData,
          max: max,
          imgID: imgID,
        });
      }
    };
    watch(
      () => props.imgID,
      (newValue, oldValue) => init(newValue)
    );
    return {
      id,
      confData,
    };
  },
};
</script>
