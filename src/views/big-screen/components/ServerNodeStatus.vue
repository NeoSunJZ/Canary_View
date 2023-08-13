<style scoped lang="less">
.ant-layout {
  background: #25293c;
}
.ant-layout-header {
  background-color: rgba(47, 51, 73, 0.95);
  box-shadow: 0 1px 0 #434968;
}
/deep/ .ant-card-bordered {
  border: unset;
  box-shadow: 0 0.25rem 1.25rem rgba(15, 20, 34, 0.4);
  border-radius: 0.375rem;
  background-clip: padding-box;
  background-color: unset;
}
/deep/ .ant-card-body {
  padding: 16px;
  border-radius: 0.375rem;
  background-color: #2f3349e5;
  border: 0 solid #434968;
}
.ant-divider {
  border-left: 1px solid #7983bb;
}
</style>
<style scoped>
.text {
  margin-top: 0;
  font-weight: 500;
  color: #cfd3ec;
  line-height: unset;
}
.text-muted {
  color: #7983bb !important;
  line-height: unset;
}
</style>
<style scoped lang="less">
.tag {
  border: unset;
  border-radius: 0.375rem !important;
  &__text {
    color: #b6bee3;
  }
  &--green {
    color: #28c76f;
    background-color: #2e4b4f;
  }
  &--purple {
    color: #7367f0;
    background-color: #3a3b64;
  }
  &--cyan {
    color: #00cfe8;
    background-color: #274c62;
  }
  &--red {
    color: #ea5455;
    background-color: #4d384b;
  }
  &--orange {
    color: #ff9f43;
    background-color: #504448;
  }
}
</style>
<style lang="less" scoped>
/deep/ .console {
  &__log-info {
    background-color: #25293c;
  }
  &__log-area {
    border-color: #434968;
  }
  &__log {
    color: #cfd3ec;
  }
}
</style>
<style lang="less" scoped>
.logo {
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 30%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  opacity: 0.4;
}
</style>

