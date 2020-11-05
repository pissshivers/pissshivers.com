import * as PIXI from 'pixi.js';


//** Modified from MouseShake.js - Credits below: */
/*
 *	MouseShake.js
 *	Version 1.0
 *	Author: David Godzsak
 *  godzsakdavid@gmail.com
 *
 *	Copyright (c) 2015
 *	Licensed under the MIT license.
 *
 */

 interface MouseTracks {
     x: number;
     y: number;
     time: number;
 }

export class MouseShake {

    x: number;
    y: number;
    time: number;
    moves: MouseTracks[];
    shakes: number;
    shakeStart: number;
    shakesTimeout: number;
    detector: any;
    context: PIXI.DisplayObject;
    deg: number;
    refresh: number;                //milisecs
	shakeDeg: number;              //degrees
	lifeTime: number;              //milisecs
	active: boolean;                   //mousemove indicator
    
    constructor(context: PIXI.DisplayObject){

        this.context = context;

        this.moves = [];                 //set of Stamps
        this.shakes = 0;
        this.shakeStart = 0;
        this.deg = 0;                     //degrees
        this.x = 0;                       //coordinate x
        this.y = 0;                       //coorddinate y
        this.refresh = 80;                //milisecs
        this.shakeDeg = 500;              //degrees
        this.lifeTime = 200;              //milisecs
        this.active = false;                   //mousemove indicator
    }

    stamp(x: number, y: number, time: number): MouseTracks{
        return {x: x, y: y, time: time}
    }

    gamma(st: MouseTracks, nd: MouseTracks, rd: MouseTracks): number{
		//pythagoras
		var a=Math.sqrt(Math.pow(st.x-nd.x,2)+Math.pow(st.y-nd.y,2));
		var b=Math.sqrt(Math.pow(nd.x-rd.x,2)+Math.pow(nd.y-rd.y,2));
		var c=Math.sqrt(Math.pow(rd.x-st.x,2)+Math.pow(rd.y-st.y,2));
		var gam;

		if((a*b)==0){
			gam=0;
		}else{
			//law of cosines
			gam=180-Math.acos((Math.pow(a,2)+Math.pow(b,2)-Math.pow(c,2))/(2*a*b))*180/Math.PI;
		};
		return gam;
    }
    
    onMouseMove(event: any) {
        this.x = event.data.originalEvent.pageX;
        this.y = event.data.originalEvent.pageY;
        this.active = true;
    }

    enable(){

        this.shakes = 0;
        this.context.on('mousemove', this.onMouseMove, this);

        this.detector = setInterval(() => {
            const now = Date.now();
            this.deg = 0;
            
            if (this.active){
                let a = this.stamp(this.x, this.y, now);
                this.moves.push(a);
                this.active = false;
            }

            this.moves.filter((m) => {
                return now - m.time < this.lifeTime;
            });

            if (this.moves.length > 2){
                for (let i = 2, len = this.moves.length; i < len; ++i){
                    this.deg += this.gamma(this.moves[i], this.moves[i-1], this.moves[i-2]);
                }
            }

            if (this.deg > this.shakeDeg){
                this.moves = [];
                this.shakes++;
                if (this.shakeStart === 0){
                    this.shakeStart = Date.now();
                }
                
                if (this.shakes >= 2){
                    this.context.emit('mouseshake');
                }
            }
            
            if (now - this.shakeStart > 2500){
                this.shakes = 0;
                this.shakeStart = 0;
            }
            
        }, this.refresh);
    }

    disable(){
        if (this.detector){
            clearInterval(this.detector);
            this.context.off('mousemove', this.onMouseMove, this);
        }
    }
}