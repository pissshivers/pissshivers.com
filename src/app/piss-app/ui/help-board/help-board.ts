import * as PIXI from 'pixi.js';
import PissApp from '../..';
import { getSceneState, store } from '../../../store';
import { toggleHelpMenu } from '../../../store/scene/actions';
import { DisplayLayer } from '../../core';

import { SheetSprite, Text, TextButton } from '../../core/UI';
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
        header.y = 80;
        this.board.addChild(header);

        const closeBtn = new TextButton("X close", {fontSize: 20});
        closeBtn.x = this.board.width - 100;
        closeBtn.y = 30;
        closeBtn.on('pointerdown', () => {
            store.dispatch(toggleHelpMenu(false));
        })
        this.board.addChild(closeBtn);
        
        this.loadList(HelpList)
            .then(() => {
                const container = new PIXI.Container();
                container.position.set(80, 200);
                container.scale.set(0.8)
                for (let i = 0, len = this.list.length; i < len; i++){
                    container.addChild(this.list[i]);
                }
                this.board.addChild(container);

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

            });
        

        this.on('added', () => {
            this.resize();
        });

    }

    loadList(list: any){
        return new Promise((resolved) => {
            const padd = 60;
            const iconSize = 60;
            const textStyle = {maxWidth: this.board.width - (iconSize + padd)};
            const sheet = PIXI.Loader.shared.resources['piss-shivers-ui'].spritesheet;
            const container = new PIXI.Container();
            let i = 0;
            while (i < list.length){
                let icon = new PIXI.Sprite(sheet.textures[list[i].icon]);
                let iconSacle = icon.width > icon.height ? iconSize/icon.width : iconSize/icon.height;
                icon.scale.set(iconSacle);
                icon.anchor.set(0.5, 0.5);
                icon.position.set(padd/2)

                let text = new Text(list[i].text, textStyle);
                text.x = icon.width + padd;

                let item = new PIXI.Container();
                // item.height = text.textHeight + padd;
                item.y = i < 1 ? 0 : this.list[i-1].y + this.list[i-1].height+ padd;
                item.addChild(icon, text)
                this.list.push(item);
                i++;
                if (i == list.length-1){
                    resolved();
                }
            }

            
        })


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