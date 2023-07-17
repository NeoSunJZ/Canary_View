<style scoped lang="less">
.title {
  margin-bottom: 15px;
}
.editable-cell {
  position: relative;
  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
    display: flex;
    align-items: center;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.state {
  display: flex;
  flex-direction: row;
  align-items: center;
  // justify-content: space-around;
  &__greenpoint {
    display: inline-block;
    height: 5px;
    width: 5px;
    border-radius: 16px;
    color: #fff;
    background: rgb(119, 228, 119);
    margin-right: 3px;
  }
  &__redpoint {
    display: inline-block;
    height: 5px;
    width: 5px;
    border-radius: 16px;
    color: #fff;
    background: rgb(175, 2, 2);
    margin-right: 3px;
  }
  &__running {
    margin-right: 10px;
    color: rgb(8, 179, 8);
  }
  &__stopping {
    margin-right: 10px;
    color: rgb(237, 6, 6);
  }
}
</style>

<template>
  <h2 class="title">服务资源列表</h2>

  <!-- 新增节点，还在构建中 -->
  <AddNodeForm @onSubmit="getInfo"></AddNodeForm>

  <!-- 节点表 -->
  <a-table bordered :data-source="dataSource" :columns="columns" :pagination="pagination" @change="(...args) => handleTableChange(...args)" size="small">
    <!-- record是每一行数据的副本 -->
    <template #bodyCell="{ column, text, record }">

      <template v-if="column.dataIndex === 'name'">
        <div class="editable-cell">
          <div v-if="editableData[record.key]&&editableElement[record.key]=='name'" class="editable-cell-input-wrapper">
            <a-input v-model:value="editableData[record.key].name" @pressEnter="save(record.key)" />
            <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || ' ' }}
            <edit-outlined class="editable-cell-icon" @click="edit(record.key,'name')" />
          </div>
        </div>
      </template>

      <template v-else-if="column.dataIndex === 'ip'">
        <div class="editable-cell">
          <div v-if="editableData[record.key]&&editableElement[record.key]=='ip'" class="editable-cell-input-wrapper">
            <a-input v-model:value="editableData[record.key].ip" @pressEnter="save(record.key)" />
            <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || ' ' }}
            <edit-outlined class="editable-cell-icon" @click="edit(record.key,'ip')" />
          </div>
        </div>
      </template>

      <template v-else-if="column.dataIndex === 'port'">
        <div class="editable-cell">
          <div v-if="editableData[record.key]&&editableElement[record.key]=='port'" class="editable-cell-input-wrapper">
            <a-input v-model:value="editableData[record.key].port" @pressEnter="save(record.key)" />
            <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || ' ' }}
            <edit-outlined class="editable-cell-icon" @click="edit(record.key,'port')" />
          </div>
        </div>
      </template>

      <template v-else-if="column.dataIndex === 'description'">
        <div class="editable-cell">
          <div v-if="editableData[record.key]&&editableElement[record.key]=='description'" class="editable-cell-input-wrapper">
            <a-input v-model:value="editableData[record.key].description" @pressEnter="save(record.key)" />
            <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || ' ' }}
            <edit-outlined class="editable-cell-icon" @click="edit(record.key,'description')" />
          </div>
        </div>
      </template>

      <template v-else-if="column.dataIndex === 'status'">
        <StatusGrid :ip="record.ip" :port="record.port" @success="(data)=>{record.declaration=data}"></StatusGrid>
      </template>

      <template v-else-if="column.dataIndex === 'operation'">
        <a-popconfirm v-if="dataSource.length" title="确认删除?" okText="确定" cancelText="取消" @confirm="onDelete(record.key)">
          <a>删除</a>
        </a-popconfirm>
      </template>
    </template>
    <template #expandedRowRender="{record}">
      <div style="margin-bottom: 5px">
        <a-alert v-if="record.declaration != null" :message="'节点已连接，组件声明已获取(报告时间：'+record.declaration['datatime']+')'" type="success" show-icon />
        <a-alert v-else message="节点连接已丢失，未能获取组件声明" type="error" show-icon />
      </div>
      <a-collapse v-if="record.declaration != null">
        <a-collapse-panel key="1" header="数据集">
          <a-collapse>
            <a-collapse-panel :key="index" :header="'数据集:'+data['dataset_name']" v-for="data,index in record.declaration['registered_component']['dataset_list']">
              <a-descriptions :title="data['dataset_name'] + '信息'" style="margin-bottom:10px;">
              </a-descriptions>
              <a-descriptions :title="data['dataset_name'] + '子组件状态'" :column="4" bordered>
                <a-descriptions-item v-for="status, name in data['sub_component']" :key="name">
                  <template #label>
                    <p>{{name}}</p>
                    <p>({{sub_component[name]}})</p>
                  </template>
                  <div v-if="status">
                    <a-badge status="success" />就绪
                  </div>
                  <div v-else>
                    <a-badge status="error" />未找到
                  </div>
                </a-descriptions-item>
              </a-descriptions>
            </a-collapse-panel>
          </a-collapse>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="深度学习模型">
          <a-collapse>
            <a-collapse-panel :key="index" :header="'模型:'+data['model_name']" v-for="data,index in record.declaration['registered_component']['model_list']">
              <a-descriptions :title="data['model_name'] + '信息'" style="margin-bottom:10px;">
              </a-descriptions>
              <a-descriptions :title="data['model_name'] + '配置参数'" layout="vertical" :column="1" style="margin-bottom:10px;">
                <a-descriptions-item label="模型配置参数表">
                  <a-table :dataSource="declaration_config_params_data_conversion(data['info']['model_config_params'])" :columns="declaration_config_params_columns" size="small"
                    :pagination="false" style="width:80%" />
                </a-descriptions-item>
                <a-descriptions-item label="图片处理器配置参数表">
                  <a-table :dataSource="declaration_config_params_data_conversion(data['info']['img_process_config_params'])" :columns="declaration_config_params_columns"
                    size="small" :pagination="false" style="width:80%" />
                </a-descriptions-item>
              </a-descriptions>
              <a-descriptions :title="data['model_name'] + '子组件状态'" :column="4" bordered>
                <a-descriptions-item v-for="status, name in data['sub_component']" :key="name">
                  <template #label>
                    <p>{{name}}</p>
                    <p>({{sub_component[name]}})</p>
                  </template>
                  <div v-if="status">
                    <a-badge status="success" />就绪
                  </div>
                  <div v-else>
                    <a-badge status="error" />未找到
                  </div>
                </a-descriptions-item>
              </a-descriptions>
            </a-collapse-panel>
          </a-collapse>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="对抗攻击">
          <a-collapse>
            <a-collapse-panel :key="index" :header="'算法:'+data['attacker_name']" v-for="data,index in record.declaration['registered_component']['attacker_list']">
              <a-descriptions :title="data['attacker_name'] + '信息'" style="margin-bottom:10px;">
                <a-descriptions-item label="攻击类型">{{data['info']['attack_type']}}</a-descriptions-item>
              </a-descriptions>
              <a-descriptions :title="data['attacker_name'] + '配置参数'" layout="vertical" :column="1" style="margin-bottom:10px;">
                <a-descriptions-item label="对抗攻击配置参数表">
                  <a-table :dataSource="declaration_config_params_data_conversion(data['info']['attack_config_params'])" :columns="declaration_config_params_columns" size="small"
                    :pagination="false" style="width:80%" />
                </a-descriptions-item>
              </a-descriptions>
              <a-descriptions :title="data['attacker_name'] + '子组件状态'" :column="4" bordered>
                <a-descriptions-item v-for="status, name in data['sub_component']" :key="name">
                  <template #label>
                    <p>{{name}}</p>
                    <p>({{sub_component[name]}})</p>
                  </template>
                  <div v-if="status">
                    <a-badge status="success" />就绪
                  </div>
                  <div v-else>
                    <a-badge status="error" />未找到
                  </div>
                </a-descriptions-item>
              </a-descriptions>
            </a-collapse-panel>
          </a-collapse>
        </a-collapse-panel>
      </a-collapse>
    </template>
  </a-table>
