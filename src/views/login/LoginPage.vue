<style scoped lang='less'>
</style>
<template>
  <editor initial-value="<p>Initial editor content</p>" v-model="contentValue" :init="initOptions" @change="print" />
  <!-- <LoginBox></LoginBox> -->
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import LoginBox from '@/components/LoginBox.vue';
import Editor from '@tinymce/tinymce-vue';

export default defineComponent({
  name: 'LoginPage',
  components: { LoginBox, editor: Editor },
  props: {
    //
  },
  setup(props) {
    const initOptions = ref({
      language: 'zh-Hans',
      plugins: [
        'advlist',
        'autolink',
        'link',
        'image',
        'lists',
        'charmap',
        'preview',
        'anchor',
        'pagebreak',
        'searchreplace',
        'wordcount',
        'visualblocks',
        'visualchars',
        'code',
        'fullscreen',
        'insertdatetime',
        'media',
        'table',
        'emoticons',
        'template',
        'help',
      ],
      toolbar:
        'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
        'forecolor backcolor emoticons | help',
      menu: {
        favs: { title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons' },
      },
      menubar: 'favs file edit view insert format tools table help',
      width: '600px',
      height: '300px',
    });
    const contentValue = ref();
    const print = () => {
      console.log('hhh');
    };
    return {
      print,
      initOptions,
      contentValue,
      //
    };
  },
});
</script>
