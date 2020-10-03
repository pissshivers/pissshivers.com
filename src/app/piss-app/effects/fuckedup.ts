import * as PIXI from 'pixi.js';
import {KawaseBlurFilter} from '@pixi/filter-kawase-blur';
import {RadialBlurFilter} from '@pixi/filter-radial-blur';
// import * as Penner from 'penner';

import { Effect } from '../core/Effects';
import {store, getPissState} from '../../store';
import { EffectsManager } from '../core/Effects/EffectsManager';

interface RadialBlurOptions {
    angle: number;
}

interface KawaseBlurOptions {
    blur: number,
    quality: number,
    pixelSize: number[]
}

export class FuckedUp extends Effect {
    

    maxFuckedUp: number;
    howFuckedUp: number = 0;
    kawasBlur: KawaseBlurFilter;
    radialBlur: RadialBlurFilter;
    maxKawas: KawaseBlurOptions = {
        blur: 6.5,
        quality: 1,
        pixelSize: [0.5, 0]
    };
    maxRadial: RadialBlurOptions = {
        angle: 1
    };
    count: number = 0;
    count2: number = 0;

    constructor(container: PIXI.Container){
        super(container);

        store.subscribe(() => {
            const state = getPissState(store.getState().pissOMeter);
            this.howFuckedUp =  Math.max(1 - state.level/state.min, 0);

            if (!EffectsManager.isEnabled(FuckedUp) && this.howFuckedUp > 0){
                EffectsManager.enable(FuckedUp);
            }
            else if (this.howFuckedUp == 0) {
                EffectsManager.disable(FuckedUp);
            }
        })
    }

    init(){
        return new Promise((resolve) => {
            this.kawasBlur = new KawaseBlurFilter(0,0);
            this.kawasBlur.pixelSize = this.maxKawas.pixelSize;
            this.kawasBlur.quality = this.maxKawas.quality;
            this.kawasBlur.blendMode = PIXI.BLEND_MODES.MULTIPLY;
            
            this.radialBlur = new RadialBlurFilter(0, [this.container.width/2, this.container.height/2], 5, this.container.width * 1.5);
            // this.radialBlur.blendMode = PIXI.BLEND_MODES.SCREEN;

            this.filters = [this.radialBlur, this.kawasBlur];
            resolve();
        })
    }

    tick(time: number){
        let wasteFactor = this.howFuckedUp;
        let angle = this.oscillate(0, this.maxRadial.angle * wasteFactor, this.count);
        let blur = this.maxKawas.blur * wasteFactor;
        let blurOsc = this.oscillate(((blur/2) + blur)/2, blur, this.count2);
        this.radialBlur.angle = angle;
        this.kawasBlur.blur = blurOsc;
        this.count += 0.01;
        this.count2 += 0.03;
    }

    oscillate(mid: number, bound: number, inc: number){
        return Math.round((mid + Math.sin(inc) * bound) * 10) / 10;
    }

}