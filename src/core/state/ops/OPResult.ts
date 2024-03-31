export class OPResult {
  stage: any;

  failed!: string;

  constructor(arg: string | any) {
    if (typeof arg === 'string') {
      this.failed = arg;
    } else {
      this.stage = arg;
    }
  }

  static ok(stage: any) {
    return new OPResult(stage);
  }

  static fail(message: string) {
    return new OPResult(message);
  }
}
