import { IsOptional } from "class-validator";

export function makeOptional<T>(cls: new () => T): new () => Partial<T> {
  return class extends (cls as any) {
    constructor() {
      super();
      Object.keys(cls.prototype).forEach((key) => {
        IsOptional()(this, key);
      });
    }
  } as any;
}
