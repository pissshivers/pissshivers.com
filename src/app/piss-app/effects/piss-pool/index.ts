import * as PIXI from 'pixi.js';

import {AdjustmentFilter} from '@pixi/filter-adjustment';
import {store, getPissState} from '../../../store';
import { Pool, PoolUpdate } from '../../common/pool';
import { ResourceMap } from '../../core';
import { BackdropDisplacementFilter } from '../../common/filters/backdrop-displacement-filter';
import { EffectsManager } from '../../core/Effects/EffectsManager';
import { PissOMeterState } from '../../../store/piss-o-meter/reducers';

export class PissPool extends Pool{

    pool: PIXI.Graphics;
    piss: PIXI.Graphics;
    dispWrapper: PIXI.Graphics;
    color: number = 0xceb72e;
    maxFill: number;
    level: number;
    stepFactor: number;
    filters: PIXI.Filter[];
    dispSprite: PIXI.TilingSprite;
    dispMap: PIXI.Texture;
    count: number = 0;
    state: PissOMeterState

    constructor(container?: PIXI.Container, stepFactor: number = 1){
        super(container);
        
        store.subscribe(() => {
            let curr = getPissState(store.getState().pissOMeter);
            if (!EffectsManager.isEnabled(PissPool)){
                if (curr.fuckedUp){
                    EffectsManager.enable(PissPool);
                    this.fill(PoolUpdate.FILL, {duration: curr.drainDurration});
                }
            }
            else if (!curr.fuckedUp){
                const drain = this.drain(PoolUpdate.DRAIN, {duration: curr.drainDurration});
                if (drain){
                    drain.once('complete', () => {
                        EffectsManager.disable(PissPool)
                    })
                }
            }
                
            
        })
    }

    init(res: ResourceMap){
        return new Promise((resolve) => {
            let width = this.container.width;
            let height = this.container.height; 

            this.dispMap = res.displacement_map.texture

            this.stepFactor = height/this.stepFactor;
            this.level = height;
            this.maxFill = height * .2;

            this.filters = [new PIXI.filters.AlphaFilter()];

            this.pool = new PIXI.Graphics();
            this.pool.y = this.level;
            this.pool.drawRect(0,0, width, height);

            this.piss = new PIXI.Graphics();
            this.piss.beginFill(this.color);
            this.piss.drawRect(0,0, width, height);
            this.piss.endFill();
            // this.piss.renderable = false;
            const adjust = new AdjustmentFilter({
                saturation: 1.2,
                contrast: 1,
                gamma: 0.7,
                alpha: 0.7,
                brightness: 0.6
            });
            this.piss.filters = [adjust];

            const poolTop = new PIXI.Graphics()
                .beginFill(0xBA8420)
                .drawEllipse(width/2,0,width*.6,height*0.009)
                .endFill();
            poolTop.filters = [new PIXI.filters.BlurFilter(3)]
            

            this.dispWrapper = this.piss.clone();
            this.dispWrapper.filterArea = new PIXI.Rectangle(0, this.maxFill, width, height);
            const filter = new BackdropDisplacementFilter();
            filter.padding = -3;
            filter.scale.y = 30;
            filter.scale.x = 60;
            this.dispWrapper.filters = [filter];
            
            this.dispSprite = new PIXI.TilingSprite(this.dispMap);
            this.dispSprite.width = this.container.width;
            this.dispSprite.height = this.container.height;
            // this.dispSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

            this.piss.addChild(poolTop);
            this.dispWrapper.addChild(this.dispSprite);
            this.pool.addChild(this.piss);
            this.pool.addChild(this.dispWrapper);
            this.container.addChild(this.pool);

            resolve();
        })
    }

    enable(){
        // this.pool.renderable = true;
        super.enable();
    }

    disable(){
        // this.pool.renderable = false;
        super.disable();        
        this.pool.destroy({children: true});
    }

    tick(time: number){
        this.count += 0.005
        this.dispSprite.tileScale.x = 2+ Math.sin(this.count);
        this.dispSprite.tileScale.y = 2+Math.cos(this.count);
        this.dispSprite.tilePosition.x += Math.sin(this.count);
        this.dispSprite.tilePosition.y += Math.cos(this.count);
    }

    destroy(){}
}