import { MagickView } from './MagicView.ts';

export class ScalePlugin {
  private view: MagickView;

  constructor(view: MagickView) {
    this.view = view;
    this.view.dom.addEventListener('wheel', this.onWheel);
  }

  onWheel = (e: WheelEvent) => {
    // !e.ctrlKey ||
    if (!this.view.root) {
      return;
    }
    e.preventDefault();
    const stage = this.view.root;
    let oldScale = stage.scaleX();
    let pointer = stage.getPointerPosition()!;
    let mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let newScale = e.deltaY > 0 ? oldScale * 1.01 : oldScale * 0.99;

    stage.scale({ x: newScale, y: newScale });

    let newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  };

  destroy() {
    this.view.dom.removeEventListener('wheel', this.onWheel);
  }
}
