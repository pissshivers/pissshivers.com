import * as PIXI from 'pixi.js';
import { ease } from 'pixi-ease';

import PissApp from '../..';
import { ResourceMap } from '../../core';
import { probability } from '../../common/utils';
import { MouseShake } from '../../common/mouse-shake';

export class Flashlight extends PIXI.Sprite {

    size: number;
    cookie: PIXI.Sprite;
    deathDecay: number;
    lightsDying: boolean;
    killLights: boolean;
    mouseShake: MouseShake;
    numShakes: number;
    maxShakes: number;


    constructor(piss: PissApp, res: ResourceMap, opts: any = {radius: 300, blurSize: 64}){
        // Prepair generated flashlight texture
        let {blurSize, radius} = opts;
        const flashLight = new PIXI.Graphics()
                .beginFill(0xFFFFFF)
                .drawCircle(radius + blurSize, radius + blurSize, radius)
                .endFill();
        flashLight.filters = [new PIXI.filters.BlurFilter(blurSize)];
        
        const size = (radius + blurSize) * 2;
        const bounds = new PIXI.Rectangle(0, 0, size, size);
        const flashListTexture = piss.renderer.generateTexture(flashLight, PIXI.SCALE_MODES.NEAREST, 1, bounds);

        // Call super construtor and initialize sprite with texture
        super(flashListTexture);

        // Set size for cookie and haze sprites
        this.size = size;

        this.on('added', () => {
            this.mouseShake = new MouseShake(this.parent);
            this.maxShakes = Math.floor((Math.random() * 4) + 2);
        })

        //self initialize with cookie texture passed
        this.init(res.lightcookie.texture);
    }

    init(cookieTexture: PIXI.Texture){
        
        this.setDefaults();

        this.cookie = new PIXI.Sprite(cookieTexture);
        this.cookie.width = this.size;
        this.cookie.height = this.size;
    
        const haze = new PIXI.Sprite(this.texture);
        haze.mask = this.cookie;
        haze.filters = [new PIXI.filters.AlphaFilter(0.1)]
        haze.addChild(this.cookie);

        
        
        PIXI.Ticker.shared.add(this.tick, this);
        
        
    }

    setDefaults(){
        this.numShakes = 0;
        this.deathDecay = 0;
        this.lightsDying = false;
        this.killLights = false;
    }

    startFlicker(){
        this.lightsDying = true;
        this.mouseShake.enable();
        this.parent.on('mouseshake', this.onMouseShake, this);
    }

    stopFlicker(){
        this.lightsDying = false;
        this.mouseShake.disable();
        this.parent.off('mouseshake', this.onMouseShake, this);
    }

    onMouseShake(){
        if (this.lightsDying){

            if (this.numShakes === 0){
                this.killLights = true;
            }

            this.numShakes++;
            if (this.numShakes >= this.maxShakes){
                
                ease.add(this, {alpha: 1}, { duration: 100, repeat: Math.floor(Math.random() * 2)}).on('complete', () => {
                    this.setDefaults();
                    this.emit('flashlightfixed');
                });
                
            }
        }
    }

    tick(delta: number){       
        if (this.lightsDying){
            this.deathDecay += 1;
            
            if (this.killLights){
                this.alpha = 0;
            }
            if (this.deathDecay > 40){
                this.deathDecay = 0;
                if(this.alpha == 1 && probability(0.65)){
                    ease.add(this, {alpha: Math.random()}, { duration: 100, repeat: Math.floor(Math.random() * 3)})
                }
                else if (!this.killLights && probability(0.85)){
                    ease.add(this, {alpha: 1}, { duration: 100});
                }            
            }
        }
    }

    destroy(){
        super.destroy();
        PIXI.Ticker.shared.remove(this.tick, this);
    }

}