import * as PIXI from 'pixi.js';

import { Scene, ResourceMap } from '../../core';
import { VideoBG, Glitcher } from '../../common';

export class Backyard extends Scene {
    
    videoBG: VideoBG;
    glitcher: Glitcher;

    async init(res: ResourceMap) {
        return new Promise((resolve) => {
            this.videoBG = new VideoBG(this.piss, res.bg);

            this.videoBG.load().then(() => {
                this.glitcher = new Glitcher();
                this.glitcher.setMaxVals({
                    offset: 100,
                    red: new PIXI.Point(2,2),
                    green: new PIXI.Point(10, -4),
                    blue: new PIXI.Point(-10, 4)
                });

                this.addChild(this.videoBG);
                PIXI.Ticker.shared.add(this.tick, this)
                resolve();
            })
        })
    }

    tick(){
        if (this.videoBG.video.currentTime+2 >= this.videoBG.video.duration){
            this.glitcher.update();
            this.filters = [this.glitcher.filter];
        }
        else {
            this.filters = [];
        }
    }

    resize(){
        this.videoBG.resize();
    }

}