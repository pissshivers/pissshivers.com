import * as PIXI from 'pixi.js';

import { Scene, ResourceMap } from '../../core'
import { SpriteBG } from '../../common';
import { PeeStream } from './pee-stream';
import PissApp from '../..';
import { getPissState, store } from '../../../store';
import { drainPiss } from '../../../store/piss-o-meter/actions';
import { Panel, PanelSize } from '../../ui/components/panel';
import { MouseIcon } from '../../ui/components/icons/mouse';
import { Text } from '../../core/UI/Text';

export class Toilet extends Scene {

    bg: SpriteBG;
    toilet: PIXI.Sprite;
    peeStream: PeeStream;
    texture: PIXI.Texture;
    unsubscribe: any;
    tipPanel: Panel;
    tipText: Text;
    mouse: MouseIcon;

    constructor(piss: PissApp){
        super(piss);

        this.interactive = true;

        this.unsubscribe = store.subscribe(() => {
            let curr = getPissState(store.getState().pissOMeter);
            this.handleState(curr);
        });
        
    }

    init(res: ResourceMap){
        return new Promise((resolve) => {
            this.bg = new SpriteBG(res.toilet.texture, this.piss.width, this.piss.height);

            this.texture = res.toilet.texture;

            this.toilet = new PIXI.Sprite(this.texture);
            this.toilet.anchor.set(0.5);

            this.addChild(this.bg);
            this.addChild(this.toilet);

            this.peeStream = new PeeStream(this);
            this.peeStream.init(res);
            this.resize();

            let curr = getPissState(store.getState().pissOMeter);
            this.handleState(curr);

            this.tipPanel = new Panel(PanelSize.Small);
            this.tipPanel.scale.set(0.25);
            this.tipPanel.position.x = this.piss.width - this.tipPanel.width - 20;
            this.tipPanel.position.y = 60;
            this.addChild(this.tipPanel);


            this.mouse = new MouseIcon();
            this.mouse.leftClickDown();
            this.mouse.scale.set(0.5);
            this.mouse.position.set(40, 60);
            this.tipPanel.addChild(this.mouse);

            const maxTextWidth = this.tipPanel.width - (this.mouse.width - 80);

            this.tipText = new Text("Left-Click to Piss", {fontSize: 80, maxWidth: 380});
            this.tipText.position = this.mouse.position;
            this.tipText.position.x += this.mouse.position.x + this.mouse.width;
            this.tipPanel.addChild(this.tipText);

            resolve();
        })
    }

    handleState(state: any){
        if (state.level != state.min){
            this.on('pointerdown', () => {
                this.onClick()

            })
        }
        else {
            this.removeListener('pointerdown');
        }
    }
    
    onClick(){
        this.peeStream.start();
        store.dispatch(drainPiss());
    }

    resize(){
        const w = this.piss.width;
        const h = this.piss.height;

        this.toilet.scale.set(h/this.texture.height);
        this.toilet.position.set(w * 0.7, h/2);

        this.peeStream.container.scale.set(h/this.texture.height)
        this.peeStream.container.x = w * 0.7;
        this.peeStream.container.y = h;


        this.bg.resize(w, h);
    }

    destroy(){
        super.destroy();
        this.peeStream.destroy();
        this.unsubscribe();
    }

}