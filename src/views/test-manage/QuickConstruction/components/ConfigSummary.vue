<style scoped lang="less">
</style>

<template>
  <a-card style="margin:10px;width: 400px">
    <h3> {{ config['configName'] }} </h3>
    <p>{{ config['configDesc'] }} </p>
    <p>配置任务简介 </p>

    <div style="display: flex; align-items: center; flex-direction: column;">
      <div style="display: flex; align-items: center; flex-direction: row; width:100%; margin-bottom: 10px">

        <div style="display: flex;flex-direction: row; align-items: center;flex: 1">
          <a-button class="tag tag--red" type="primary">
            <template #icon>
              <MyIcon type="icon-shougongji" :style="{ fontSize: '24px' }" />
            </template>
          </a-button>
          <div style="margin-left:10px">
            <p style="font-size:14px;margin: 0;" class="text">已选定{{ attackSelectedNum }}种攻击</p>
            <a style="margin: 0;" v-for="(data, index) in attackListDeclaration" :key="index" @click="showAttackModal(data)">
              {{
                data['attacker_name']
              }}</a>
          </div>
        </div>

        <div style="display: flex;flex-direction: row; align-items: center;flex: 1">
          <a-button class="tag tag--cyan" type="primary">
            <template #icon>
              <MyIcon type="icon-shujumoxing" :style="{ fontSize: '24px' }" />
            </template>
          </a-button>
          <div style="margin-left:10px">
            <p style="font-size:14px;margin: 0;" class="text">已选定{{ modelSelectedNum }}种模型</p>
            <a style="margin: 0;" v-for="(data, index) in modelListDeclaration" :key="index" @click="showModelModal(data)"> {{
                data['model_name']
              }}</a>
          </div>
        </div>

      </div>
      <div style="display: flex; align-items: center; flex-direction: row; width:100%; margin-bottom: 10px">

        <div style="display: flex;flex-direction: row; align-items: center;flex: 1;">
          <a-button class="tag tag--orange" type="primary">
            <template #icon>
              <MyIcon type="icon-shujujiguanli" :style="{ fontSize: '24px' }" />
            </template>
          </a-button>
          <div style="margin-left:10px;">
            <p style="font-size:14px;margin: 0;" class="text">已选定数据集</p>
            <p class="text-muted" style="margin: 0;"> {{configContent['dataset']}} </p>
          </div>
        </div>

        <div style="display: flex;flex-direction: row; align-items: center;flex: 1">
          <a-button class="tag tag--orange" type="primary">
            <template #icon>
              <MyIcon type="icon-shuliangbiandongtongji" :style="{ fontSize: '24px' }" />
            </template>
          </a-button>
          <div style="margin-left:10px">
            <p style="font-size:14px;margin: 0;" class="text">测试量</p>
            <p class="text-muted" style="margin: 0;">{{ configContent['dataset_size'] }}</p>
          </div>
        </div>

      </div>
    </div>

    <a-button type="primary" @click="showMapModal()" style="margin-right:5px">转移测试示意图</a-button>
    <a-button type="primary" @click="selectConfig()" style="margin-right:5px">选定预设配置</a-button>
    <a-button type="danger" @click="selectConfig()">删除</a-button>

    <a-modal v-model:visible="openMap" title="转移测试示意图" @ok="handleOk" width="50%" style="display: flex; justify-content: center;">
      <ConfigTransferTestMap :nowConfigID="config['id']" v-if="openMap" />
    </a-modal>
    <a-modal v-model:visible="openModel" title="模型配置参数" @ok="handleOk" width="50%">
      <a-descriptions :title="nowModalData['model_name'] + '配置参数'" layout="vertical" :column="1" style="margin-bottom:10px;">
        <a-descriptions-item label="模型配置参数表">
          <a-table v-if="openModel"
            :dataSource="declaration_config_params_data_conversion_model(nowModalData['info']['model_config_params'], nowModalData['model_name'])"
            :columns="declaration_config_params_columns" size="small" :pagination="false" style="width:100%" />
        </a-descriptions-item>
        <a-descriptions-item label="图片处理器配置参数表">
          <a-table v-if="openModel"
            :dataSource="declaration_config_params_data_conversion_model(nowModalData['info']['img_process_config_params'], nowModalData['model_name'])"
            :columns="declaration_config_params_columns" size="small" :pagination="false" style="width:100%" />
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
    <a-modal v-model:visible="openAttack" title="攻击配置参数" @ok="handleOk" width="50%">
      <a-descriptions :title="nowModalData['attacker_name'] + '配置参数'" layout="vertical" :column="1" style="margin-bottom:10px;">
        <a-descriptions-item label="对抗攻击配置参数表">
          <a-table v-if="openAttack"
            :dataSource="declaration_config_params_data_conversion_attack(nowModalData['info']['attack_config_params'], nowModalData['attacker_name'])"
            :columns="declaration_config_params_columns" size="small" :pagination="false" style="width:100%" />
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </a-card>
</template>

