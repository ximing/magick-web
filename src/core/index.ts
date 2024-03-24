import Konva from 'konva';
import { FileManager } from './managers/fileManager.ts';
import { EventEmitter } from 'eventemitter3';

export class MagicCore {
  container!: HTMLDivElement;

  stage!: Konva.Stage;

  fileManager!: FileManager;

  eventManager!: EventEmitter;

  constructor() {
    this.initManager();
  }

  init(options: { container: HTMLDivElement }) {
    this.container = options.container;
    this.stage = new Konva.Stage({
      container: this.container,
    });
  }

  private initManager() {
    this.eventManager = new EventEmitter<string | symbol, any>();
    this.fileManager = new FileManager(this);
  }
}
