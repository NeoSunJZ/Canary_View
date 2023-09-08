<style scoped lang="less">
@import "../Screen.less";
</style>

<template>
  <a-card style="margin:10px;">
    <p style="font-size:20px" class="text">当前任务配置详情</p>
    <p class="text-muted">配置任务简介 </p>
    <div style="display: flex; align-items: center; flex-direction: row;">
      <div style="flex:1; flex-direction: row; display: flex; justify-content: space-around">
        <div style="display: flex;flex-direction: row; align-items: center;flex: 1">
          <a-button class="tag tag--red" type="primary">
            <template #icon>
              <MyIcon type="icon-shougongji" :style="{ fontSize: '24px' }" />
            </template>
          </a-button>
          <div style="margin-left:10px">
            <p style="font-size:14px;margin: 0;" class="text">已选定{{ attackSelectedNum }}种攻击</p>
            <p class="text-muted" style="margin: 0;" v-if="configID == null">待选择</p>
            <p class="text-muted" style="margin: 0;" v-else v-for="(data, index) in attackListDeclaration" :key="index"
              @click="showAttackModal(data)">
              {{
                data['attacker_name']
              }}</p>
            <a-modal v-model:visible="openAttack" title="攻击配置参数" @ok="handleOk" width="50%">
              <a-descriptions :title="nowModalData['attacker_name'] + '配置参数'" layout="vertical" :column="1"
                style="margin-bottom:10px;">
                <a-descriptions-item label="对抗攻击配置参数表">
                  <a-table v-if="openAttack"
                    :dataSource="declaration_config_params_data_conversion_attack(nowModalData['info']['attack_config_params'], nowModalData['attacker_name'])"
                    :columns="declaration_config_params_columns" size="small" :pagination="false" style="width:100%" />
                </a-descriptions-item>
              </a-descriptions>
            </a-modal>
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
            <p class="text-muted" style="margin: 0;" v-if="configID == null">待选择</p>
            <p class="text-muted" style="margin: 0;" v-else v-for="(data, index) in modelListDeclaration" :key="index"
              @click="showModelModal(data)"> {{
                data['model_name']
              }}</p>
            <a-modal v-model:visible="openModel" title="模型配置参数" @ok="handleOk" width="50%">
              <a-descriptions :title="nowModalData['model_name'] + '配置参数'" layout="vertical" :column="1"
                style="margin-bottom:10px;">
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
          </div>
        </div>
        <div style="display: flex;flex-direction: row; align-items: center;flex: 1">
          <a-button class="tag tag--orange" type="primary">
            <template #icon>
              <MyIcon type="icon-shujujiguanli" :style="{ fontSize: '24px' }" />
            </template>
          </a-button>
          <div style="margin-left:10px;">
            <p style="font-size:14px;margin: 0;" class="text">已选定数据集</p>
            <p class="text-muted" style="margin: 0;" v-if="configID == null">待选择</p>
            <p class="text-muted" style="margin: 0;" v-else-if="config.dataset == 'ILSVRC-2012'"> ImageNet </p>
            <p class="text-muted" style="margin: 0;" v-else-if="config.dataset == 'CIFAR-100'"> CIFAR-100 </p>
            <p class="text-muted" style="margin: 0;" v-else-if="config.dataset == 'FashionMNIST'"> F-MNIST </p>
            <p class="text-muted" style="margin: 0;" v-else> CIFAR-10 </p>
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
            <p class="text-muted" style="margin: 0;" v-if="configID == null">待选择</p>
            <p class="text-muted" style="margin: 0;" v-else>{{ config.dataset_size }}</p>
          </div>
        </div>
        <div style="display: flex;flex-direction: row; align-items: center;flex: 1" v-if="configID != null">
          <a-button type="primary" @click="showMapModal()">转移测试示意图</a-button>
          <a-modal v-model:visible="openMap" title="转移测试示意图" @ok="handleOk" width="50%">
            <ConfigTransferTestMap :nowConfigID="configID" v-if="openMap" />
          </a-modal>
        </div>
      </div>

    </div>
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
    nowConfigID: Number,
    nowConfig: Object,
    nowDeclaration: Object,
  },
  setup(props) {
    const configID = ref(null);
    const config = ref({});
    const attackSelectedNum = ref();
    const modelSelectedNum = ref();
    const activeKey1 = ref([]);
    const activeKey2 = ref([]);
    const attackList = ref([]);
    const modelList = ref([]);
    const declaration = ref();
    const modelListDeclaration = ref([]);
    const attackListDeclaration = ref([]);
    const declaration_config_params_columns = [
      {
        title: '参数名',
        dataIndex: 'name',
        width: '25%',
      },
      {
        title: '参数释义',
        dataIndex: 'desc',
        width: '50%',
      },
      {
        title: '参数类型',
        dataIndex: 'type',
        width: '15%',
      },
      {
        title: '参数值',
        dataIndex: 'value',
        width: '10%',
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
    const handleOk = e => {
      console.log(e);
      openAttack.value = false;
      openModel.value = false;
      openMap.value = false;
    };
    const loadTaskData = async () => {
      if (configID.value != null) {
        modelSelectedNum.value = Object.keys(config.value['model_config']).length;
        attackSelectedNum.value = Object.keys(config.value['attacker_list']).length;
        attackList.value = Object.keys(config.value['attacker_list']);
        modelList.value = Object.keys(config.value['model_config']);
        modelListDeclaration.value = []
        modelList.value.forEach((model, index1) => {
          declaration.value.registered_component.model_list.forEach((data,) => {
            if (data['model_name'] == model) {
              modelListDeclaration.value[index1] = data
            }
          });
        });
        attackListDeclaration.value = []
        attackList.value.forEach((attack, index1) => {
          declaration.value.registered_component.attacker_list.forEach((data,) => {
            if (data['attacker_name'] == attack) {
              attackListDeclaration.value[index1] = data
            }
          });
        });
      }
    };

    onMounted(() => {
      configID.value = props.nowConfigID;
      config.value = props.nowConfig;
      declaration.value = props.nowDeclaration;
      loadTaskData();

    });
    watch(() => props.nowConfigID, (val) => {
      configID.value = val;
      config.value = props.nowConfig;
      loadTaskData();
    });

    const declaration_config_params_data_conversion_attack = (data, attackName) => {
      let dataSource = [];
      for (let name in data) {
        data[name]['name'] = name;
        data[name]['value'] = config.value['attacker_config'][attackName][name];
        dataSource.push(data[name]);
      }
      return dataSource;
    };
    const declaration_config_params_data_conversion_model = (data, modelName) => {
      let dataSource = [];
      for (let name in data) {
        data[name]['name'] = name;
        data[name]['value'] = config.value['model_config'][modelName][name];
        dataSource.push(data[name]);
      }
      return dataSource;
    };

    return {
      configID,
      config,
      attackSelectedNum,
      modelSelectedNum,
      activeKey1,
      activeKey2,
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
    };
  },
},
);
</script>