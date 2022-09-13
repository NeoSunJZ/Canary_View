/*
 *TinyMCE的编辑器组件
 */
<style scoped lang='less'>
</style>
<template>
  <editor v-model="contentValue" :init="initOptions" />
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import Editor from '@tinymce/tinymce-vue';

export default defineComponent({
  name: 'tinyEditor',
  components: { editor: Editor },
  props: {
    initialValue: {
      type: String,
      default: '请编辑',
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
  emits: ['updateValue'],
  setup(props, context) {
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
      // 工具栏配置
      toolbar:
        'undo redo | styles | bold italic  | alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image |  preview media fullscreen | ' +
        'forecolor backcolor emoticons',
      // 可以自定义个性化菜单
      menu: {
        // favs: { title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons' },
      },
      // 菜单栏
      menubar: 'edit view insert format tools table',
      // menubar: 'favs file edit view insert format tools table help',

      // 去掉商标
      branding: false,
      // 默认风格
      skin: 'oxide',
      height: props.height,
      width: props.width,
    });
    return {
      initOptions,
      contentValue: computed({
        get: () => props.initialValue,
        set: (val) => {
          context.emit('updateValue', val);
        },
      }),
      //
    };
  },
});
</script>
