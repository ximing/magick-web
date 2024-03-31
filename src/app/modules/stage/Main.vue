<script setup lang="ts">
import Editor from './Editor.vue';
import OpenFile from './OpenFile.vue';
import { magickEditor } from '../../magickEditor.ts';
</script>

<template>
  <div class="mg-stage">
    <OpenFile v-if="!magickEditor.viewState.isOpenFile" />
    <Editor v-else />
  </div>
</template>

<style scoped>
.mg-stage {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
</style>
