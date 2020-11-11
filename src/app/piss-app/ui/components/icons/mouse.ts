import * as PIXI from 'pixi.js';

import { Icon } from '../../../core/UI/Icon';

export class MouseIcon extends Icon{

    constructor(){
        super('mouse.png', PIXI.Loader.shared.resources['piss-shivers-ui'].spritesheet);

        this.addState('rightClick', 'mouse-right-click.png');
        this.addState('leftClick', 'mouse-left-click.png');
        this.addState('shake', 'mouse-shake.png');

    }

    rightClickUp(){
        this.hideState('rightClick')
    }

    rightClickDown(){
        this.showState('rightClick')
    }

    leftClickUp(){
        this.hideState('leftClick')
    }

    leftClickDown(){
        this.showState('leftClick')
    }

    shakeOn(){
        this.showState('shake')
    }

    shakeOff(){
        this.hideState('shake')
    }


}