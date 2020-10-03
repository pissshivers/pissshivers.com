declare interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
  
  declare interface NodeModule {
    hot?: { accept: (path: string, callback: () => void) => void };
  }
  
  declare interface System {
    import<T = any>(module: string): Promise<T>
  }
  declare var System: System;
  
  // declare const process: any;
  // declare const require: any;

  declare module '*.glsl';
declare module '*.frag';
declare module '*.vert';

// declare module "pixistats" {
//   var GStats: GStats.PIXIHooks;
//   export = GStats;
// }

// fa

declare namespace GStats {
  export class BaseHooks {
      protected _drawCalls: number;
      protected _maxDeltaDrawCalls: number;
      protected glhook?: GLHook;
      protected texturehook?: TextureHook;
      constructor();
      attach(gl: any): void;
      readonly drawCalls: number;
      readonly maxDeltaDrawCalls: number;
      readonly deltaDrawCalls: number;
      readonly maxTextureCount: number;
      readonly texturesCount: number;
      reset(): void;
      release(): void;
  }
}
declare namespace GStats {
  class GLHook {
      drawPasses: number;
      isInit: boolean;
      private realGLDrawElements;
      private gl;
      constructor(_gl?: any);
      private fakeGLdrawElements(mode, count, type, offset);
      reset(): void;
      release(): void;
  }
}
declare namespace GStats {
  export class PhaserHooks extends BaseHooks {
      constructor(game: any);
  }
}
declare namespace GStats {
  class PIXIHooks extends BaseHooks {
      constructor(app: any);
  }
}
declare namespace GStats {
  class StatsJSAdapter {
      stats: any;
      dcPanel?: any;
      tcPanel?: any;
      hook: BaseHooks;
      constructor(_hook: BaseHooks, _stats?: any);
      update(): void;
      reset(): void;
  }
}
declare namespace GStats {
  class TextureHook {
      createdTextures: Array<any>;
      maxTexturesCount: number;
      isInit: boolean;
      private realGLCreateTexture;
      private realGLDeleteTexture;
      private gl;
      constructor(_gl?: any);
      readonly currentTextureCount: number;
      registerTexture(texture: any): void;
      private fakeGLCreateTexture();
      private fakeGLDeleteTexture(texture);
      reset(): void;
      release(): void;
  }
}