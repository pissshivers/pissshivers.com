import * as PIXI from 'pixi.js';
import { Text, TextButton } from '../../core/UI';

import { IconList, IconListOptions, IconListItem } from './icon-list';

type onClick = () => void;

export interface MenuItem extends IconListItem {
    onClick: onClick;
}

export class Menu extends IconList {
    
    constructor(list: MenuItem[], sheet: PIXI.Spritesheet, opts: IconListOptions = {outerPadding: 10, innerPadding: 30, iconSize: 50, iconPadding: 40, textStyle: {fontSize: 40}}){
        super(list, sheet, opts);
    }

    build(items: MenuItem[]){
        
        type listItems = Pick<IconListItem, "text" | "icon">;

        const list: listItems[] = items;
        this.load(list, PIXI.Sprite, Text, TextButton)
                .then(() => {
                    for (var i = 0, len = this.list.length; i < len; i++){
                        this.list[i].on('pointerdown', items[i].onClick);
                    }
                    this.addChild(...this.list);
                    console.log(this)
                });
    }

}