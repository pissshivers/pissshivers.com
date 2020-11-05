import * as PIXI from 'pixi.js';

import {SheetSprite} from '../../core/UI/SheetSprite';


export class Ghost extends SheetSprite{

    foundPoint: PIXI.IPointData;

    constructor(name: string, sheet: PIXI.Spritesheet){
        super(name, sheet);
        const data = sheet.data.frames[name];

        this.visible =  false;
        this.interactive = true;

        this.foundPoint = {
            x: data.spriteSourceSize.w/2 + data.spriteSourceSize.x,
            y: data.spriteSourceSize.w/3 + data.spriteSourceSize.y
        };
    }

    

}