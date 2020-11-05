import * as PIXI from 'pixi.js';
import PIXISound from 'pixi-sound';
import {AdvancedBloomFilter} from '@pixi/filter-advanced-bloom';
import { ease } from 'pixi-ease';

import { ResourceMap } from '../../core';
import { GetRandEnum } from '../../common/get-rand-enum';

import { GraveLayer } from './index';
import { Ghost } from './ghost';

enum GhostLayer {
    FOREGROUND,
    MIDGROUND
}

interface Sepulcher {
    layer: any, 
    ghost: any
}

export class Ghosts extends PIXI.Container{

    _sepulcher: Sepulcher[] = [];
    sepulcher: number[] = [];
    ready: boolean;
    ghost: any;
    ghostPrimeTexture: PIXI.Texture;
    layerIndexs: number[];
    foundPoint: PIXI.IPointData;
    ghostMask: any;
    twirlMap: PIXI.Sprite;
    poofDuration: number = 2000;

    init(res: ResourceMap, mask: any){
        return new Promise((resolved) => {
            
            this.registerGhosts(GhostLayer.FOREGROUND, res['foreground-ghosts'].spritesheet);
            this.registerGhosts(GhostLayer.MIDGROUND, res['midground-ghosts'].spritesheet);
            this.populateSepulcher();

            PIXISound.volume('spookyBye', 0.25);
            PIXISound.volume('scream', 0.25);
            
            this.ghostMask = mask;
            this.ghostPrimeTexture = res['ghostprime'].texture;
            this.twirlMap = new PIXI.Sprite(res.twirl_map.texture);

            this.update();
            this.ready = true;            
        })
    }

    populateSepulcher(){
        this.sepulcher = Array.from(this._sepulcher.keys());
    }

    boo(){
        this.ready = false;
        return this.poof();
    }

    primeBoo(){
        this.zIndex = GraveLayer.FOREGROUND_GHOST;
        this.ghost = new PIXI.Sprite(this.ghostPrimeTexture);
        this.ghost.anchor.set(0);
        this.ghost.position.set(0);
        this.show();
        this.addChild(this.ghost);
        PIXISound.play('scream');
        return this.boo();
    }

    poof(){
        if (!this.ghost){
            return;
        }
        const animateOptions = {
            duration: this.poofDuration
        }

        const blur = new PIXI.filters.BlurFilter(0);
        blur.padding = 100;

        const bloom = new AdvancedBloomFilter({
            threshold: 1.0,
            brightness: 1,
        });
        bloom.padding = 100;

        const tf = new PIXI.filters.DisplacementFilter(this.twirlMap, 0);
        tf.padding = 100;
        let filters = this.ghost.filters || [];
        this.ghost.filters = [...filters, tf, bloom, blur];
        this.twirlMap.position = this.ghost.position;
        this.addChild(this.twirlMap);
        
        const twirl = ease.add(this.twirlMap, { rotation: Math.PI }, animateOptions);
        var tScale = 0;
        var bScale = 0;
        var blurAmount = 0;
        twirl.on('each', () => {
            tScale += 0.0083;
            let scale = 1 - Math.sqrt(1 - Math.pow(tScale, 2))
            tf.scale.set(30 * (scale || 1));

            bScale += 0.001;
            bloom.threshold -= bScale;
            bloom.brightness += bScale;
            bloom.blur += bScale

            blurAmount += 0.05;
            blur.blur = blurAmount;
        });
        twirl.once('complete', () => {
            this.removeChild(this.twirlMap);
        }, this);

        PIXISound.play('spookyBye');
        return ease.add(this.ghost, { alpha: 0 }, animateOptions);
    }

    show(){
        this.ghost.visible = true;
    }

    hide(){
        this.ghost.visible = false;
    }

    isVisible(){
        return this.ghost.visible;
    }

    update(){
        if (this.sepulcher.length < 1){
            this.populateSepulcher();
        }
        if (this.ghost){
            this.removeChild(this.ghost);
            this.ghost = null;
        }
        const rand = this.getRandGhost();
        this.zIndex = rand.layer == 0 ? GraveLayer.FOREGROUND_GHOST : GraveLayer.MIDGROUND_GHOST;
        
        const ghost = new Ghost(rand.ghost.name, rand.ghost.sheet);
        
        this.ghost = ghost;
        this.ghost.mask = this.ghostMask;
        this.addChild(this.ghost);

        this.foundPoint = {...this.ghost.foundPoint};     
    }

    getRandGhost(){        
        const layer = GetRandEnum(GhostLayer);
        const ghostIndex = Math.floor(Math.random() * this.sepulcher.length) + 1;
        const randGhost = this.sepulcher.splice(ghostIndex-1, 1);

        return this.summon(this._sepulcher, randGhost[0]);
    }

    summon<T, K extends keyof T>(obj: T, key: K): T[K] {
        return {...obj[key]};
      }

    registerGhosts(layer: GhostLayer, sheet: PIXI.Spritesheet){
        for (let g in sheet.textures){
            const ghost = {
                name: g,
                sheet: sheet
            };        

            this._sepulcher.push({
                layer: layer,
                ghost: ghost
            })
        }
    }
}