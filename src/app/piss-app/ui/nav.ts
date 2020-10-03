import * as PIXI from 'pixi.js';


import { UI } from '../core/UI';
import {SheetSprite} from '../core/UI/SheetSprite';
import PissApp from '..';
import { ResourceMap } from '../core';
import { Assets } from './assets';
import { MusicBoard } from './music-board/music-board';
import { NavBoard } from './nav-board/nav-board';

export class Nav extends UI {

    sheet: PIXI.Spritesheet;
    musicBoard: SheetSprite;
    navBoard: SheetSprite;
    textStyle: PIXI.TextStyle;

    constructor(piss: PissApp){
        super(piss);
        this.assets = Assets; 
        this.setParent(this.stage)
        this.init();
    }


    init(){
        
        const res = PIXI.Loader.shared.resources;
        this.sheet = res['piss-shivers-ui'].spritesheet;

        this.musicBoard = new MusicBoard(this.sheet);
        this.addChild(this.musicBoard);

        this.navBoard = new NavBoard(this.sheet);
        this.addChild(this.navBoard);

        this.resize();
    }

    resize(){
        this.scale.set(this.piss.height/1600);
    }

}