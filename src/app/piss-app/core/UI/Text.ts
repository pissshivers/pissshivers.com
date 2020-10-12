import * as PIXI from 'pixi.js';

export class Text extends PIXI.BitmapText {

    constructor(text: string, style?: any){
        let defaultStyle = {fontName: 'Permanent Marker', fontSize: 40};
        
        if (style){
            style = Object.assign(defaultStyle, style);
        }
        else {
            style = defaultStyle;
        }

        super(text, style);
    }

}