import * as PIXI from 'pixi.js';

import { DisplayLayer } from '../core';

export class SpriteBG extends PIXI.Sprite {

    texture: PIXI.Texture;
    
    constructor(texture: PIXI.Texture, width: number, height: number){
        super(texture);

        this.texture = texture;
        this.filters = [new PIXI.filters.BlurFilter()];
        this.anchor.set(0.5);
        this.resize(width, height);
    }

    resize(containerWidth: number, containerHeight: number) {
        let cRatio = containerWidth / containerHeight;
        let sRatio = this.texture.orig.width / this.texture.orig.height;

        let scale;
        let xScale;
        let yScale;
        let xAnchor = 0;

        if (cRatio > sRatio) { // portait
            scale = containerWidth / this.texture.orig.width;
            xScale = 1;
            xAnchor = scale > 1 ? (1/6) * scale : 0;
        }
        else { // landscape
            yScale = 1;
            scale = containerHeight / this.texture.orig.height;
            xAnchor = scale > 1 ? (1/6) * scale : 0;
        }

        this.scale.set(scale);
        this.position.set(containerWidth/2, containerHeight/2);
    }
}