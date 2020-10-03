import * as PIXI from 'pixi.js';

import { Scene } from '../../core/Scene';
import PissApp from '../..';
import { ResourceMap } from '../../core';
import { Assets } from './assets';

export class Loading extends Scene {

    constructor(piss: PissApp){
        super(piss);
        this.assets = Assets

        this.on('added', () => {
            
        })
    }

    preload(){
        PIXI.Loader.shared.add(this.assets);
        PIXI.Loader.shared.load((l, r) => {
            this.init(r);
        })
    }

    init(res: ResourceMap){
        const sheet = res['schlong-dog-data'].spritesheet;
        const schlongDog = new PIXI.Sprite(sheet.textures['schlong-dog.png']);

        schlongDog.scale.set((this.piss.height * 0.6)/schlongDog.height);
        schlongDog.anchor.set(0.5);
        schlongDog.x = this.piss.width/2;
        schlongDog.y = this.piss.height/2;

        const pissAnim = new PIXI.AnimatedSprite(sheet.animations['schlong-dog-pissing']);
        pissAnim.x = -pissAnim.width/2.1;
        pissAnim.y = -pissAnim.height/1.64;
        pissAnim.animationSpeed = 0.1;
        pissAnim.play();

        const loading = new PIXI.BitmapText("Loading", {fontName: 'Permanent Marker', tint: 0xffffff});
        loading.anchor = 0.5;
        loading.position.set(this.piss.width/2, this.piss.height*.1);

        const bg = new PIXI.Graphics();
        bg.beginFill(0xffffff);
        bg.drawRect(0,0, this.piss.width, this.piss.height);
        bg.endFill();

        this.addChild(bg);
        this.addChild(loading);
        this.addChild(schlongDog);
        schlongDog.addChild(pissAnim);
    }

}