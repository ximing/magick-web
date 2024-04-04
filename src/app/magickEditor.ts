import { MagickState } from '../core/state';
import { MagickView } from '../core/view';
import { reactive } from 'vue';
import { Transform } from '../core/state/transform.ts';
import Konva from 'konva';
import { ImageMagick, initializeImageMagick } from '@imagemagick/magick-wasm';
import { nanoid } from 'nanoid';
import mime from 'mime';

export class MagickEditor {
  state!: MagickState;
  view!: MagickView;
  file!: File;
  activeLayerId!: string;

  viewState = reactive({
    isOpenFile: false,
  });

  openFile(file: File) {
    this.file = file;
    this.viewState.isOpenFile = true;
    const reader = new FileReader();
    reader.onload = (event) => {
      var image = new Image();
      image.onload = async () => {
        const { height, width } = this.state.root.props;
        // 计算缩放比例和偏移量
        let scale = 1;
        let offsetX = 0;
        let offsetY = 0;
        if (image.width > width * 0.85 || image.height > height * 0.85) {
          // 如果图片尺寸大于舞台尺寸的75%，缩放到舞台的75%
          scale = Math.min((width * 0.85) / image.width, (height * 0.85) / image.height);
          offsetX = (image.width * scale - width) / 2;
          offsetY = (image.height * scale - height) / 2;
        } else {
          // 如果图片尺寸小于舞台尺寸的75%，不缩放
          offsetX = (image.width - width) / 2;
          offsetY = (image.height - height) / 2;
        }
        this.view.dispatch(
          new Transform(this.view.state)
            .addShape(
              'Image',
              0,
              {
                image,
              },
              this.activeLayerId,
            )
            .changeAttrs(this.state.root.id, {
              scaleX: scale,
              scaleY: scale,
              x: -offsetX,
              y: -offsetY,
            }),
        );
      };
      image.src = event.target!.result as string;
    };
    reader.readAsDataURL(file);
  }

  exportCanvas() {
    let layers = this.view.root.getChildren();
    let newLayer = new Konva.Layer();
    layers.forEach((layer) => {
      layer.getChildren().forEach((child) => {
        newLayer.add(child.clone());
      });
    });
    // Draw the new layer
    newLayer.draw();
    return newLayer.toCanvas();
  }

  exportFile(type: string) {
    const canvas = this.exportCanvas();
    ImageMagick.readFromCanvas(canvas, (image) => {
      image.write(type as any, async (pngData) => {
        let blob = new Blob([pngData], { type: mime.getType(type) });
        let url = URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.href = url;
        link.download = `${nanoid()}.${mime.getExtension(mime.getType(type))}`;
        link.click();
        setTimeout(() => {
          link.remove();
        }, 2000);
      });
    });
  }

  initMagickWasm() {
    const wasmLocation = new URL('@imagemagick/magick-wasm/magick.wasm', import.meta.url);
    return initializeImageMagick(wasmLocation);
  }

  initView(dom: HTMLDivElement) {
    this.view = new MagickView(dom, {
      state: this.state,
    });
  }

  activeLayer() {
    return this.state.layers.find((layer) => layer.id === this.activeLayerId);
  }

  initState(stateJson: any | MagickState) {
    if (stateJson instanceof MagickState) {
      this.state = stateJson;
    } else {
      this.state = MagickState.fromJSON(stateJson);
    }
    this.activeLayerId = this.state.layers.get(0)?.id || '';
  }
}

export const magickEditor = new MagickEditor();
