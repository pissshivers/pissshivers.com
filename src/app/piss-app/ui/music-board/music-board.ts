import * as PIXI from 'pixi.js';

import { Cassette } from './music-player/tape';
import { Controls } from './music-player/controls';
import { Playlist } from '../../core/Playlist/Playlist';
import { ITrack } from '../../core/Playlist/ITrack'
import { Tracks } from './tracks';
import { SheetSprite } from '../../core/UI/SheetSprite';
import { TapedBoard } from '../taped-board';

export class MusicBoard extends TapedBoard {

   sheet: PIXI.Spritesheet;
   schlongDog: PIXI.Sprite;
   pissAnim: PIXI.AnimatedSprite;
   cassette: Cassette;
   controls: Controls;
   tracks: ITrack[];
   playlist: Playlist;

    constructor(sheet: PIXI.Spritesheet, board: string, tape: string){
        super(sheet, board, tape);

        this.sheet = sheet;
        this.tracks = Tracks;
        this.playlist = new Playlist(this.tracks);

        this.cassette = new Cassette(this.sheet, this.playlist);
        this.board.addChild(this.cassette);
        

        this.controls = new Controls(this.sheet, this.playlist);
        this.board.addChild(this.controls);

        const schlongSheet = PIXI.Loader.shared.resources['schlong-dog-data'].spritesheet;
        this.schlongDog = new PIXI.Sprite(schlongSheet.textures['schlong-dog.png']);

        this.schlongDog.scale.set((this.board.height * 0.9)/this.schlongDog.height);
        // this.schlongDog.anchor.set(0);
        this.schlongDog.position.set(35)
        // this.schlongDog.pivot = this.board.pivot;

        this.pissAnim = new PIXI.AnimatedSprite(schlongSheet.animations['schlong-dog-pissing']);
        this.pissAnim.animationSpeed = 0.1;

        this.schlongDog.addChild(this.pissAnim);
        this.board.addChild(this.schlongDog);
        
        this.cassette.playlist.on('play', () => {
            this.pissAnim.play();
        });

        this.cassette.playlist.on('pause', () => {
            this.pissAnim.stop();
        })
    }

    tick(time: number){
        this.cassette.tick(time);
        
    }
}
