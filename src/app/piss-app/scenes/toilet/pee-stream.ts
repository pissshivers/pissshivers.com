import * as PIXI from 'pixi.js';
import * as Particles from 'pixi-particles';
import {DropShadowFilter} from '@pixi/filter-drop-shadow';

import { PeeSettings } from './pee-settings';
import { ResourceMap } from '../../core';

export class PeeStream {
    elapsed: number;
    container: PIXI.Container = new PIXI.Container();
    parent: PIXI.Container;
    emitter: Particles.Emitter
    pos: PIXI.Point;

    constructor(parent: PIXI.Container) {
        this.parent = parent;
        this.parent.addChild(this.container);

        this.container.filters = [new DropShadowFilter({distance: 18, rotation: 18})];
    }

    init(res: ResourceMap): void {
        this.emitter = new Particles.Emitter(
            this.container,
            res.pissParticle.texture,
            PeeSettings
        );
        this.pos = this.emitter.spawnPos;
    }

    updateSpawnPos(x: number, y: number): void{
        this.pos = new PIXI.Point(x, y);
        this.emitter.updateSpawnPos(x, y);
    }

    start(): void {
        this.elapsed = Date.now();
        this.emitter.emit = true;
        this.update();
    }

    update(): void {
        requestAnimationFrame(() => {
            this.update();
        });
        
        let now = Date.now();
        this.emitter.update((now - this.elapsed) * 0.001);
        this.elapsed = now;

        let x = this.pos.x + (Math.sin(this.pos.x/(Math.floor(Math.random() * 20) + 1 )) * 10);
        let y = this.pos.y;
 
        this.emitter.updateSpawnPos(x, y);
    }
}