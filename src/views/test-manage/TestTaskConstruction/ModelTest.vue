<style scoped lang="less">
@import '~ant-design-vue/dist/antd.less';
.submenu {
  height: 50px;
}

.attack-task {
  margin-bottom: 10px;
  &__title {
    margin-bottom: 20px;
  }
  &__type-select {
    &__title {
      margin-bottom: 5px;
    }
    &__notice {
      margin-bottom: 20px;
      &__title {
        color: @primary-color;
      }
      &__warning {
        color: @error-color;
      }
    }
  }
  &__steps {
    margin-bottom: 10px;
  }
  &__attack-selector {
    display: flex;
    justify-content: center;
    padding: 10px;
  }
}
</style>

<template>
  <MainPageNavigation :selectedKeys="['6']" :openKeys="['sub2']">
    <template v-slot:submenu>
      <a-menu :selectedKeys="['modelTest']" mode="horizontal" class="submenu">
        <a-menu-item key="defenseTest" @click="toPage('TestTaskConstruction/DefenseTest')"> 防御测试 </a-menu-item>
        <a-menu-item key="attackTest" @click="toPage('TestTaskConstruction/AttackTest')"> 攻击测试 </a-menu-item>
        <a-menu-item key="modelTest" @click="toPage('TestTaskConstruction/ModelTest')"> 模型测试 </a-menu-item>
      </a-menu>
    </template>
    <template v-slot:breadcrumb>
      <a-breadcrumb-item>测试任务管理</a-breadcrumb-item>
      <a-breadcrumb-item>测试任务构建</a-breadcrumb-item>
      <a-breadcrumb-item>模型测试</a-breadcrumb-item>
    </template>
    <template v-slot:content>
      <a-row type="flex" class="attack-task">
        <a-col flex="1 1">
          <h2 class="attack-task__title">模型测试构建</h2>
          <div>
            <p class="attack-task__type-select__title">
              <deployment-unit-outlined /> 构建向导类型
            </p>
            <a-select ref="select" v-model:value="attackType" style="width: 100%" :options="attackTypes" @focus="focus" @change="handleChange"></a-select>
          </div>
        </a-col>
        <ServerNodeCard @serverSelected="handleServerChange"></ServerNodeCard>
      </a-row>
    </template>
  </MainPageNavigation>
</template>

<script>
import MainPageNavigation from '@/components/MainPageNavigation.vue';
import ServerNodeCard from '@/components/ServerNodeCard.vue';
import { defineComponent, ref, onMounted, computed } from 'vue';
import { message, Empty } from 'ant-design-vue';
import { DeploymentUnitOutlined, ClusterOutlined } from '@ant-design/icons-vue';
import router from '@/router';

export default defineComponent({
  name: 'ModelTest',
  setup() {
    const toPage = (page) => {
      router.push({ path: '/' + page });
    };

    return {
      message,
      toPage,
    };
  },
  components: {
    MainPageNavigation,
    ServerNodeCard,
    DeploymentUnitOutlined,
    ClusterOutlined,
  },
});
</script>
