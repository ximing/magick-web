import Konva from 'konva';
import { markRaw, reactive } from 'vue';
import { LayerManager } from '../managers/layerManager.ts';

export class MGLayer {
  name: string;
  index: number;
  layer: Konva.Layer;
  layerManager: LayerManager;

  constructor(layerManager: LayerManager) {
    // 使用markRaw来防止layer变成响应式
    this.layer = markRaw(new Konva.Layer());
    this.layerManager = markRaw(layerManager);
    this.name = '';
    this.index = -1;
    reactive(this);
    layerManager.stage.add(this.layer);
  }

  addImage(img: HTMLImageElement) {
    const konvaImage = new Konva.Image({
      image: img,
    });
    this.layer.add(konvaImage);
    const { width, height } = this.layerManager;
    // 确保图片在 Layer 中居中展示
    const offsetX = (konvaImage.width() - width) / 2;
    const offsetY = (konvaImage.height() - height) / 2;

    // 如果图片尺寸大于舞台尺寸，调整图片位置以居中
    konvaImage.x(offsetX > 0 ? -offsetX : (width - konvaImage.width()) / 2);
    konvaImage.y(offsetY > 0 ? -offsetY : (height - konvaImage.height()) / 2);

    this.adaptive();
    const index = this.layerManager.layerList.push(this);
    this.index = index;
    if (!this.name) {
      this.name = `图层${index}`;
    }
  }

  adaptive() {
    const { width, height } = this.layerManager;

    // 图片尺寸和舞台尺寸比较
    // let scaleX = width / konvaImage.width();
    // let scaleY = height / konvaImage.height();
    // if (konvaImage.width() > width || konvaImage.height() > height) {
    //   // 缩放以适应舞台
    //   let scale = Math.min(scaleX, scaleY);
    //   this.group.scaleX(scale);
    //   this.group.scaleY(scale);
    // }
    //
    // 更新组的位置以居中图片
    // this.group.x((width - konvaImage.width() * this.group.scaleX()) / 2);
    // this.group.y((height - konvaImage.height() * this.group.scaleY()) / 2);
  }

  toJSON() {}

  fromJSON() {}
}
