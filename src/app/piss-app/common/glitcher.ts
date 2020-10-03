import * as PIXI from 'pixi.js';
import { GlitchFilter, GlitchFilterOptions } from '@pixi/filter-glitch';

export class Glitcher {
    private defaults: GlitchFilterOptions;
    private maxVals: GlitchFilterOptions;
    
    filter: GlitchFilter;
    enabled: boolean;

    constructor(
        maxVals?: GlitchFilterOptions, 
        defaults: GlitchFilterOptions = {
            slices: 5,
            offset: 100,
            direction: 0,
            fillMode: 1,
            average: false,
            seed: 0,
            red: new PIXI.Point(),
            green: new PIXI.Point(),
            blue: new PIXI.Point(),
            minSize: 8,
            sampleSize: 512,
        }){

            if (this.maxVals) {
                this.maxVals = Object.assign(this.defaults, maxVals);
            }

            this.defaults = defaults;
            this.filter = new GlitchFilter(this.defaults);        
    }

    setMaxVals(vals: Partial<GlitchFilterOptions>){
        this.maxVals = this.updateVals(this.defaults, vals);
    }

    updateVals(opts: GlitchFilterOptions, optsToUpdate: Partial<GlitchFilterOptions>) {
        return {...opts, ...optsToUpdate};
    }

    tick(time: any){
        this.update();
    }

    update(): void { 
        let newVals: GlitchFilterOptions = this.updateVals(this.defaults, this.maxVals);
        newVals.seed = Math.random();
        
        this.filter.slices = newVals.slices;
        this.filter.offset = newVals.offset;
        this.filter.direction = newVals.direction;
        this.filter.seed = newVals.seed;
        this.filter.red = newVals.red;
        this.filter.green = newVals.green;
        this.filter.blue = newVals.blue;
    }
}