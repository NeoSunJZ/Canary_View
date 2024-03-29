<style scoped lang="less">
</style>

<template>
  <div style="width:100%">
    <a-alert :message="'请注意，您至多可选择(并移动至右侧) ' + maxItem + ' 个选项'" type="info" show-icon v-if="maxItem != null"
      style="margin-bottom:5px " />
    <a-transfer v-model:target-keys="targetKeys" v-model:selected-keys="selectedKeys" :data-source="data"
      :rowKey="(record) => String(record[fields.id])" :showSelectAll="false"
      :list-style="{ 'min-width': '250px', 'min-height': '300px', flex: 1, }" :titles="[' 已(预)加载', ' 已选定']"
      :operations="['加入队列', '移除队列']" @change="handleMoveItemChange" style="width: 100%">

      <template
        #children="{ direction, filteredItems, selectedKeys, disabled: listDisabled, onItemSelectAll, onItemSelect }">
        <a-spin :spinning="direction === 'left' && loading" tip="正在加载">
          <a-table
            :row-selection="getRowSelection({ disabled: listDisabled, selectedKeys, onItemSelectAll, onItemSelect, })"
            :custom-row="({ key, disabled: itemDisabled }) => ({ onClick: () => { if (itemDisabled || listDisabled) return; onItemSelect(key, !selectedKeys.includes(key)); }, })"
            :columns="direction === 'left' ? leftTableColumns : rightTableColumns" :data-source="filteredItems"
            size="small" :style="{ pointerEvents: listDisabled ? 'none' : null }"
            :pagination="direction === 'left' ? pagination : { pageSize: 5 }"
            @change="(...args) => { direction === 'left' ? handleLeftTableChange(...args) : () => { } }"
            :scroll="direction === 'left' ? { x: 800 } : { x: 1000 }">

            <template #bodyCell="{ column, record }">
              <slot name="tableCell" :column="column" :record="record"></slot>
            </template>

          </a-table>
        </a-spin>
      </template>

      <template #footer="{ direction }">
        <a-button v-if="direction === 'left'" size="small" style="float: left; margin: 5px" @click="reloadData">
          重新加载所有列表
        </a-button>
        <div v-if="direction === 'right'" style="float: left; margin: 5px">
          <ConfigStatusNotice />
        </div>
      </template>

    </a-transfer>

  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed, nextTick } from 'vue';

import ConfigStatusNotice from './ConfigStatusNotice.vue';

export default defineComponent({
  name: 'CommonTransfer',
  emits: ['move-item-change'],
  components: {
    ConfigStatusNotice,
  },
  props: {
    leftTableColumns: Array,
    rightTableColumns: Array,
    fields: Object,
    getDataResource: Function,
    maxItem: Number,
  },
  setup(props, context) {
    // 核心展示数据（可为模型、攻击或防御方法）
    const data = ref([]);
    // 已选中项目
    const targetKeys = ref([]);
    const selectedKeys = ref([]);

    const maxDisabled = computed(() => {
      if (props.maxItem != null && targetKeys.value.length + selectedKeys.value.length >= props.maxItem) {
        return true;
      } else {
        return false;
      }
    });

    const loading = ref(false);
    // 加载
    const loadPageSize = ref(5); // 分页加载：一页加载几条
    let loadPage = 1; // 当前加载页码 (实际加载页)
    let loadFinished = false; // 加载完成标志

    // 分页时用：数据总条数
    const dataTotalSize = ref(0);
    // 分页时用：已经完成加载的数据总条数
    const dataTotalLoadSize = ref(0);

    const currentPage = ref(1); //当前显示页码

    // 分页器
    const pagination = computed(() => {
      return {
        total: dataTotalSize.value - targetKeys.value.length, // 未选中的条目数
        current: currentPage.value, //当前显示的页
        pageSize: loadPageSize.value, //当前显示多少条(和分页的大小一致)
      };
    });

    // 拉取攻击方法信息
    onMounted(async () => {
      await loadData();
    });

    const reloadData = async () => {
      data.value = [];
      targetKeys.value = [];
      loadPage = 1;
      loadFinished = false;
      dataTotalSize.value = 0;
      dataTotalLoadSize.value = 0;
      currentPage.value = 1;
      await loadData();
    };

    // 加载数据
    const loadData = async () => {
      if (!loadFinished) {
        loading.value = true;
        const newLoadData = await props.getDataResource(loadPage, loadPageSize.value);

        newLoadData.list.forEach((element) => {
          element.disabled = computed(() => {
            let inTarget = Object.values(selectedKeys.value).indexOf(String(element[props.fields.id])) != -1;
            let inSelected = Object.values(targetKeys.value).indexOf(String(element[props.fields.id])) != -1;
            return inTarget || inSelected ? false : maxDisabled.value;
          });
        });

        data.value = data.value.concat(newLoadData.list);
        dataTotalSize.value = newLoadData.total;
        dataTotalLoadSize.value = dataTotalLoadSize.value + newLoadData.size;

        loadFinished = newLoadData.isLastPage;
        loading.value = false;
      }
    };

    const loadMoreData = async () => {
      // 左侧待选已加载的项目数 dataTotalLoadSize - targetKeys.value.length
      // 左侧需显示的项目数 loadPageSize*currentPage
      // 若已加载小于需显示，则继续向后加载
      while (dataTotalLoadSize.value - targetKeys.value.length < loadPageSize.value * currentPage.value && !loadFinished) {
        loadPage++;
        await loadData();
      }
    };

    // 处理右表分页切换事件
    const handleLeftTableChange = (newPagination, filters, sorter) => {
      currentPage.value = newPagination.current;
      loadMoreData();
    };

    // 处理选中(穿梭框移动)事件
    const handleMoveItemChange = (targetKeys, direction, moveKeys) => {
      loadMoreData();
      context.emit('move-item-change', targetKeys, direction, moveKeys);
    };

    const getRowSelection = ({ disabled, selectedKeys, onItemSelectAll, onItemSelect }) => {
      return {
        getCheckboxProps: (item) => ({
          disabled: disabled || item.disabled,
        }),

        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows.filter((item) => !item.disabled).map(({ key }) => key);
          onItemSelectAll(treeSelectedKeys, selected);
        },

        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },

        selectedRowKeys: selectedKeys,
      };
    };

    const submit = () => {
      return data.value.filter((element) => {
        return Object.values(targetKeys.value).indexOf(String(element[props.fields.id])) != -1;
      });
    };

    return {
      data,
      pagination,
      targetKeys,
      selectedKeys,

      loading,

      getRowSelection,
      handleLeftTableChange,
      handleMoveItemChange,

      loadData,
      reloadData,
      submit,
    };
  },
});
</script>
