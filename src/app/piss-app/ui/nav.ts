import * as PIXI from 'pixi.js';


import { UI } from '../core/UI';
import PissApp from '..';
import { Assets } from './assets';
import { MusicBoard } from './music-board/music-board';
import { NavBoard } from './nav-board/nav-board';
import { HelpBoard } from './help-board/help-board';
import { TapedBoard } from './components/taped-board';

export class Nav extends UI {

    sheet: PIXI.Spritesheet;
    musicBoard: TapedBoard;
    navBoard: TapedBoard;
    helpBoard: HelpBoard;
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

        this.musicBoard = new MusicBoard(this.sheet, 'music-board.png', 'music-board-tape.png');
        this.addChild(this.musicBoard);

        this.navBoard = new NavBoard(this.sheet, 'nav-board.png', 'nav-board-tape.png');
        this.addChild(this.navBoard);

        this.helpBoard = new HelpBoard(this.piss);
        this.piss.addChild(this.helpBoard)

        this.resize();
    }

    resize(){
        this.scale.set(this.piss.height/1600);
        this.helpBoard.resize();
    }

}