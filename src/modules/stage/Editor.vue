<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMagickCore } from '../../magickCore.ts';

const editor = ref();
const magickCore = useMagickCore();

onMounted(() => {
  magickCore.init({
    container: editor.value,
  });
});
</script>

<template>
  <div class="mg-editor" ref="editor"></div>
</template>

<style scoped>
.mg-editor {
}
</style>
