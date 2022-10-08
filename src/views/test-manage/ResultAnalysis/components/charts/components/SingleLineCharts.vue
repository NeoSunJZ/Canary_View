<style scoped lang="less">
.submenu {
  height: 50px;
}
</style>

<template>
  <div :id="id" :style="{ width: '100%', height: '200px' }"></div>
</template>

<script>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';

export default {
  name: 'SingleBarCharts',
  props: {
    title: String,
    dimensions: Object,
    source: Object,
    series: Object,
  },
  setup(props, context) {
    const id = ref(Math.random().toString(36).substring(2));
    const init = () => {
      let myChart = echarts.init(document.getElementById(id.value));
      let option = {
        title: {
          text: props.title,
          textStyle: {
            fontSize: 16,
          },
        },
        grid: {
          top: '15%',
          right: '10%',
          left: '10%',
        },
        legend: {
          type: 'scroll',
        },
        tooltip: {},
        dataZoom: [
          {
            show: true,
            realtime: true,
          },
        ],
        dataset: {
          dimensions: props.dimensions,
          source: props.source,
        },
        xAxis: { type: 'category' },
        yAxis: {
          scale: true,
        },
        series: props.series,
      };
      myChart.setOption(option);
      myChart.on('click', function (params) {
        context.emit('select', params.data);
      });
      window.onresize = function () {
        //自适应大小
        myChart.resize();
      };
    };
    onMounted(async () => {
      init();
    });
    return {
      id,
    };
  },
};
</script>
