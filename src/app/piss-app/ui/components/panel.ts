import * as PIXI from 'pixi.js';

import { SheetSprite } from '../../core/UI/SheetSprite';

export enum PanelSize {
    Small,
    Large
}

export class Panel extends PIXI.Sprite {

    constructor(size: PanelSize){
        const sheet = PIXI.Loader.shared.resources['piss-shivers-ui'].spritesheet;
        const texture = size == PanelSize.Small ? 'music-board.png' : 'nav-board.png';
        super(sheet.textures[texture]);
    }



}