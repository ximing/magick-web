import { FileManager } from './managers/fileManager.ts';
import { EventEmitter } from 'eventemitter3';
import { LayerManager } from './managers/layerManager.ts';

export class MagickCore {
  container!: HTMLDivElement;

  eventManager!: EventEmitter;
  fileManager!: FileManager;
  layerManager!: LayerManager;
  constructor() {
    this.initManager();
  }

  init(options: { container: HTMLDivElement; height: number; width: number }) {
    this.container = options.container;
    this.layerManager.init(options);
  }

  private initManager() {
    this.eventManager = new EventEmitter<string | symbol, any>();
    this.fileManager = new FileManager(this);
    this.layerManager = new LayerManager(this);
  }
}
