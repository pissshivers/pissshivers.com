import * as PIXI from 'pixi.js';
import * as Particles from 'pixi-particles';
import {DropShadowFilter} from '@pixi/filter-drop-shadow';

import { PeeSettings } from './pee-settings';
import { ResourceMap } from '../../core';
import { getPissState, store } from '../../../store';

export class PeeStream {
    elapsed: number;
    container: PIXI.Container = new PIXI.Container();
    parent: PIXI.Container;
    emitter: Particles.Emitter
    pos: PIXI.Point;
    settings: any;
    unsubscribe: any;

    constructor(parent: PIXI.Container) {
        this.parent = parent;
        this.parent.addChild(this.container);

        this.container.filters = [new DropShadowFilter({distance: 18, rotation: 18})];

        this.settings = {...PeeSettings};

        this.unsubscribe = store.subscribe(() => {
            let curr = getPissState(store.getState().pissOMeter);
            this.emitter.emitterLifetime = curr.drainDurration/1000;
        });
    }

    init(res: ResourceMap): void {
        let state = getPissState(store.getState().pissOMeter);
        this.settings.emitterLifetime = state.drainDurration/1000;
        this.emitter = new Particles.Emitter(
            this.container,
            res.pissParticle.texture,
            this.settings
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
        PIXI.Ticker.shared.add(this.update, this);
    }

    update(): void {
        let now = Date.now();
        this.emitter.update((now - this.elapsed) * 0.001);
        this.elapsed = now;

        let x = this.pos.x + (Math.sin(this.pos.x/(Math.floor(Math.random() * 20) + 1 )) * 10);
        let y = this.pos.y;

        this.emitter.updateSpawnPos(x, y);
    }

    destroy(): void {
        PIXI.Ticker.shared.remove(this.update, this);
        this.unsubscribe();
        this.emitter.destroy();
        this.container.destroy();

        this.settings = undefined;
    }
}