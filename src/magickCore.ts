import { inject } from 'vue';
import { MagicCore } from './core';

export const MAGICK_CORE = Symbol('magicCore');
export function useMagickCore() {
  return inject<MagicCore>(MAGICK_CORE)!;
}
