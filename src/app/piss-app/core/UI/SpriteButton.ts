import * as PIXI from 'pixi.js';
import { SheetSprite } from './SheetSprite';

export interface ISpriteButtonOptions {
    texture: PIXI.Texture,
    text: String
}

export class SpriteButton extends SheetSprite{
    
    constructor(name: string, sheet: PIXI.Spritesheet){
        super(name, sheet);
        
        this.interactive = true;
        this.buttonMode = true;

        const hoverName = name.replace(/\./, '-hover.')

        if (hoverName in sheet.textures){
            const ox = this.x;
            const oy = this.y;
            const hoverData = sheet.data.frames[hoverName];
            const hoverTexture = sheet.textures[hoverName];
            const hx = (hoverData.spriteSourceSize.w/2) + hoverData.spriteSourceSize.x;
            const hy = (hoverData.spriteSourceSize.h/2) + hoverData.spriteSourceSize.y;

            let pointerOver = (...args: any):any => {
                this.x = hx;
                this.y = hy; 
                this.texture = hoverTexture;
                this.on('pointerout', pointerOut)
            }

            let pointerOut = (...args: any):any => {
                this.x = ox;
                this.y = oy;
                this.texture = sheet.textures[name];
                this.removeListener('pointerout', pointerOut)
            }

            this.on('pointerover', pointerOver)
        }

    }

    enable(){
        this.interactive = true;
        this.visible = true;
    }

    disable(){
        this.interactive = false;
        this.visible = false;
    }

}