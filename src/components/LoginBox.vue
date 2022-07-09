<template>
  <a-card
    style="width: 25%; left: 60%; top: 50px"
    title="登陆"
    :tab-list="tabList"
    :active-tab-key="key"
    @tabChange="(key) => onTabChange(key, 'key')"
  >
    <template #extra>
      <a href="#">More</a>
    </template>
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="Username"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
        <a-checkbox v-model:checked="formState.remember"
          >Remember me</a-checkbox
        >
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit" @click="login"
          >Submit</a-button
        >
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script>
import { defineComponent, reactive } from "vue";
// import * as axios from "axios";
export default defineComponent({
  setup() {
    const formState = reactive({
      username: "",
      password: "",
      remember: true,
    });

    const onFinish = (values) => {
      console.log("Success:", values);
    };

    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };
    return {
      formState,
      onFinish,
      onFinishFailed,
    };
  },
  methods: {
    login() {
      this.$router.push({ path: "/MainPage" });
    },
  },
});
</script>
