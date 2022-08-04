<style scoped lang='less'>
</style>
<template>
  <editor initial-value="<p>Initial editor content</p>" v-model="contentValue" :init="initOptions" @change="print()" />

</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import Editor from '@tinymce/tinymce-vue';

export default defineComponent({
  name: 'tiny-editor',
  components: { editor: Editor },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '500px',
    },
    width: {
      type: String,
      default: '600px',
    },
  },
  emits: [],
  setup(props, context) {
    const print = () => {
      console.log('hhh');
    };
    const initOptions = ref({
      language: 'zh-Hans',
      plugins: 'lists link image table code help wordcount',
      height: props.height,
      width: props.width,
    });
    // const contentValue = ref();
    return {
      print,
      initOptions,
      contentValue: computed({
        get: () => props.modelValue,
        set: (val) => {
          context.emit('update:modelValue', val);
        },
      }),
      //
    };
  },
});
</script>
