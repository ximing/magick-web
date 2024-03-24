import { BaseManager } from './baseManager.ts';
import { ref } from 'vue';

export class FileManager extends BaseManager {
  private file: File;

  isOpenFile = ref(true);

  open(file: File) {
    this.file = file;
    this.isOpenFile.value = true;
  }

  saveAs(type: string) {}
}
