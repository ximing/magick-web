<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import MenuMain from './modules/menu/Main.vue';
import ToolbarMain from './modules/toolbar/Main.vue';
import StageMain from './modules/stage/Main.vue';
import ToolPanelMain from './modules/toolPanel/Main.vue';

</script>

<template>
  <n-config-provider :theme="darkTheme">
    <div class="mg-container">
      <MenuMain />
      <div class="mg-content">
        <ToolbarMain />
        <StageMain />
        <ToolPanelMain />
      </div>
    </div>
  </n-config-provider>
</template>

<style scoped>
.mg-container{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
}
.mg-content{
flex: 1;
}
</style>
