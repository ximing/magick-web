<script setup lang="ts">
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5';
import { NUploadDragger, NUpload, NIcon, NText, NP } from 'naive-ui';
import { SettledFileInfo } from 'naive-ui/es/upload/src/interface';

function fileChange(options: {
  file: SettledFileInfo;
  fileList: SettledFileInfo[];
  event: ProgressEvent | Event | undefined;
}) {
  console.error(options);
}
</script>

<template>
  <div class="mg-uploader">
    <n-upload :default-upload="false" @change="fileChange" :show-file-list="false">
      <n-upload-dragger :default-upload="false">
        <div style="margin-bottom: 12px">
          <n-icon :size="48" :depth="3">
            <archive-icon />
          </n-icon>
        </div>
        <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </n-text>
        <n-p depth="3" style="margin: 8px 0 0 0">
          请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
        </n-p>
      </n-upload-dragger>
    </n-upload>
  </div>
</template>

<style scoped>
.mg-uploader {
}
</style>
