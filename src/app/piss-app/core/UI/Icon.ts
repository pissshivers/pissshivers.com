import * as PIXI from 'pixi.js';
import { SheetSprite } from './SheetSprite';

interface IconState {
    [key: string]: SheetSprite;
}


export class Icon extends PIXI.Sprite {

    states: IconState = {};
    sheet: PIXI.Spritesheet;
    toggleList: string[] = [];
    isToggling: boolean;

    constructor(textureName: string, sheet: PIXI.Spritesheet){
        super(sheet.textures[textureName]);

        if (sheet){
            this.sheet = sheet;
        }

        PIXI.Ticker.shared.add(this.tick, this);
    }

    addState(name: string, textureName: string){
        const state = new SheetSprite(textureName, this.sheet);
        state.visible = false;
        
        state.x -= (this.width/2) - 10;
        state.y -= 7;
        
        this.states[name] = state;
        this.addChild(this.states[name]);
    }

    showState(name: string){
        this.states[name].visible = true;
    }

    hideState(name: string){
        this.states[name].visible = false;
    }

    startToggle(...stateNames: string[]){
        this.toggleList = this.toggleList.concat(stateNames);
        this.isToggling = true;
    }

    stopToggle(...stateNames: string[]){
        this.toggleList.filter((state) => {
            return !stateNames.includes(state);
        });

        if (this.toggleList.length < 1){
            this.isToggling = false;
        }
    }

    toggle(name: string){
        this.states[name].visible = !this.states[name].visible;
    }

    tick?(...args: any){
        if (this.isToggling){
            this.toggleList.map((state) => {
                this.toggle(state);
            })
        }
    }

    destroy(){
        super.destroy();
        PIXI.Ticker.shared.remove(this.tick, this);
    }

}