</template>



<script>
import AddNodeForm from '@/views/node-manage/components/AddNodeForm.vue';
import StatusGrid from '@/views/node-manage/components/StatusGrid.vue';
import { defineComponent, ref, computed, reactive, onBeforeMount } from 'vue';
import { DeploymentUnitOutlined, ClusterOutlined, CheckOutlined, EditOutlined, SyncOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash-es';
import { getNodeInfo, deleteNodeInfo, updateNodeInfo } from '@/api/node-api/nodeinfo';

export default defineComponent({
  name: 'ServerInfoTable',
  components: {
    DeploymentUnitOutlined,
    ClusterOutlined,
    CheckOutlined,
    EditOutlined,
    SyncOutlined,
    AddNodeForm,
    StatusGrid,
  },
  props: {
    //
  },
  setup() {
    const getInfo = async () => {
      // 新增节点了直接刷新
      const data = await getNodeInfo();
      data.forEach((element, index) => {
        dataSource.value[index] = {
          key: element.nodeID,
          index: index + 1,
          name: element.nodeName,
          ip: element.host,
          port: parseInt(element.port),
          description: element.nodeDesc,
          createTime: element.createTime,
          status: 'unknown',
          declaration: null,
        };
      });
      totalNodeInfo.value = data.length;
    };

    // 表格显示的每一列的标题等属性
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: '5%',
      },
      {
        title: '服务器',
        dataIndex: 'name',
        width: '20%',
      },
      {
        title: 'IP地址',
        dataIndex: 'ip',
        width: '15%',
      },
      {
        title: '端口',
        dataIndex: 'port',
        width: '10%',
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '25%',
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '15%',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '10%',
      },
    ];

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
        title: '是否必须',
        dataIndex: 'required',
        width: '10%',
      },
      {
        title: '默认值',
        dataIndex: 'def',
        width: '10%',
      },
    ];

    const totalNodeInfo = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const pagination = computed(() => {
      return {
        total: totalNodeInfo.value,
        current: currentPage.value,
        pageSize: pageSize.value,
      };
    });

    // 换页面
    const handleTableChange = (newPagination, filters, sorter) => {
      currentPage.value = newPagination.current;
    };

    // 显示的数据源
    const dataSource = ref([]);

    // 正在编辑的行的数据副本
    const editableData = reactive({});

    // 正在编辑的属性
    const editableElement = ref({});

    const edit = (key, element) => {
      // 深拷贝一份原有数据
      editableData[key] = cloneDeep(dataSource.value.filter((item) => key === item.key)[0]);
      editableElement.value[key] = element;
    };

    const save = async (key) => {
      // 将编辑的数据覆盖数据源中对应的对象
      Object.assign(dataSource.value.filter((item) => key === item.key)[0], editableData[key]);
      let success = await updateNodeInfo(editableData[key].key, editableData[key].ip, editableData[key].port, editableData[key].name, editableData[key].description);
      console.log(success);
      delete editableData[key];
      editableElement.value[key] = '';
    };

    const onDelete = async (key) => {
      dataSource.value = dataSource.value.filter((item) => item.key !== key);
      let success = await deleteNodeInfo(key);
      if (success) totalNodeInfo.value--;
      if (totalNodeInfo.value % pageSize.value == 0 && currentPage.value > 1) currentPage.value--;
    };

    const declaration_config_params_data_conversion = (data) => {
      let dataSource = [];
      for (let name in data) {
        data[name]['name'] = name;
        dataSource.push(data[name]);
      }
      return dataSource;
    };

    const sub_component = {
      model_create_func: '模型构建函数',
      inference_detector: '预测函数',
      target_layers_getter: '模型目标层获取函数',
      attack_func: '攻击核心函数',
      attacker_class: '攻击类',
      attack_init: '攻击初始化函数',
      model_config_params_handler: '模型配置参数转换函数',
      attacker_config_params_handler: '攻击配置参数转换函数',
      img_process_config_params_handler: '图像处理配置参数转换函数',
      img_preprocessor: '图像预处理函数',
      img_reverse_processor: '图像逆预处理函数',
      result_postprocessor: '预测结果处理函数',
      dataset_loader_handler: '数据集加载函数',
    };

    onBeforeMount(async () => {
      await getInfo();
    });
    return {
      getInfo,
      columns,
      declaration_config_params_columns,
      onDelete,
      dataSource,
      editableData,
      editableElement,
      totalNodeInfo,
      currentPage,
      pageSize,
      pagination,
      handleTableChange,
      edit,
      save,
      declaration_config_params_data_conversion,
      sub_component,
    };
  },
});
</script>