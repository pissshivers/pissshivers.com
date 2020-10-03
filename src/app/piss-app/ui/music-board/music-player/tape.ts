import * as PIXI from 'pixi.js';
import { Playlist } from '../../../core/Playlist/Playlist';
import { SheetSprite } from '../../../core/UI/SheetSprite';

interface TrackDisplay {
    fullTitle: string,
    title: string,
    padding: number,
    rotate: boolean
}

export class Tape extends SheetSprite {

    sheet: PIXI.Spritesheet;
    leftSpool: PIXI.Sprite;
    rightSpool: PIXI.Sprite;
    playlist: Playlist;
    trackName: PIXI.BitmapText;
    trackNameText: string;
    trackDisplay: TrackDisplay;
    t: number = 0;


    constructor(sheet: PIXI.Spritesheet, playlist: Playlist){
        super('tape-outline.png', sheet);
        this.sheet = sheet;
        this.playlist = playlist;

        this.leftSpool = new SheetSprite('left-spool.png', sheet);
        this.addChild(this.leftSpool);
        
        this.rightSpool = new SheetSprite('right-spool.png', sheet);
        this.addChild(this.rightSpool);

        const textStyle = {fontName: 'Permanent Marker'}

        const tapeName = new PIXI.BitmapText("Extended Piss", {...textStyle, fontSize: 40});
        tapeName.anchor = 0.5;
        tapeName.x = this.width/2;
        tapeName.y = 55;
        this.addChild(tapeName);

        const trackNameRender = new PIXI.BitmapText('', {...textStyle, fontSize: 30});
        
        this.trackName = new PIXI.BitmapText('', {...textStyle, fontSize: 30});
        this.trackName.anchor = 0.5;
        this.trackName.x = this.width/2;
        this.trackName.y = this.height - 90;
        this.addChild(this.trackName);

        this.playlist.on('loadstart', (num: number, title: string) => {
            this.t = 0;
            trackNameRender.text = (num+1)+'.\t'+title;
            this.trackDisplay = this.getTrackDisplay(trackNameRender);
            this.trackName.text = this.trackDisplay.title;
        })

        this.playlist.audio.addEventListener('play', () => {
            PIXI.Ticker.shared.add(this.tick, this);
        })

        this.playlist.audio.addEventListener('pause', () => {
            this.t = 0;
            this.trackName.text = this.trackDisplay.title;
            PIXI.Ticker.shared.remove(this.tick, this);                    
        })
    }

    

    getTrackDisplay(title: PIXI.BitmapText): TrackDisplay{
        const tl = title.text.length;
        const tw = title.textWidth;
        const fullTitle = title.text.padEnd(tl+4, ' ');
        let charPadding = Math.ceil((-(this.width*tl) + (tl*tw) + (12*tw))/tw);
        let dispTitle = this.rotateTitle(fullTitle, 0);
        dispTitle = this.trimTitle(dispTitle, charPadding);

        return {
            fullTitle: fullTitle,
            title: dispTitle,
            padding: charPadding,
            rotate: charPadding > 0
        };
    }

    trimTitle(title: string, padding?: number): string{
        padding = padding ? padding : this.trackDisplay.padding;
        title = title.slice(0, title.length - padding);
        if (/(\w)$/.test(title)){
            title = title.slice(0, title.length-1) + '...';
        }
        return title;
    }

    rotateTitle(title: string|string[], count: number): string{
        if (typeof title === 'string'){
            title = title.split('');
        }
        var push = Array.prototype.push,
            splice = Array.prototype.splice
            var len = title.length >>> 0, // convert to uint
            count = count >> 0; // convert to int

        // convert count to value in range [0, len)
        count = ((count % len) + len) % len;

        // use splice.call() instead of this.splice() to make function generic
        push.apply(title, splice.call(title, 0, count));
        
        return title.join('');
    }

    updateTitleDisplay(time: any){
        const title = this.rotateTitle(this.trackDisplay.fullTitle, this.t);
        this.trackName.text = this.trimTitle(title);
        this.t += 0.05;
    }

    tick(time: number){
        
        this.updateTitleDisplay(time);
        this.leftSpool.rotation += 0.01 * time;
        this.rightSpool.rotation += 0.01 * time;
    }
}