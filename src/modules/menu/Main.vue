<script setup lang="ts">
import { NDropdown, NButton, NSpace } from 'naive-ui';
import logo from '../../assets/logo.png';
const fileOption = [
  {
    label: '新建',
    key: 'new',
  },
  {
    label: '打开',
    key: 'open',
  },
  {
    label: '从 URL 打开',
    key: 'openFromUrl',
  },
  {
    label: '保存为',
    key: 'saveAs',
  },
];

const handleSelect = () => {};
</script>

<template>
  <div class="mg-menu">
    <img class="mg-logo" :src="logo" alt="" />
    <n-dropdown trigger="hover" :options="fileOption" @select="handleSelect">
      <n-button quaternary size="small"> 文件 </n-button>
    </n-dropdown>
    <n-dropdown trigger="hover" :options="fileOption" @select="handleSelect">
      <n-button quaternary size="small"> 编辑 </n-button>
    </n-dropdown>
    <n-dropdown trigger="hover" :options="fileOption" @select="handleSelect">
      <n-button quaternary size="small"> 图像 </n-button>
    </n-dropdown>
    <n-dropdown trigger="hover" :options="fileOption" @select="handleSelect">
      <n-button quaternary size="small"> 窗口 </n-button>
    </n-dropdown>
    <n-dropdown trigger="hover" :options="fileOption" @select="handleSelect">
      <n-button quaternary size="small"> 更多 </n-button>
    </n-dropdown>
  </div>
</template>

<style scoped>
.mg-menu {
  padding: 0 14px;
  height: 30px;
  background-color: #474747;
  display: flex;
  align-items: center;
}
.mg-logo {
  width: 32px;
}
.mg-header {
  color: aliceblue;
  font-size: 20px;
}
</style>
