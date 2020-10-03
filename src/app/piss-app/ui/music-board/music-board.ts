import * as PIXI from 'pixi.js';

import { Tape } from './music-player/tape';
import { Controls } from './music-player/controls';
import { Playlist } from '../../core/Playlist/Playlist';
import { ITrack } from '../../core/Playlist/ITrack'
import { Tracks } from './tracks';
import { SheetSprite } from '../../core/UI/SheetSprite';

export class MusicBoard extends SheetSprite {

   sheet: PIXI.Spritesheet;
   tape: Tape;
   controls: Controls;
   tracks: ITrack[];
   playlist: Playlist;

    constructor(sheet: PIXI.Spritesheet){
        super('music-board.png', sheet);

        this.sheet = sheet;
        this.tracks = Tracks;
        this.playlist = new Playlist(this.tracks);

        this.tape = new Tape(this.sheet, this.playlist);
        this.addChild(this.tape);


        this.controls = new Controls(this.sheet, this.playlist);
        this.addChild(this.controls);
    }

    tick(time: number){
        this.tape.tick(time);
    }
}
