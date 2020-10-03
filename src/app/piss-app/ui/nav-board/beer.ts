import * as PIXI from 'pixi.js';

import { SpriteButton } from '../../core/UI';

export class Beer extends SpriteButton {

    parent: PIXI.Container;

    constructor(sheet: PIXI.Spritesheet){
        super('beer.png', sheet);
    }

}