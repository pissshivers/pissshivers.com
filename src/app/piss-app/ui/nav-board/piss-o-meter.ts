import * as PIXI from 'pixi.js';

import {store, getPissState} from '../../../store';

import { SheetSprite } from '../../core/UI';
import { Pool, PoolUpdate } from '../../common/pool';
import { setDefaults } from '../../../store/piss-o-meter/actions';


export class PissOMeter extends SheetSprite {

    pissPool: Pool;
    level: number;
    max: number;
    stepFactor: number;
    unsubscribe: any;

    
    constructor(name: string, sheet: PIXI.Spritesheet){
        super('piss-o-meter.png', sheet);
        
    }

    init(){
        this.pissPool = new Pool(this, 6);
        this.pissPool.init();

        store.dispatch(setDefaults({
                level: this.pissPool.level,
                max: this.pissPool.maxFill,
                min: this.pissPool.minFill,
                steps: this.pissPool.stepFactor
            }))

        const textStyle = {fontName: 'Permanent Marker'}
        const levelNums = [14, 27, 41, 54, 68];
        const levelNumsStyle = {...textStyle, align: 'center'};
        
        levelNums.reverse().forEach((level, i) => {
            const num = new PIXI.BitmapText(level.toString(), {...textStyle, fontSize: 24});
            
            num.anchor = 0.5;
            num.y = i * (20.4 + 24) + (34.2+24);
            num.x = this.width/2;
            this.addChild(num);
        });

        const pissometerStyle = {...textStyle, fontSize: 30}
        const leftLabel = new PIXI.BitmapText("PISS-O-METER", pissometerStyle);
        leftLabel.anchor = 0.5;
        leftLabel.angle = -90;
        leftLabel.x = -leftLabel.height;
        leftLabel.y = this.height/2;
        this.addChild(leftLabel);

        const rightLabel = new PIXI.BitmapText("PISS-O-METER", pissometerStyle);
        rightLabel.anchor = 0.5;
        rightLabel.angle = 90;
        rightLabel.x = this.width + rightLabel.height;
        rightLabel.y = this.height/2;
        this.addChild(rightLabel);

        
        this.unsubscribe = store.subscribe(() => {
            let prev = this.pissPool.level;
            let curr = getPissState(store.getState().pissOMeter);

            if (prev != curr.level){
                if (prev > curr.level){
                    this.fill();
                }
                else {
                    this.drain({duration: curr.drainDurration});
                }
            }
        })

    }

    fill(){
        this.pissPool.fill();
    }

    drain(opts: object = {}){
        this.pissPool.drain(PoolUpdate.DRAIN, opts);
    }

    destroy(){
        super.destroy();
        this.unsubscribe();
    }

}