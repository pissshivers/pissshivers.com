import * as PIXI from 'pixi.js';

import { ITrack } from './ITrack';

export class Playlist extends PIXI.utils.EventEmitter {

    list: ITrack[];
    trackNum: number;
    totalNumTracks: number;
    trackTitle: string;
    duration: number;
    audio: HTMLAudioElement;

    constructor(trackList: ITrack[]){
        super();

        this.list = trackList;
        this.totalNumTracks = this.list.length - 1;
        
        this.audio = new Audio();
        this.audio.autoplay = false;
        this.audio.preload = 'auto';

        this.audio.addEventListener('loadstart', () => {
            this.emit('loadstart', this.trackNum, this.trackTitle)
        })

        this.load(0);
    }

    load(trackNum: number){
        const track = this.list[trackNum];
        this.trackNum = trackNum;
        this.trackTitle = track.title;

        this.audio.src = track.url;
        this.audio.pause();
        this.audio.load();
    }

    playWhenPlayable(){
        if (this.audio.canPlayType('audio/mp3') === "probably"){;
            this.audio.removeEventListener('canplay', this.playWhenPlayable.bind(this));
            this.play();
        }
    }

    play(){
        this.audio.play();

    }

    pause(){
        this.audio.pause();
    }

    next(){
        const trackNum = this.trackNum < this.totalNumTracks ? this.trackNum + 1 : 0;
        this.audio.addEventListener('canplay', this.playWhenPlayable.bind(this));
        this.load(trackNum);
    }

    prev(){
        const trackNum = this.trackNum > 0 ? this.trackNum - 1 : this.totalNumTracks;
        this.audio.addEventListener('canplay', this.playWhenPlayable.bind(this));
        this.load(trackNum);
    }

    get paused(){
        return this.audio.paused;
    }

}