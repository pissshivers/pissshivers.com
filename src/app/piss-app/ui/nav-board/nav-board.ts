import * as PIXI from 'pixi.js';

import { store } from '../../../store';
import { SheetSprite, SpriteButton, Text, TextButton } from '../../core/UI';
import { Beer } from './beer';
import { PissOMeter } from './piss-o-meter';
import { loadScene, toggleHelpMenu } from '../../../store/scene/actions';
import { Toilet, Backyard, Graveyard } from '../../scenes';
import { TapedBoard } from '../components/taped-board';
import { MenuList } from './menu-list'
import { Menu } from '../components/menu';


export class NavBoard extends TapedBoard {

    pissOMeter: PissOMeter;
    beer: Beer;

    constructor(sheet: PIXI.Spritesheet, board: string, tape: string){
        
        super(sheet, board, tape);
        this.pissOMeter = new PissOMeter('piss-o-meter.png', sheet);
        this.pissOMeter.init();
        this.board.addChild(this.pissOMeter);

        this.beer = new Beer(sheet);
        this.board.addChild(this.beer);

        const pissLabel = new SheetSprite('piss-label.png', sheet);
        this.board.addChild(pissLabel);

        const menu = new Text("Menu:", {fontSize: 55});
        menu.x = this.pissOMeter.x + 160;
        menu.y = pissLabel.height + 40;
        this.board.addChild(menu);

        const menuItems = new Menu(MenuList, sheet);
        menuItems.x = menu.x + 40;
        menuItems.y = menu.y + menu.height + 60;
        this.board.addChild(menuItems);        

        const spotify = new SpriteButton("spotify.png", sheet);
        spotify.on('pointerdown', () => {
            window.open("https://open.spotify.com/artist/0mtCigA4HfQhb325zUNvAj", "_blank")
        })
        this.board.addChild(spotify)

        const appleMusic = new SpriteButton("apple-music.png", sheet)
        appleMusic.on('pointerdown', () => {
            window.open("https://geo.music.apple.com/us/album/extended-piss/1516122681", "_blank")
        })
        this.board.addChild(appleMusic);

        const github = new SpriteButton("github.png", sheet)
        github.on('pointerdown', () => {
            window.open("https://github.com/pissshivers", "_blank")
        })
        this.board.addChild(github);
    }

}