<script>
import { defineComponent, ref, onMounted, watch, computed } from 'vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';
import { getDeclaration } from '@/api/framework-api/declaration';
const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4168693_xvx31sr2sl8.js', // 在 iconfont.cn 上生成
});

import ConfigTransferTestMap from './ConfigTransferTestMap.vue';
import { async } from '@antv/x6/lib/registry/marker/main';
export default defineComponent({
  name: 'ServerNodeStatus',
  components: {
    MyIcon,
    ConfigTransferTestMap,
  },
  props: {
    index: Number,
    config: Object,
    currentServerDeclaration: Object,
  },
  setup(props, context) {
    const configContent = ref({});
    const attackSelectedNum = ref();
    const modelSelectedNum = ref();
    const attackList = ref([]);
    const modelList = ref([]);
    const declaration = ref();
    const modelListDeclaration = ref([]);
    const attackListDeclaration = ref([]);
    const declaration_config_params_columns = [
      {
        title: '参数名',
        dataIndex: 'name',
        width: '20%',
      },
      {
        title: '参数释义',
        dataIndex: 'desc',
        width: '50%',
      },
      {
        title: '参数类型',
        dataIndex: 'type',
        width: '10%',
      },
      {
        title: '参数值',
        dataIndex: 'value',
        width: '20%',
      },
    ];
    const openAttack = ref(false);
    const openModel = ref(false);
    const openMap = ref(false);
    const nowModalData = ref(null);
    const showAttackModal = (data) => {
      openAttack.value = true;
      nowModalData.value = data;
    };
    const showModelModal = (data) => {
      openModel.value = true;
      nowModalData.value = data;
    };
    const showMapModal = () => {
      openMap.value = true;
    };
    const handleOk = (e) => {
      console.log(e);
      openAttack.value = false;
      openModel.value = false;
      openMap.value = false;
    };

    onMounted(() => {
      configContent.value = JSON.parse(props.config['config']);

      modelSelectedNum.value = Object.keys(configContent.value['model_config']).length;
      attackSelectedNum.value = Object.keys(configContent.value['attacker_list']).length;
      attackList.value = Object.keys(configContent.value['attacker_list']);
      modelList.value = Object.keys(configContent.value['model_config']);
      modelListDeclaration.value = [];
      modelList.value.forEach((model, index1) => {
        console.log(props.currentServerDeclaration);
        props.currentServerDeclaration['registered_component']['model_list'].forEach((data) => {
          if (data['model_name'] == model) {
            modelListDeclaration.value[index1] = data;
          }
        });
      });
      attackListDeclaration.value = [];
      attackList.value.forEach((attack, index1) => {
        props.currentServerDeclaration['registered_component']['attacker_list'].forEach((data) => {
          if (data['attacker_name'] == attack) {
            attackListDeclaration.value[index1] = data;
          }
        });
      });
    });

    const declaration_config_params_data_conversion_attack = (data, attackName) => {
      let dataSource = [];
      for (let name in data) {
        data[name]['name'] = name;
        data[name]['value'] = configContent.value['attacker_config'][attackName][name];
        dataSource.push(data[name]);
      }
      return dataSource;
    };
    const declaration_config_params_data_conversion_model = (data, modelName) => {
      let dataSource = [];
      for (let name in data) {
        data[name]['name'] = name;
        data[name]['value'] = configContent.value['model_config'][modelName][name];
        dataSource.push(data[name]);
      }
      return dataSource;
    };

    const selectConfig =()=>{
      context.emit("selected", props.index)
    }

    return {
      configContent,
      attackSelectedNum,
      modelSelectedNum,
      attackList,
      modelList,
      declaration,
      modelListDeclaration,
      attackListDeclaration,
      declaration_config_params_columns,
      openModel,
      openAttack,
      openMap,
      nowModalData,

      declaration_config_params_data_conversion_attack,
      declaration_config_params_data_conversion_model,
      showModelModal,
      showAttackModal,
      showMapModal,
      handleOk,
      selectConfig
    };
  },
});
</script>