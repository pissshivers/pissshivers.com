import { DisplayLayer } from '../DisplayLayer';
import PissApp from '../..';

export class UI extends DisplayLayer {

    static textStyle: PIXI.TextStyle;
    stage: PIXI.Container;

    constructor(piss: PissApp){
        super(piss);

        this.stage = new PIXI.Container();
        this.piss.addChild(this.stage);
    }
}
