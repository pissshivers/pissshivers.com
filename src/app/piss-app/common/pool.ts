import * as PIXI from 'pixi.js';
import { ease } from 'pixi-ease';

import { Effect } from '../core/Effects'

export enum PoolUpdate {
    FILL = 1, 
    DRAIN = 1
};

export class Pool extends Effect{

    pool: PIXI.Graphics;
    wrapper: PIXI.Graphics;
    color: number = 0xceb72e;
    maxFill: number;
    minFill: number;
    level: number;
    stepFactor: number;

    constructor(container: PIXI.Container, stepFactor: number = 1){
        super(container);

        this.level = container.height;
        this.maxFill = 0;
        this.minFill = this.level;
        this.stepFactor = container.height/stepFactor;
    }

    init(...args: any[]){
        const width = this.container.width;
        const height = this.container.height;

        const mask = new PIXI.Graphics();
        mask.beginFill(0xfff);
        mask.drawRect(0,0,width,height);
        mask.endFill();

        this.pool = new PIXI.Graphics();
        this.pool.y = this.level;
        this.pool.beginFill(this.color, 0.6);
        this.pool.drawRect(0,0, width, height);
        this.pool.endFill();

        this.wrapper = new PIXI.Graphics();

        // this.wrapper.position = this.pool.position;
        // this.wrapper.filterArea = new PIXI.Rectangle(0, this.maxFill, width, height);
        this.wrapper.mask = mask;

        this.wrapper.addChild(mask)
        this.wrapper.addChild(this.pool);
        this.container.addChild(this.wrapper);
    }

    fill(update?: PoolUpdate, options: object = {}){
        let level = this.level;
        
        if(level > this.maxFill){
            if (update && update === PoolUpdate.FILL){
                level = this.maxFill;
            }
            else {
                level -= this.stepFactor;
            }

            this.level = level;
            return ease.add(this.pool, { y: level }, { ...options, ease: 'easeOutCirc' });
        }
    }

    drain(update?: PoolUpdate, options: object = {}){
        let level = this.level;
        if (level < this.minFill){
            if (update && update === PoolUpdate.DRAIN){
                level = this.minFill;
            }
            else {
                level += this.stepFactor;
            }
            this.level = level;
            return ease.add(this.pool, { y: level }, {...options, ease: 'easeInCirc' });
        }
    }

}