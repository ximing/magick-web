import { MagickState } from '../core/state';
import { MagickView } from '../core/view';
import { reactive } from 'vue';
import { Transform } from '../core/state/transform.ts';

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
        this.view.dispatch(
          new Transform(this.view.state).addShape(
            'Image',
            0,
            {
              image,
            },
            this.activeLayerId,
          ),
        );
      };
      image.src = event.target!.result as string;
    };
    reader.readAsDataURL(file);
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
