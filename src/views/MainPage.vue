<template>
  <div>
    <TopNavigation
      @onClickButton="changeLeftNavigation"
      style="margin-top: -60px"
    ></TopNavigation>
    <div style="display: flex; align-items: center">
      <LeftNavigation :changestate="leftnavigationstate"></LeftNavigation>12345
    </div>
  </div>
</template>

<script>
import LeftNavigation from "@/components/LeftNavigation.vue";
import TopNavigation from "@/components/TopNavigation.vue";
export default {
  name: "MainPage",
  data() {
    return {
      leftnavigationstate: false,
    };
    //
  },
  methods: {
    changeLeftNavigation(state) {
      this.leftnavigationstate = state;
    },
  },
  components: { LeftNavigation, TopNavigation },
};
</script>
