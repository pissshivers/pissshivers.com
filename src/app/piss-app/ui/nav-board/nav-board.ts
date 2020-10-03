import * as PIXI from 'pixi.js';

import { store } from '../../../store';
import { SheetSprite, SpriteButton } from '../../core/UI';
import { Beer } from './beer';
import { PissOMeter } from './piss-o-meter';
import { poundBeer } from '../../../store/piss-o-meter/actions';
import { loadScene } from '../../../store/scene/actions';


export class NavBoard extends SheetSprite {

    pissOMeter: PissOMeter;
    beer: Beer;

    constructor(sheet: PIXI.Spritesheet){
        super('nav-board.png', sheet);
        this.pissOMeter = new PissOMeter('piss-o-meter.png', sheet);
        this.pissOMeter.init();
        this.addChild(this.pissOMeter);

        this.beer = new Beer(sheet);
        this.beer.on('pointerdown', () => {
            store.dispatch(poundBeer());
        })
        this.addChild(this.beer);

        const header = new PIXI.BitmapText("Baby Haus Activies:", {fontName: 'Permanent Marker', fontSize: 40})
        header.x = this.pissOMeter.x + 120;
        header.y = 180;
        this.addChild(header)
        
        const list = new PIXI.BitmapText("1. Play a Piss Shivers track\r\n2. Drink some Beer (don't FUCK-UP and drink too much)\r\n3. Use the TOILET to drain the Piss-O-Meter\r\n4. Listen to Piss Shivers on Spotify or Apply Music", {fontName: 'Permanent Marker', maxWidth: 400, fontSize: 25})
        list.x = header.x+30;
        list.y = header.y + 70;
        this.addChild(list);

        const goto = new PIXI.BitmapText("GO TO:", {fontName: 'Permanent Marker', fontSize: 40});
        goto.x = list.x;
        goto.y = list.y + list.height + 70;
        this.addChild(goto)

        const toilet = new PIXI.BitmapText("TOILET ->", {fontName: 'Permanent Marker', fontSize: 40});
        toilet.x = goto.x + 100;
        toilet.y = goto.y + goto.height + 40;
        toilet.interactive = true;
        toilet.buttonMode = true;
        toilet.on('pointerdown', () => {
            store.dispatch(loadScene('Toilet'))
        });
        this.addChild(toilet);

        const backyard = new PIXI.BitmapText("<- BACKYARD", {fontName: 'Permanent Marker', fontSize: 40});
        backyard.x = goto.x + 40;
        backyard.y = toilet.y + toilet.height + 40;
        backyard.interactive = true;
        backyard.buttonMode = true;
        backyard.on('pointerdown', () => {
            store.dispatch(loadScene('Backyard'))
        });
        this.addChild(backyard);

        const spotify = new SpriteButton("spotify.png", sheet);
        spotify.on('pointerdown', () => {
            window.open("https://open.spotify.com/artist/0mtCigA4HfQhb325zUNvAj", "_blank")
        })
        this.addChild(spotify)

        const appleMusic = new SpriteButton("apple-music.png", sheet)
        appleMusic.on('pointerdown', () => {
            window.open("https://geo.music.apple.com/us/album/extended-piss/1516122681", "_blank")
        })
        this.addChild(appleMusic);

        const github = new SpriteButton("github.png", sheet)
        github.on('pointerdown', () => {
            window.open("https://github.com/pissshivers", "_blank")
        })
        this.addChild(github);
    }

}