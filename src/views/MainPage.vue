<template>
  <div>
    <TopNavigation style="margin-top: -60px"></TopNavigation>
    <LeftNavigation></LeftNavigation>
  </div>
</template>

<script>
import LeftNavigation from "@/components/LeftNavigation.vue";
import TopNavigation from "@/components/TopNavigation.vue";
export default {
  name: "MainPage",
  data: () => ({
    //
  }),
  components: { LeftNavigation, TopNavigation },
};
</script>
