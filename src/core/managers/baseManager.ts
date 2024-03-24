import { MagicCore } from '../index.ts';

export class BaseManager {
  private magicCore: MagicCore;

  constructor(magicCore: MagicCore) {
    this.magicCore = magicCore;
  }
}
