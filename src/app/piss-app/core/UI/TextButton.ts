import * as PIXI from 'pixi.js';
import { GlowFilter } from '@pixi/filter-glow';

import { Text } from './Text';

interface TextButtonStyle {
    fontName: string;
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

    constructor(text: string, style?: TextButtonStyle){
        super();

        this.interactive = true;
        this.buttonMode = true;

        this.text = text;
        this.style = style;

        this.filter = new GlowFilter({outerStrength: 2});
        this.filter.enabled = false;

        this.bitmapText = new Text(this.text, this.style);
        this.bitmapText.filters = [this.filter];        
        this.addChild(this.bitmapText);

        this.on('pointerover', () => {
            this.filter.enabled = true;

        });
        this.on('pointerout', () => {
            this.filter.enabled = false;
        });
    }
}