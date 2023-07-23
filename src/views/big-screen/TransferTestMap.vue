<template>
  <div id="container-TransferTestMap" style="height: 180px"></div>
</template>


<script>
import { defineComponent, ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { getTaskByTaskID } from '@/api/task-api/taskInfo.js'
import 'echarts-gl';

export default defineComponent({
  name: 'TransferTestMap',
  props: {
    //
  },
  setup(props) {
    let myChart;
    const taskID = ref();
    const taskInfo = ref({});
    const taskConfig = ref({});

    onMounted(() => {
      let chartDom = document.getElementById('container-TransferTestMap');
      taskID.value = localStorage.getItem('nowTaskID');
      myChart = echarts.init(chartDom, 'dark');
      loadInintData();
    });

    const loadInintData = async () => {
      let transferAttackTestMode;
      let transferAttackTest;
      taskInfo.value = await getTaskByTaskID(taskID.value);
      taskConfig.value = JSON.parse(taskInfo.value['config']);
      transferAttackTestMode = JSON.stringify(taskConfig.value['transfer_attack_test_mode']);
      transferAttackTest = taskConfig.value['transfer_attack_test_on_model_list'];
      if (transferAttackTestMode == '"APPOINT"') { init(transferAttackTest) }
      else {
        let transferDataTemp = {}
        Object.keys(taskConfig.value.attacker_list).forEach((attack_name) => {
          transferDataTemp[attack_name] = {}
          Object.keys(taskConfig.value.model_config).forEach((base_model) => {
            transferDataTemp[attack_name][base_model] = []
            if (transferAttackTestMode == '"SELF_CROSS"') {
              Object.keys(taskConfig.value.model_config).forEach((test_model) => {
                transferDataTemp[attack_name][base_model].push(test_model)
              })
            } else if (transferAttackTestMode == '"NOT"') {
              transferDataTemp[attack_name][base_model].push(base_model)
            }
          })
        })
        init(transferDataTemp);
      }
    };
    
    const init = (transfer_data) => {
      let series = [];
      let test_model_list = [];
      let base_model_list = [];
      Object.keys(transfer_data).forEach((attack_name) => {
        let data = [];

        let transfer_model = transfer_data[attack_name];
        Object.keys(transfer_model).forEach((base_model) => {
          if (base_model_list.indexOf(base_model) == -1) {
            base_model_list.push(base_model);
          }
          let base_model_id = base_model_list.indexOf(base_model);
          transfer_model[base_model].forEach((test_model) => {
            if (test_model_list.indexOf(test_model) == -1) {
              test_model_list.push(test_model);
            }
            let test_model_id = test_model_list.indexOf(test_model);

            data.push([base_model_id, test_model_id, 1]);
          });
        });

        console.log(data);

        series.push({
          name: attack_name,
          type: 'bar3D',
          data: data,
          stack: 'stack',
          shading: 'lambert',
          itemStyle: {
            opacity: 0.9,
            color: function (params) {
              if (params.data[0] == params.data[1]) {
                return '#ea5455';
              } else {
                return '#7367F0';
              }
            },
          },
          emphasis: {
            label: {
              show: true,
              formatter: function (params) {
                return 'Atk: ' + attack_name + '\nBase: ' + base_model_list[params.data[0]] + '\nTest: ' + test_model_list[params.data[1]];
              },
              color: '#fff',
              backgroundColor: 'rgba(115, 103, 240, 0.16)',
            },
          },
        });
      });
      myChart.setOption({
        backgroundColor: '#2f3349',
        axisLine: {
          lineStyle: {
            color: '#cfd3ec',
          },
        },
        xAxis3D: {
          name: 'Base Model',
          type: 'category',
          nameTextStyle: {
            color: '#7983bb',
            fontSize: '10px',
          },
          data: base_model_list,
          axisLabel: {
            textStyle: {
              color: '#cfd3ec',
            },
          },
        },
        yAxis3D: {
          name: 'Test Model',
          type: 'category',
          nameTextStyle: {
            color: '#7983bb',
            fontSize: '10px',
          },
          data: test_model_list,
          axisLabel: {
            textStyle: {
              color: '#cfd3ec',
            },
          },
        },
        zAxis3D: {
          name: 'Attack Method',
          type: 'value',
          nameTextStyle: {
            color: '#7983bb',
            fontSize: '10px',
          },
          axisLabel: {
            textStyle: {
              color: '#cfd3ec',
            },
            formatter: function (index) {
              if (Number.isInteger(index)) {
                return Object.keys(transfer_data)[index - 1];
              } else {
                return null;
              }
            },
          },
        },
        grid3D: {
          viewControl: {
            autoRotate: true,
            rotateSensitivity: 2,
          },
          light: {
            main: {
              shadow: true,
              quality: 'ultra',
              intensity: 1.5,
            },
          },
        },
        series: series,
      });
    };

    return {
      //
    };
  },
});
</script>
<style lang="less"></style>
