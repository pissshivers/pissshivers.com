import * as PIXI from 'pixi.js';

import { store } from '../../../store';
import { SheetSprite, SpriteButton, Text, TextButton } from '../../core/UI';
import { Beer } from './beer';
import { PissOMeter } from './piss-o-meter';
import { loadScene, toggleHelpMenu } from '../../../store/scene/actions';
import { Toilet, Backyard } from '../../scenes';
import { TapedBoard } from '../components/taped-board';


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

        const goto = new Text("Menu:", {fontSize: 55});
        goto.x = this.pissOMeter.x + 160;
        goto.y = pissLabel.height + 60;
        this.board.addChild(goto)

        const help = new TextButton("Help", {fontName: 'Permanent Marker', fontSize: 40});
        help.x = goto.x + 60;
        help.y = goto.y + goto.height + 30;
        help.on('pointerdown', () => {
            store.dispatch(toggleHelpMenu(true));
        })
        this.board.addChild(help);

        const backyard = new TextButton("Backyard", {fontName: 'Permanent Marker', fontSize: 40});
        backyard.x = help.x;
        backyard.y = help.y + help.height + 30;
        backyard.on('pointerdown', () => {
            store.dispatch(loadScene(Backyard.name))
        });
        this.board.addChild(backyard);

        const toilet = new TextButton("Toilet");
        toilet.x = help.x;
        toilet.y = backyard.y + backyard.height + 30;
        toilet.on('pointerdown', () => {
            store.dispatch(loadScene(Toilet.name))
        });
        this.board.addChild(toilet);

        const graveyard = new TextButton("GRAVEYARD");
        graveyard.x = toilet.x;
        graveyard.y = toilet.y + toilet.height + 30;
        graveyard.on('pointerdown', () => {

        })
        

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