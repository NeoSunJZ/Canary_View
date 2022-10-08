<style scoped lang="less">
.submenu {
  height: 50px;
}
</style>

<template>
  <div :id="id" :style="{ width: '100%', height: '120px' }"></div>
</template>

<script>
import { useRoute } from 'vue-router';
import { createVNode, onMounted, ref, h, watch, computed, reactive } from 'vue';
import * as echarts from 'echarts';

export default {
  name: 'SingleHeatmapCharts',
  props: {
    seriesName: String,
    imgID: Number,
    max: Number,
    xData: Array,
    yData: Array,
    data: Array,
  },
  setup(props, context) {
    const id = ref(Math.random().toString(36).substring(2));
    const init = () => {
      let myChart = echarts.init(document.getElementById(id.value));
      let option = {
        tooltip: {},
        grid: {
          height: '35%',
          top: '5%',
          right: '0%',
          left: '10%',
        },
        xAxis: {
          type: 'category',
          data: props.xData,
        },
        yAxis: {
          type: 'category',
          data: props.yData,
        },
        visualMap: {
          min: 0,
          max: props.max,
          calculable: true,
          realtime: true,
          precision: 6,
          inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
          },
          left: 'center',
          bottom: '0%',
          orient: 'horizontal',
          itemHeight: 500,
        },
        series: [
          {
            name: props.seriesName,
            type: 'heatmap',
            data: props.data,
            emphasis: {
              itemStyle: {
                borderColor: '#333',
                borderWidth: 1,
              },
            },
            progressive: 1000,
            animation: false,
          },
        ],
      };
      myChart.setOption(option);
      window.onresize = function () {
        //自适应大小
        myChart.resize();
      };
    };
    onMounted(async () => {
      init();
    });
    watch(
      () => props.imgID,
      (newValue, oldValue) => {
        init();
      }
    );
    return {
      id,
    };
  },
};
</script>
