import * as PIXI from 'pixi.js';

import { store } from '../../../store';
import { SheetSprite, SpriteButton, Text, TextButton } from '../../core/UI';
import { Beer } from './beer';
import { PissOMeter } from './piss-o-meter';
import { loadScene } from '../../../store/scene/actions';
import { Toilet, Backyard } from '../../scenes';
import { TapedBoard } from '../taped-board';


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

        const header = new Text("Baby Haus Activies:", {fontSize: 40})
        header.x = this.pissOMeter.x + 120;
        header.y = 80;
        this.board.addChild(header)
        
        const list = new Text("1. Play a Piss Shivers track\r\n2. Drink some Beer (don't FUCK-UP and drink too much)\r\n3. Use the TOILET to drain the Piss-O-Meter\r\n4. Listen to Piss Shivers on Spotify or Apply Music", {maxWidth: 400, fontSize: 25})
        list.x = header.x+30;
        list.y = header.y + 70;
        this.board.addChild(list);

        const goto = new Text("GO TO:");
        goto.x = list.x;
        goto.y = list.y + list.height + 70;
        this.board.addChild(goto)

        const toilet = new TextButton("TOILET ->");
        toilet.x = goto.x + 100;
        toilet.y = goto.y + goto.height + 40;
        toilet.on('pointerdown', () => {
            store.dispatch(loadScene(Toilet.name))
        });
        this.board.addChild(toilet);

        const backyard = new TextButton("<- BACKYARD", {fontName: 'Permanent Marker', fontSize: 40});
        backyard.x = goto.x + 40;
        backyard.y = toilet.y + toilet.height + 40;
        backyard.on('pointerdown', () => {
            store.dispatch(loadScene(Backyard.name))
        });
        this.board.addChild(backyard);

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