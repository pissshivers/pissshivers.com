import * as PIXI from 'pixi.js';

import { SheetSprite } from '../../core/UI';

export class TapedBoard extends PIXI.Container {

    board: SheetSprite;
    tape: SheetSprite;

    constructor(sheet: PIXI.Spritesheet, boardName: string, tapeName: string){
        super();
        this.interactive = true;
        this.board = new SheetSprite(boardName, sheet);
        this.tape = new SheetSprite(tapeName, sheet);

        this.addChild(this.board);
        this.addChild(this.tape);
    }

}