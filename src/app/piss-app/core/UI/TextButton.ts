import * as PIXI from 'pixi.js';
import { GlowFilter } from '@pixi/filter-glow';

import { Text } from './Text';
import { Icon } from './Icon';

interface TextButtonStyle {
    fontName?: string;
    fontSize?: number;
    align?: string;
    tint?: number;
    letterSpacing?: number;
    maxWidth?: number;
}

export class TextButton extends PIXI.Container{

    text: string;
    bitmapText: Text;
    style: TextButtonStyle;
    filter: GlowFilter;
    enabled: boolean;
    unsubscribe: any;

    constructor(text: string, style: TextButtonStyle);
    constructor(text: Text, icon: PIXI.Sprite|Icon);
    constructor(text: any, style?: any, icon?: any){
        super();

        this.interactive = true;
        this.buttonMode = true;

        let bitmapText: Text;

        console.log(text)

        if (typeof text === 'string'){
            this.text = text
            this.style = style;
            bitmapText = new Text(this.text, this.style);
        }
        else {
            this.text = text.text;
            bitmapText = text;
        }

        if (icon instanceof PIXI.Sprite){
            this.addChild(icon);
        }

        // this.text = text;
        // this.style = style;

        this.filter = new GlowFilter({outerStrength: 2});
        this.filter.enabled = false;

        this.bitmapText = bitmapText;
        this.filters = [this.filter];    
        this.addChild(this.bitmapText);

        this.on('pointerover', () => {
            this.filter.enabled = true;

        });
        this.on('pointerout', () => {
            this.filter.enabled = false;
        });
    }
}