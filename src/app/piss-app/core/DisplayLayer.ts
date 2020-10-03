import * as PIXI from "pixi.js";
import { IAddOptions } from 'resource-loader';

import PissApp from '../index';

export type ResourceMap = Partial<Record<string, PIXI.LoaderResource>>;


export class DisplayLayer extends PIXI.Container {

    piss: PissApp;
    loader?: PIXI.Loader;
    assets?: IAddOptions[];

    constructor(piss: PissApp){
        super();
        this.piss = piss;
        this.name = this.constructor.name;
        
    }
    
    init(...args: any[]): any{}
    tick?(time: number){}
    resize?(...args: any[]){}

    destroy(){
        super.destroy();
        if ("tick" in this){
            PIXI.Ticker.shared.remove(this.tick, this)
        }
    }
    
}