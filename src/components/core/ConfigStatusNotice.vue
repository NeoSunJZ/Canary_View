<style scoped lang="less">
@import '~ant-design-vue/dist/antd.less';
</style>

<template>
  <a-popconfirm ok-text="关闭" :showCancel="false">
    <template #title>
      <div>
        配置状态可能为如下类型
        <br />
        <br />
        <div style="margin-bottom:5px">
          <a-tag color="success">
            <CheckCircleOutlined /> 就绪
          </a-tag>: 该方法的配置已经成功完成
        </div>
        <div style="margin-bottom:5px">
          <a-tag color="processing">
            <SyncOutlined /> 请稍后/正在获取……
          </a-tag>: 表示正在请求数据，请等待网络请求
        </div>
        <div style="margin-bottom:5px">
          <a-tag color="warning">
            <ExclamationCircleOutlined /> 未完成参数配置
          </a-tag>: 该方法在配置时被用户取消或失败而没有完成配置，请点击 <a-typography-text type="warning">[参数配置]</a-typography-text> 重新配置
        </div>
        <div style="margin-bottom:5px">
          <a-tag color="warning">
            <ExclamationCircleOutlined /> 该攻击方法在当前服务节点有多个绑定
          </a-tag>: 请在 <a-typography-text type="warning">[详情]</a-typography-text> 内选择所希望使用的攻击方法实现，然后点击 <a-typography-text type="warning">
            [刷新]</a-typography-text> 继续操作
        </div>
        <br />
        以下两类严重错误<a-typography-text type="error">无法在本页面解决</a-typography-text>
        <br />
        <div style="margin-bottom:5px">
          <a-tag color="error">
            <CloseCircleOutlined /> 该攻击方法在当前服务节点没有绑定
          </a-tag>: 请将当前节点已实现的攻击方法绑定至该攻击方法后重试
        </div>
        <div style="margin-bottom:5px">
          <a-tag color="error">
            <CloseCircleOutlined /> 当前服务节点未提供绑定的方法实现
          </a-tag>: 请检查当前节点是否已经实现攻击方法，其名称是否与绑定的名称一致
        </div>
      </div>
    </template>
    <a>
      <QuestionCircleOutlined /> 配置状态含义
    </a>
  </a-popconfirm>
</template>

<script>
import { defineComponent } from 'vue';
import { CloseCircleOutlined, CheckCircleOutlined, SyncOutlined, ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'ConfigStatusNotice',
  components: {
    CloseCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    ExclamationCircleOutlined,
    QuestionCircleOutlined,
  },
  setup() {
  },
});
</script>
