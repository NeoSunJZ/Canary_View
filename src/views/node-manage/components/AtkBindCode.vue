<style></style>
<template>
    <div ref="container" :style="{ maxHeight: heightlimit + 'px', minHeight: heightlimit + 'px' }"></div>
</template>
<script>
import * as monaco from 'monaco-editor';
import { onMounted, defineComponent, ref } from 'vue';
export default defineComponent({
    name: 'AtkBindSubMenu',
    props: {
        content: {
            type: String
        },
    },

    setup(props) {
        const container = ref();
        const heightlimit = ref();
        const countOccurrences = (str, search) => {
            const regex = new RegExp(search, 'g');
            const matches = str.match(regex);
            return matches ? matches.length : 0;
        };
        onMounted(() => {
            let lines = countOccurrences(props.content, "\n")
            heightlimit.value = lines * 16;
            if (lines < 10) {
                heightlimit.value = 120;
            }
            monaco.editor.create(container.value, {
                value: props.content,
                language: "python",
                theme: "vs-dark",
                automaticLayout: true,
            })
        })
        return { container, heightlimit };
    },
});
</script>