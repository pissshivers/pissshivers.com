import * as PIXI from 'pixi.js';

import { SpriteButton } from '../../core/UI';
import { store } from '../../../store';
import { poundBeer } from '../../../store/piss-o-meter/actions';

export class Beer extends SpriteButton {

    parent: PIXI.Container;
    unsubscribe: any;
    fuckedUp: boolean;

    constructor(sheet: PIXI.Spritesheet){
        super('beer.png', sheet);

        this.on('pointerdown', this.onClick);

        this.unsubscribe = store.subscribe(() => {
            let state = store.getState().pissOMeter;
            if (state.fuckedUp != this.fuckedUp){
                this.fuckedUp = state.fuckedUp;
                if (state.fuckedUp){
                    this.off('pointerdown', this.onClick);
                }
                else {
                    this.on('pointerdown', this.onClick);
                }
            }
            
        })
    }
    
    onClick(){
        console.log('clicked   ')
        store.dispatch(poundBeer());
    }

}