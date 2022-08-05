<style scoped lang='less'>
</style>
<template>
  <LoginBox></LoginBox>
</template>

<script>
import { defineComponent, ref } from 'vue';
import LoginBox from '@/components/LoginBox.vue';

export default defineComponent({
  name: 'LoginPage',
  components: { LoginBox },
  props: {
    //
  },
  setup(props) {
    return {
      print,
      //
    };
  },
});
</script>
