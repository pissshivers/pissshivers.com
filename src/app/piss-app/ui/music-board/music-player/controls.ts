import * as PIXI from 'pixi.js';

import { SpriteButton } from '../../../core/UI';
import { Playlist } from '../../../core/Playlist';
import { store } from '../../../../store';
import { changeTrack } from '../../../../store/scene/actions';

export class Controls extends PIXI.Container {

    playlist: Playlist;
    play: SpriteButton;
    pause: SpriteButton;
    next: SpriteButton;
    prev: SpriteButton;

    constructor(sheet: PIXI.Spritesheet, playlist: Playlist){
        super();

        this.playlist = playlist;

        this.play = new SpriteButton('play.png', sheet);
        this.pause = new SpriteButton('pause.png', sheet);
        this.pause.disable();
        this.next = new SpriteButton('next-track.png', sheet);
        this.prev = new SpriteButton('prev-track.png', sheet);

        this.addChild(this.play);
        this.addChild(this.pause)
        this.addChild(this.next);
        this.addChild(this.prev);

        // Set interaction events
        this.play.on('pointerdown', () => {
            this.playlist.play();
        });

        this.pause.on('pointerdown', () => {
            this.playlist.pause();
        })

        this.next.on('pointerdown', () => {
            this.playlist.next();
        })

        this.prev.on('pointerdown', () => {
            this.playlist.prev();
        })

        this.playlist.audio.addEventListener('play', () => {
            this.play.disable();
            this.pause.enable();
        })
        
        this.playlist.audio.addEventListener('pause', () => {
            this.play.enable();
            this.pause.disable();
        })

        this.playlist.audio.addEventListener('ended', () => {
            this.playlist.next();
        })

        this.playlist.on('loadstart', (track: number) => {
            store.dispatch(changeTrack(track))
        })
    }

}