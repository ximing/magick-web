<script setup lang="ts">
import Editor from './Editor.vue';
import Welcome from './Welcome.vue';
import { useMagickCore } from '../../magickCore.ts';
const magickCore = useMagickCore();
const { isOpenFile } = magickCore.fileManager;
</script>

<template>
  <div class="mg-stage">
    <Welcome v-if="isOpenFile" />
    <Editor v-else />
  </div>
</template>

<style scoped>
.mg-stage {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
