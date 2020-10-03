import * as PIXI from 'pixi.js';

import PissApp from '../..';
import { Effect } from './Effect';
import { PissClassFactory } from '../../common/piss-class-factory';

function EffectsFactory<T>(effect: { new(continer?: PissApp): T }, container?: PissApp): T {
    return new effect(container);
}

export class EffectsManager {

    static instance: EffectsManager;
    effects: any[] = [];
    app: PissApp;
    stage: PIXI.Container;

    constructor(app: PissApp){
        if (EffectsManager.instance){
            throw new Error('Only one instance of EffectManager can exists');
        }
        this.app = app;
    }

    static init(app: PissApp){
        EffectsManager.instance = new EffectsManager(app);
    }

    static load(...effects: any[]){
        return new Promise((resolve) => {
            const instance = EffectsManager.instance;
            effects.forEach((e: any, i: number) => {
                
                const effect = PissClassFactory(e, instance.app) as Effect;
            
                instance.effects.push(effect);

                if (i == effects.length-1){
                    resolve();
                }
            })
        })
    }

    static isEnabled(type: any){
        const eff = EffectsManager.instance.effects.find(effect => effect instanceof type)
       return eff.enabled || false;
    }

    static enable(type: any, stage?: PIXI.Container | PissApp): void{
        const effect = EffectsManager.instance.effects.find(effect => effect instanceof type);
        if (effect){
            effect.init(PIXI.Loader.shared.resources).then(() => {
                effect.enable();
            })
        }
    }

    static disable(type: any, stage?: PIXI.Container | PissApp){
        const effect = EffectsManager.instance.effects.find(effect => effect instanceof type);
        if (effect){
            effect.disable();
        }
    }  


}