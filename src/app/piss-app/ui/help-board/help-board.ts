import * as PIXI from 'pixi.js';

import PissApp from '../..';
import { getSceneState, store } from '../../../store';
import { toggleHelpMenu } from '../../../store/scene/actions';
import { DisplayLayer } from '../../core';
import { SheetSprite, Text, TextButton } from '../../core/UI';
import { IconList } from '../components/icon-list';
import { HelpList } from './help-list';

export class HelpBoard extends DisplayLayer {

    bg: PIXI.Graphics;
    board: SheetSprite;
    list: PIXI.Container[] = [];
    items: any;
    unsubscribe: any;
    isOpen: boolean;


    constructor(piss: PissApp){
        super(piss);

        this.interactive = true;
        this.visible = false;

        const sheet = PIXI.Loader.shared.resources['piss-shivers-ui'].spritesheet;

        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x000000, 0.5);
        this.bg.drawRect(0,0,this.piss.width, this.piss.height);

        // this.visible = false;
        this.board = new SheetSprite('nav-board.png', sheet);
        this.addChild(this.bg);
        this.addChild(this.board);

        
        const header = new Text("Baby Haus Activies:", {fontSize: 60})
        header.x = 40;
        header.y = 50;
        this.board.addChild(header);

        const closeBtn = new TextButton("X close", {fontSize: 20});
        closeBtn.x = this.board.width - 100;
        closeBtn.y = 30;
        closeBtn.on('pointerdown', () => {
            store.dispatch(toggleHelpMenu(false));
        })
        this.board.addChild(closeBtn);

        const list = new IconList(HelpList, sheet);
        list.position.set(120, 160);
        list.scale.set(0.65)
        this.board.addChild(list);
        
        this.unsubscribe = store.subscribe(() => {
            let prev = this.isOpen;
            let curr = getSceneState(store.getState().scene);
            if (prev !== curr.helpMenuOpen){
                if (curr.helpMenuOpen){
                    this.open();
                }
                else {
                    this.close();
                }
            }
            this.isOpen = curr.helpMenuOpen;
        })        

        this.on('added', () => {
            this.resize();
        });

    }

    open(){
        this.visible = true;
    }

    close(){
        this.visible = false;
    }

    resize(){
        this.bg.width = this.piss.width;
        this.bg.height = this.piss.height;
        
        this.board.position.x = this.piss.width/2;
        this.board.position.y = this.piss.height/2;
    }

    destroy(){
        super.destroy();
        this.unsubscribe();
    }
}