<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { magickEditor } from '../../magickEditor.ts';
import { MagickState } from '../../../core/state';
import { VNode } from '../../../core/state/VNode.ts';
import { Transform } from '../../../core/state/transform.ts';

const editor = ref();

onMounted(() => {
  if (editor.value) {
    const { height, width } = (editor.value as HTMLDivElement).getBoundingClientRect();
    let state = new MagickState(
      new VNode(
        'stage',
        {
          height,
          width,
        },
        [],
      ),
    );
    state = state.apply(new Transform(state).addLayer(0, {}, '图层1'));
    console.log('state', state);
    magickEditor.initState(state);
    magickEditor.initView(editor.value);
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        console.log(`新的尺寸：宽度=${width}, 高度=${height}`);
        // 这里可以执行更多的逻辑，比如根据新的尺寸调整布局
        // magickCore.layerManager.resize({ width, height });
      }
    });
    resizeObserver.observe(editor.value);
    // 清理
    onUnmounted(() => {
      resizeObserver.disconnect();
    });
  }
});
</script>

<template>
  <div class="mg-editor" ref="editor"></div>
</template>

<style scoped>
.mg-editor {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
