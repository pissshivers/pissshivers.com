import * as PIXI from 'pixi.js';

import { DisplayLayer } from '../core';
import  PissApp  from '../index';

export class VideoBG extends DisplayLayer {

    video: HTMLVideoElement;
    texture: any;
    sprite: PIXI.Sprite;
    focus: PIXI.Bounds;

    constructor(piss: PissApp, src: any){
        super(piss);
        
        // create texture element for the sprite
        this.texture = PIXI.Texture.from(src.url);
        this.texture.baseTexture.resource.source.crossOrigin = 'anonymous'
        this.texture.baseTexture.resource.source.preload = 'auto';
        this.texture.baseTexture.resource.source.muted = true;
        this.texture.baseTexture.resource.source.loop = true;
        
        this.video = this.texture.baseTexture.resource.source;


        this.sprite = new PIXI.Sprite(this.texture);
        // this.sprite.anchor.set(1312, 1080);
        // this.sprite.x = 1312;
        // this.sprite.y = 1080;
        // this.videoScale();  
    }

    load(){
        return new Promise((resolve) => {
            const canplay = () => {
                if (this.video.canPlayType('video/mp4;codecs="avc1.640028"') === "probably"){
                    this.resize();
                    this.addChild(this.sprite);
                    resolve();
                    this.video.removeEventListener('canplay', canplay);
                }
                
            };
            this.video.addEventListener('canplay', canplay);
        })
    }

    resize(){
        const cWidth = this.piss.width;
        const cHeight = this.piss.height;
        const vWidth = this.video.videoWidth;
        const vHeight = this.video.videoHeight;

        const cvw = cWidth / vWidth;
        const cvh = cHeight / vHeight;
        let scale = cvh; //Math.min(cWidth / vWidth, cHeight / vHeight);
        this.scale.set(scale);
        
        if ((1312 * scale) > cWidth && cvw < cvh){
            this.x = cWidth - 1312 * scale;
        }
        else {
            this.x = 0;
        }
        
    }

    videoScale(){
        const containerWidth = this.piss.width;
        const containerHeight = this.piss.height;

        let x = 0;
        let y = 0;
        let scale = 1

        let cRatio = (containerWidth / containerHeight).toFixed(2);
        //let sRatio = (this.video.videoWidth / this.video.videoHeight).toFixed(2);

        // Portrait mode
        if (parseFloat(cRatio) < 1.45){
            scale = containerHeight/this.video.videoHeight;
            let vw = this.video.videoWidth * scale;
            x =  (containerWidth - (containerWidth * .45)) - (vw * .45);
        }
        else {
            let vw = this.video.videoWidth * scale
            y = containerHeight - this.video.videoHeight;
            if (containerWidth < vw){
                x =  (containerWidth - (containerWidth * .45)) - (vw * .45);
            }

        }

        this.scale.set(scale);
        this.position.set(x,y);
        // console.log({
        //     x: x, 
        //     y: y,
        //     scale: scale,
        //     cRation: parseFloat(cRatio),
        //     width:containerWidth,
        //     height: containerHeight,
        //     vidWidth: this.video.videoWidth,
        //     vidHeight: this.video.videoHeight
        // })
    }

}