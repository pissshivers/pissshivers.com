import * as PIXI from 'pixi.js';
import { IAddOptions } from 'resource-loader';

import { IEffect } from './IEffect';
import PissApp from '../..';

export class Effect extends PIXI.utils.EventEmitter implements IEffect {

    assets?: IAddOptions[];
    container: any;
    appEffect: boolean;
    filters: PIXI.Filter[] = [];
    filterIndexs: number[] = [];
    enabled: boolean = false;

    constructor(container?: PIXI.Container | PissApp){
        super();
        this.container = container;
        if (container instanceof PissApp){
            this.appEffect = true;
        }
    }

    init(...params: any[]): any{}

    tick?(time: number){}

    enable(){
        if (!this.enabled) {
            this.enabled = true;
            let container = this.appEffect ? this.container.stage : this.container;
            const filters = container.filters ? container.filters : [];
            this.filterIndexs = this.filters.map((f, i) => {
                return i + filters.length;
            });
            container.filters = this.filters.concat(filters);
            
            this.updateContainer(container);
            if ('tick' in this){
                PIXI.Ticker.shared.add(this.tick, this)
            }
        }
    }

    disable(){
        if (this.enabled){
            this.enabled = false;
            let container = this.appEffect? this.container.stage : this.container;
            let filters = container.filters;
            filters.splice(this.filterIndexs[0], this.filterIndexs.length);

            container.filters = filters;
            
            this.updateContainer(container);

            if ('tick' in this){
                PIXI.Ticker.shared.remove(this.tick, this)
            }
        }
    }

    updateContainer(container: PIXI.Container | PissApp){
        if (this.appEffect){
            this.container.stage = container;
        }
        else {
            this.container = container;
        }
    }
}