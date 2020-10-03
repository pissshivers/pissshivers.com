import * as PIXI from 'pixi.js';

export class SheetSprite extends PIXI.Sprite {

    constructor(name: string, sheet: PIXI.Spritesheet){
        const texture = sheet.textures[name];
        const data = sheet.data.frames[name];

        super(texture);

        let cx = (data.spriteSourceSize.w/2);
        let cy = (data.spriteSourceSize.h/2);

        let x = cx + data.spriteSourceSize.x;
        let y = cy + data.spriteSourceSize.y;

        this.position.set(x, y);
        this.pivot.set(cx,cy);
    }

    tick?(time: number) {}

}