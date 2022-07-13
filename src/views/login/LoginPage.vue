<style scoped>
.LoginBoxStyle {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
<template><LoginBox></LoginBox></template>

<script>
import LoginBox from "@/components/LoginBox.vue";
export default {
  name: "LoginPage",
  data: () => ({
    //
  }),
  components: { LoginBox },
};
</script>
