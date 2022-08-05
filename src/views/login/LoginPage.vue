<style scoped lang='less'>
</style>
<template>
  <editor :height="300" :width="600" :initialValue="initialValue" @updateValue='changeContentValue' />
  <LoginBox></LoginBox>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import LoginBox from '@/components/LoginBox.vue';
import tinyEditor from '@/components/TinyEditor.vue';

export default defineComponent({
  name: 'LoginPage',
  components: { LoginBox, editor: tinyEditor },
  props: {
    //
  },
  setup(props) {
    const initialValue = ref('init');
    const changeContentValue = (value) => {
      console.log(value);
    };
    return {
      initialValue,
      changeContentValue,
      print,
      //
    };
  },
});
</script>