<template>
  <a-card style="margin:10px">
    <p style="font-size:20px" class="text">服务节点运行态势</p>
    <p class="text-muted">设备摘要</p>
    <a-card style="border: 1px solid #434968 !important; box-shadow:unset;">
      <p style="font-size:16px" class="text">
        设备名称 {{systemInfo.deviceName}}
      </p>
      <p class="text-muted">
        操作系统
        <MyIcon type="icon-Ubuntu" :style="{ fontSize: '24px' }" v-if="systemInfo.osVersion.indexOf('Ubuntu')!=-1" />
        <MyIcon type="icon-linux" :style="{ fontSize: '24px' }" v-else-if="systemInfo.osName.indexOf('Linux')!=-1" />
        <MyIcon type="icon-windows" :style="{ fontSize: '24px' }" v-else-if="systemInfo.osName.indexOf('Windows')!=-1" />
        <MyIcon type="icon-qitacaozuoxitong" :style="{ fontSize: '24px' }" v-else />
        <span class="text"> {{systemInfo.osName}} {{systemInfo.osVersion}}
        </span>
      </p>
      <p class="text-muted">
        CPU <span class="text"> {{systemInfo.cpuName}} </span> <a-divider type="vertical" />
        GPU <span class="text"> {{systemInfo.gpuName}} </span> <a-divider type="vertical" />
        显存 <span class="text"> {{systemInfo.gpuMemorySize}} GB</span> <a-divider type="vertical" />
        内存 <span class="text"> {{systemInfo.memorySize}} GB</span>
      </p>
      <p class="text-muted">
        系统时间 <span class="text">2023-07-15 17:18:00</span> <a-divider type="vertical" />
        网络连接 <a-tag class="tag tag--green">良好</a-tag>
      </p>
    </a-card>
    <br />
    <p class="text-muted">CPU / GPU 性能实时监控</p>
    <a-card style="border: 1px solid #434968 !important; box-shadow:unset">
      <div style="display:flex;">
        <div style="flex: 1">
          <div style="display: flex; align-items: center;">
            <a-button class="tag tag--red" type="primary">
              <template #icon>
                <MyIcon type="icon-xianqia" :style="{ fontSize: '24px' }" />
              </template>
            </a-button>
            <p class="tag__text" style="font-size: 16px; margin-left:5px">GPU</p>
          </div>
          <p style="font-size:20px" class="text">{{ systemUsage.gpuUsage}}%</p>
        <a-progress strokeColor="#ea5455" trailColor="#363b54" :percent="systemUsage.gpuUsage" size="small" :format="()=>{}" />
        </div>
        <div style="flex: 1">
          <div style="display: flex; align-items: center;">
            <a-button class="tag tag--purple" type="primary">
              <template #icon>
                <MyIcon type="icon-cpu" :style="{ fontSize: '24px' }" />
              </template>
            </a-button>
            <p class="tag__text" style="font-size: 16px; margin-left:5px">CPU</p>
          </div>
          <p style="font-size:20px" class="text">{{ systemUsage.cpuUsage}}%</p>
          <a-progress strokeColor="#7367f0" trailColor="#363b54" :percent="systemUsage.cpuUsage" size="small" :format="()=>{}" />
        </div>
        <div style="flex: 1">
          <div style="display: flex; align-items: center;">
            <a-button class="tag tag--cyan" type="primary">
              <template #icon>
                <MyIcon type="icon-neicun" :style="{ fontSize: '24px' }" />
              </template>
            </a-button>
            <p class="tag__text" style="font-size: 16px; margin-left:5px">显存</p>
          </div>
          <p style="font-size:20px" class="text">{{ systemUsage.gpuUseMemorySize}} GB</p>
          <a-progress strokeColor="#00cfe8" trailColor="#363b54" :percent="systemUsage.gpuUseMemorySize" size="small" :format="()=>{}" />
        </div>
        <div style="flex: 1">
          <div style="display: flex; align-items: center;">
            <a-button class="tag tag--orange" type="primary">
              <template #icon>
                <MyIcon type="icon-neicun" :style="{ fontSize: '24px' }" />
              </template>
            </a-button>
            <p class="tag__text" style="font-size: 16px; margin-left:5px">内存</p>
          </div>
          <p style="font-size:20px" class="text">{{ systemUsage.cpuUseMemorySize}} GB</p>
          <a-progress strokeColor="#ff9f43" trailColor="#363b54" :percent="systemUsage.cpuUseMemorySize" size="small" :format="()=>{}" />
        </div>
      </div>
    </a-card>
    <br />
    <DeviceMonitor ref="deviceMonitor"/>
  </a-card>
</template>


<script>
import { defineComponent, ref, onMounted } from 'vue';
import DeviceMonitor from './DeviceMonitor.vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';
const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4168693_xvx31sr2sl8.js', // 在 iconfont.cn 上生成
});

import { getSystemInfo } from '@/api/framework-api/system.js';
import { async } from '@antv/x6/lib/registry/marker/async';
import List from 'ant-design-vue/lib/vc-virtual-list/List';

export default defineComponent({
  name: 'ServerNodeStatus',
  components: {
    MyIcon,
    DeviceMonitor,
  },
  props: {
    nodeServerAddr: String,
  },
  setup(props) {
    const waitLoading = ref(true);
    const systemInfo = ref({
      deviceName: null,
      osName: '',
      osVersion: '',
      cpuName: null,
      gpuName: null,
      gpuMemorySize: null,
      memorySize: null,
    });
    const systemUsage = ref({
      cpuUsage : Number(0),
      gpuUsage : Number(0),
      cpuUseMemorySize : Number(0),
      gpuUseMemorySize : Number(0)
    });
    const systemClock = ref();
    const networkStatus = ref();
    const memoryUsedSize = ref();
    const deviceMonitor = ref();

    onMounted(async () => {
      systemInfo.value = await getSystemInfo(props.nodeServerAddr);
    });

    const ChangeSystemUsage = async (msg) => {
      systemUsage.value = await msg;
      await deviceMonitor.value.ChangeDeviceMonitor(systemUsage.value, systemInfo.value);
    };
    return {
      systemInfo,
      systemUsage,
      deviceMonitor,

      ChangeSystemUsage
    };
  },
});
</script>