<template>
  <div id="container-DMChart" style="height: 100px"></div>
</template>


<script>
import { defineComponent, ref, onMounted } from 'vue';
import * as echarts from 'echarts';

export default defineComponent({
  name: 'DeviceMonitor',
  props: {
    //
  },
  setup(props) {
    onMounted(() => {
      let chartDom = document.getElementById('container-DMChart');
      let myChart = echarts.init(chartDom, 'dark');
      let option;

      option = {
        backgroundColor: 'rgba(0,0,0,0)',
        grid: {
          top: '8%',
          left: '1%',
          right: '1%',
          bottom: '1%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: Array.from({ length: 60 }, (v, k) => k),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: Array.from({ length: 60 }, (v) => Math.floor(Math.random() * 100) + 0).sort(),
            type: 'line',
            smooth: true,
            showSymbol: false,
            color: '#ea5455',
          },
          {
            data: Array.from({ length: 60 }, (v) => Math.floor(Math.random() * 100) + 0).sort(),
            type: 'line',
            smooth: true,
            showSymbol: false,
            color: '#7367f0',
          },
          {
            data: Array.from({ length: 60 }, (v) => Math.floor(Math.random() * 100) + 0).sort(),
            type: 'line',
            smooth: true,
            showSymbol: false,
            color: '#00cfe8',
          },
          {
            data: Array.from({ length: 60 }, (v) => Math.floor(Math.random() * 100) + 0).sort(),
            type: 'line',
            smooth: true,
            showSymbol: false,
            color: '#ff9f43',
          },
        ],
      };

      option && myChart.setOption(option);
    });
    return {
      //
    };
  },
});
</script>
<style lang="less">
</style>
