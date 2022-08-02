<style scoped lang='less'>
</style>
<template>

  <LoginBox></LoginBox>
</template>

<script>
import LoginBox from '@/components/LoginBox.vue';
import TEditor from '@/components/TinyEditor.vue';
import { ref } from 'vue';

export default {
  name: 'LoginPage',
  components: { LoginBox, TEditor },
  setup() {
    return {
      //
    };
  },
};
</script>
