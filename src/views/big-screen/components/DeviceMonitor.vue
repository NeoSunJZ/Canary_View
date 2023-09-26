<template>
  <div id="container-DMChart" style="height: 100px"></div>
</template>


<script>
import { defineComponent, ref, onMounted, onUpdated } from 'vue';
import * as echarts from 'echarts';

export default defineComponent({
  name: 'DeviceMonitor',
  props: {
    //
  },
  setup(props) {
    let gpuUsageArray = [];
    let cpuUsageArray = [];
    let gpuUseMemorySizeArray = [];
    let cpuUseMemorySizeArray = [];

    let myChart = null

    onMounted(() => {
      let chartDom = document.getElementById('container-DMChart');
      myChart = echarts.init(chartDom, 'dark');
    });

    const ChangeDeviceMonitor = async (systemUsage, systemInfo) => {
      gpuUsageArray.push(systemUsage.gpuUsage);
      cpuUsageArray.push(systemUsage.cpuUsage);
      gpuUseMemorySizeArray.push(systemUsage.gpuUseMemorySize / systemInfo.gpuMemorySize * 100);
      cpuUseMemorySizeArray.push(systemUsage.cpuUseMemorySize / systemInfo.memorySize * 100);
      if(gpuUsageArray.length > 60) gpuUsageArray.shift();
      if(cpuUsageArray.length > 60) cpuUsageArray.shift();
      if(gpuUseMemorySizeArray.length > 60) gpuUseMemorySizeArray.shift();
      if(cpuUseMemorySizeArray.length > 60) cpuUseMemorySizeArray.shift();
      
      let option = {
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
          min: 0, 
          max: 100, 
          interval: 20,
        },
        series: [
          {
            data: gpuUsageArray,
            type: 'line',
            smooth: true,
            showSymbol: false,
            color: '#ea5455',
          },
          {
            // data: Array.from({ length: 60 }, (v) => Math.floor(Math.random() * 100) + 0).sort(),
            data: cpuUsageArray,
            type: 'line',
            smooth: true,
            showSymbol: false,
            color: '#7367f0',
          },
          {
            data: gpuUseMemorySizeArray,
            type: 'line',
            smooth: true,
            showSymbol: false,
            color: '#00cfe8',
          },
          {
            data: cpuUseMemorySizeArray,
            type: 'line',
            smooth: true,
            showSymbol: false,
            color: '#ff9f43',
          },
        ],
      };
      
      option && myChart.setOption(option);
    };
    return {
      ChangeDeviceMonitor
    };
  },
});
</script>
<style lang="less">
</style>
