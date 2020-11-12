import * as PIXI from 'pixi.js';

import { Text } from '../../core/UI';

export interface IconListItem {
    text: string;
    icon: string;
}

export interface IconListOptions {
    outerPadding?: number;
    innerPadding?: number;
    iconSize?: number;
    iconPadding?: number;
    textStyle?: object;
}


export class IconList extends PIXI.Container {

    list: PIXI.Container[] = [];
    sheet: PIXI.Spritesheet;
    outerPadding: number;
    innerPadding: number;
    iconSize: number;
    iconPadding: number;
    textStyle: object;

    constructor(list: IconListItem[], sheet: PIXI.Spritesheet, opts: IconListOptions = {outerPadding: 60, innerPadding: 50, iconSize: 90}){
        super();

        this.sheet = sheet;
        this.outerPadding = opts.outerPadding;
        this.innerPadding = opts.innerPadding;
        this.iconSize = opts.iconSize;
        this.iconPadding = opts.iconPadding ? opts.iconPadding : opts.iconSize;

        if ("textStyle" in opts){
            this.textStyle = opts.textStyle;
        }
        

        this.on('added', () => {
            if (!this.textStyle){
                this.textStyle = {maxWidth: this.parent.width - (this.iconSize + this.innerPadding), fontSize: 35}
            }
            this.emit('listReady', list);
        })

        this.on('listReady', (list: any) => {
            this.build(list)
        })

    }

    build(list: IconListItem[]){
        
        this.load(list)
                .then(() => {
                    this.addChild(...this.list);
                })
    }

    load(list: IconListItem[], spriteType: any = PIXI.Sprite, textType: any = Text, itemContainerType: any = PIXI.Container){
        return new Promise((resolved, rejected) => {
            const len = list.length;
            let i = 0;
            while(i < len) {
                let icon = this.buildIcon(spriteType, this.sheet.textures[list[i].icon]) as typeof spriteType;
                let iconScale = icon.width > icon.height ? this.iconSize/icon.width : this.iconSize/icon.height;
                icon.scale.set(iconScale);
                icon.anchor.set(0.5);
                icon.position.set(this.innerPadding);

                let text = this.buildText(textType, list[i].text, this.textStyle) as typeof textType;
                text.x = this.iconPadding + this.innerPadding;
                
                let item = this.buildItemContainer(itemContainerType, text, icon) as typeof itemContainerType;
                
                item.y = i < 1 ? 0 : this.list[i-1].y + this.list[i-1].height + this.innerPadding;
                item.addChild(icon, text);
                
                this.list.push(item);
                i++;

                if (i == list.length-1 || list.length === 1){
                    resolved();
                }
            }
        })
    }

    buildItemContainer<T>(m: new(...args: any[]) => T, ...args: any[]): T{
        return new m(...args);
    }

    buildIcon<T>(m: new (texture: PIXI.Texture) => T, texture: PIXI.Texture): T{
        return new m(texture);
    }

    buildText<T>(m: new (text: string, style: object) => T, text: string, style: object): T {
        return new m(text, style)
    }

}