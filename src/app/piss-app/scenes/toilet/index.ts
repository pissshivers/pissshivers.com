import * as PIXI from 'pixi.js';

import { Scene, ResourceMap } from '../../core'
import { SpriteBG } from '../../common';
import { PeeStream } from './pee-stream';
import PissApp from '../..';
import { getPissState, store } from '../../../store';
import { drainPiss } from '../../../store/piss-o-meter/actions';

export class Toilet extends Scene {

    bg: SpriteBG;
    toilet: PIXI.Sprite;
    peeStream: PeeStream;
    texture: PIXI.Texture;
    unsubscribe: any;

    constructor(piss: PissApp){
        super(piss);

        this.interactive = true;

        this.unsubscribe = store.subscribe(() => {
            let curr = getPissState(store.getState().pissOMeter);
            this.handleState(curr);
        });
        
    }

    init(res: ResourceMap){
        return new Promise((resolve) => {
            this.bg = new SpriteBG(res.toilet.texture, this.piss.width, this.piss.height);

            this.texture = res.toilet.texture;

            this.toilet = new PIXI.Sprite(this.texture);
            this.toilet.anchor.set(0.5);

            this.addChild(this.bg);
            this.addChild(this.toilet);

            this.peeStream = new PeeStream(this);
            this.peeStream.init(res);
            this.resize();

            let curr = getPissState(store.getState().pissOMeter);
            this.handleState(curr);

            resolve();
        })
    }

    handleState(state: any){
        if (state.level != state.min){
            this.on('pointerdown', () => {
                this.onClick()
            })
        }
        else {
            this.removeListener('pointerdown')
        }
    }
    
    onClick(){
        this.peeStream.start();
        store.dispatch(drainPiss());
    }

    resize(){
        const w = this.piss.width;
        const h = this.piss.height;

        this.toilet.scale.set(h/this.texture.height);
        this.toilet.position.set(w * 0.7, h/2);

        this.peeStream.container.scale.set(h/this.texture.height)
        this.peeStream.container.x = w * 0.7;
        this.peeStream.container.y = h;


        this.bg.resize(w, h);
    }

    destroy(){
        super.destroy();
        this.peeStream.destroy();
        this.unsubscribe();
    }

}