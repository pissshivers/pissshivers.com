import * as PIXI from 'pixi.js';

import PissApp from '../..';
import { UI, IUIStore } from './index';

export class UIManager extends PIXI.utils.EventEmitter{

    piss: PissApp;
    container: PIXI.Container;
    
    private loader: PIXI.Loader;
    private current: InstanceType<typeof UI>;

    constructor(piss: PissApp){
        super();

        this.container = new PIXI.Container();
        this.piss = piss;
        this.piss.addChild(this.container);
        this.loader = new PIXI.Loader();
    }

    async init(){
        this.loader
    }

    load(ui: InstanceType<typeof UI>){

        if (this.current){
            this.current.destroy();
        }

        this.current = ui;
        this.container.addChild(this.current);
    }

    resize(){
        this.current.resize();
    }
}