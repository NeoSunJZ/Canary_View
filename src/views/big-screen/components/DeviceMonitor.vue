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
    const systemInfo = ref({
      deviceName: null,
      osName: '',
      osVersion: '',
      cpuName: null,
      gpuName: null,
      gpuMemorySize: Number(1),
      memorySize: Number(1)
    });
    const systemUsage = ref({
      cpuUsage : Number(0),
      gpuUsage : Number(0),
      cpuUseMemorySize : Number(0),
      gpuUseMemorySize : Number(0)
    });
    const gpuUsageArray = ref([]);
    const cpuUsageArray = ref([]);
    const gpuUseMemorySizeArray = ref([]);
    const cpuUseMemorySizeArray = ref([]);
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
          min: 0, 
          max: 100, 
          interval: 20,
        },
        series: [
          {
            data: gpuUsageArray.value,
            type: 'line',
            smooth: true,
            showSymbol: false,
            color: '#ea5455',
          },
          {
            // data: Array.from({ length: 60 }, (v) => Math.floor(Math.random() * 100) + 0).sort(),
            data: cpuUsageArray.value,
            type: 'line',
            smooth: true,
            showSymbol: false,
            color: '#7367f0',
          },
          {
            data: gpuUseMemorySizeArray.value,
            type: 'line',
            smooth: true,
            showSymbol: false,
            color: '#00cfe8',
          },
          {
            data: cpuUseMemorySizeArray.value,
            type: 'line',
            smooth: true,
            showSymbol: false,
            color: '#ff9f43',
          },
        ],
      };
      
      option && myChart.setOption(option);
    });

    const ChangeDeviceMonitor = async (systemUsage, systemInfo) => {
      systemUsage.value = await systemUsage;
      systemInfo.value = await systemInfo;
      gpuUsageArray.value.push(systemUsage.value.gpuUsage);
      cpuUsageArray.value.push(systemUsage.value.cpuUsage);
      gpuUseMemorySizeArray.value.push(systemUsage.value.gpuUseMemorySize / systemInfo.value.gpuMemorySize * 100);
      cpuUseMemorySizeArray.value.push(systemUsage.value.cpuUseMemorySize / systemInfo.value.memorySize * 100);
      if(gpuUsageArray.value.length > 60) gpuUsageArray.value.shift();
      if(cpuUsageArray.value.length > 60) cpuUsageArray.value.shift();
      if(gpuUseMemorySizeArray.value.length > 60) gpuUseMemorySizeArray.value.shift();
      if(cpuUseMemorySizeArray.value.length > 60) cpuUseMemorySizeArray.value.shift();
      
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
          min: 0, 
          max: 100, 
          interval: 20,
        },
        series: [
          {
            data: gpuUsageArray.value,
            type: 'line',
            smooth: true,
            showSymbol: false,
            color: '#ea5455',
          },
          {
            // data: Array.from({ length: 60 }, (v) => Math.floor(Math.random() * 100) + 0).sort(),
            data: cpuUsageArray.value,
            type: 'line',
            smooth: true,
            showSymbol: false,
            color: '#7367f0',
          },
          {
            data: gpuUseMemorySizeArray.value,
            type: 'line',
            smooth: true,
            showSymbol: false,
            color: '#00cfe8',
          },
          {
            data: cpuUseMemorySizeArray.value,
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
      gpuUsageArray,
      cpuUsageArray,
      gpuUseMemorySizeArray,
      cpuUseMemorySizeArray,

      ChangeDeviceMonitor
    };
  },
});
</script>
<style lang="less">
</style>
