import * as PIXI from 'pixi.js';

import {store, getPissState} from '../../../store';
import { ResourceMap } from '../../core';
import { Scene } from '../../core/Scene'
import { Ghosts } from './ghosts';
import { drainPiss } from '../../../store/piss-o-meter/actions';
import { PissOMeterState } from '../../../store/piss-o-meter/reducers';
import { Flashlight } from './flashlight';
import PissApp from '../..';

export enum GraveLayer {
    BACKGROUND = 0,
    MIDGROUND_GHOST = 1,
    MIDGROUND = 2,
    FOREGROUND_GHOST = 3,
    FOREGROUND = 4
}

export class Graveyard extends Scene {

    bg: PIXI.Sprite;
    fg: PIXI.Sprite;
    mg: PIXI.Sprite;
    flashLight: Flashlight;
    ghosts: Ghosts;
    ghostsAround: boolean = false;
    found: boolean = false;
    focused: boolean = false;
    focusedFor: number = 0;
    focusThreshold: number = 60;
    pissState: PissOMeterState;
    unsubscribe: any;
    

    constructor(piss: PissApp){
        super(piss);
    }

    async init(res: ResourceMap){
        return new Promise((resolve) => {

            this.sortableChildren = true;
            this.interactive = true;
            
            this.on('mousemove', (e: any) => {
                this.onMouseMove(e);
            })
            
            // create flashlight
            this.flashLight = new Flashlight(this.piss, res, {radius: 300, blurSize: 64});
            this.flashLight.on('flashlightfixed', () => {
                this.getSpooked(true);
            })

            this.bg = new PIXI.Sprite(res.gybg.texture);
            this.bg.zIndex = GraveLayer.BACKGROUND;

            this.mg = new PIXI.Sprite(res.gymidground.texture);
            this.mg.zIndex = GraveLayer.MIDGROUND;
            this.mg.mask = this.flashLight;

            this.fg = new PIXI.Sprite(res.gyforeground.texture);
            this.fg.zIndex = GraveLayer.FOREGROUND;
            this.fg.mask = this.flashLight;

            this.addChild(this.bg);
            this.addChild(this.mg);
            this.addChild(this.fg);
            this.addChild(this.flashLight);       

            this.ghosts = new Ghosts();
            this.ghosts.init(res, this.flashLight)
            this.addChild(this.ghosts);

            PIXI.Ticker.shared.add(this.tick, this);

            this.pissState = getPissState(store.getState().pissOMeter);

            this.unsubscribe = store.subscribe(() => {
                let prev = this.pissState;
                let curr = getPissState(store.getState().pissOMeter);

                if (prev != curr){
                    if ((prev.fuckedUp && !curr.fuckedUp) || curr.min== (curr.level + curr.steps)){
                        this.flashLight.startFlicker();
                        this.ghosts.hide();
                        this.ghostsAround = false;
                    }
                    else if (curr.level < curr.min && !this.overlapsGhost()){
                        this.ghostsAround = true;
                        this.ghosts.show();
                    }
                    else if (curr.level == curr.min){
                        this.ghostsAround = false;
                    }
                    this.pissState = {...curr};
                }
            })

            this.resize();
            resolve();
        })
    }

    tick(delta: number){
        if (this.focused){
            this.focusedFor++;

            if (this.focusedFor >= this.focusThreshold){
                this.getSpooked();
                this.focused = false;
            }
        }
        else if (this.focusedFor > 0){
            this.focusedFor = 0;
        }
    }

    resize(){
        const w = this.piss.width;
        const h = this.piss.height;
        const bgw = this.bg.texture.orig.width;
        const bgh = this.bg.texture.orig.height;
        const ratio = w/h;
        const bgRatio = bgw/bgh;

        let scale = 1;
        if (ratio > bgRatio){
            scale = w/bgw;
        }
        else {
            scale = h/bgh;
        }
        this.scale.set(scale);
    }

    onMouseMove(event: any){
        
        const pos = event.data.getLocalPosition(this);
        const x = pos.x;
        const y = pos.y;

        this.flashLight.position.x = x - this.flashLight.width/2;
        this.flashLight.position.y = y - this.flashLight.height/2;
        
        if (this.ghostsAround && this.ghosts.ready){
            if (this.ghosts.isVisible()){
                this.focused = this.foundGhost();
            }
            else if (!this.overlapsGhost()){
                this.ghosts.show();
            }
        }
        
    }

    getSpooked(primeBoo: boolean = false){   

        const pissState = this.pissState;
        if (pissState.level < pissState.min){
            pissState.level = primeBoo ? pissState.min : pissState.level + pissState.steps;
            
            const boo = primeBoo ? this.ghosts.primeBoo() : this.ghosts.boo();
            boo.on('complete', () => {
                this.ghosts.update();
                this.ghosts.ready = true;
                store.dispatch(drainPiss(pissState));
            })
        }
    }

    foundGhost(): boolean{
        this.found = this.flashLight.containsPoint(this.toGlobal(this.ghosts.foundPoint));
        return this.found;
    }

    overlapsGhost(): boolean{
        if (this.ghosts.ghost){
            let ghost = this.ghosts.ghost.getBounds();
            let light = this.flashLight.getBounds();        

            let l1 = {
                x: light.x,
                y: light.y
            }
            let r1 = {
                x: light.x + light.width,
                y: light.y + light.height
            }
            let l2 = {
                x: ghost.x,
                y: ghost.y
            }
            let r2 = {
                x: ghost.x + ghost.width,
                y: ghost.y + ghost.height
            }

            if (l1.x >= r2.x || l2.x >= r1.x){
                return false;
            }
            if (l1.y >= r2.y || l2.y >= r1.y){
                return false;
            }

            return true;
        }
        return false;
    }

    destroy(){
        super.destroy();
        this.unsubscribe();
    }

}