import * as PIXI from 'pixi.js';
import { Cull } from '@pixi-essentials/cull';
import 'stats.js';
import * as GStats from 'gstats';
// import * as dat from 'dat.gui';

import { SceneManager } from './core/Scene/SceneManager';
import { EffectsManager } from './core/Effects/EffectsManager';
import { Backyard, Toilet, Graveyard } from './scenes/index';
import { Nav } from './ui';
import { PissPool } from './effects/piss-pool';
import { FuckedUp } from './effects/fuckedup';
import { Loading } from './scenes';
import { Assets } from './assets';

window.PIXI = PIXI;

// declare global {
//     var DebugGUI: dat.GUI
// };

// window.DebugGUI = new dat.GUI();

class PissApp extends PIXI.Application {
  
    static instance: PissApp;
    scene: SceneManager;
    ui: Nav;
    effects: EffectsManager;
    cull: Cull;
    storeSub: any;

    constructor(parent: HTMLElement | Document){
        super({
            resizeTo: window,
            autoDensity: true,
            backgroundColor: 0xFFFFFF
        });

        
        const resize = window.addEventListener('resize', () => {
            PIXI.Ticker.shared.stop();
            setTimeout(() => {
                PIXI.Ticker.shared.start();
                this.resizeApp();
            }, 1000)
		})

        if ("body" in parent) {
            parent.body.appendChild(this.view);
        }
        else {
            parent.appendChild(this.view);
        }

        this.cull = new Cull().add(this.stage);

        this.stage.on('prerender', () => {
            this.cull.cull(this.renderer.screen)
        });

        setTimeout(() => {
            let pixists = new GStats.PIXIHooks(this);
            let st = new GStats.StatsJSAdapter(pixists);
            document.body.appendChild(st.stats.dom || st.stats.domElement);
            this.ticker.add(() => {
                st.update();
            }, this)
        }, 2000)


    }

    init(){
        SceneManager.register(Backyard, Toilet, Graveyard)
        SceneManager.init(this);
        // this.scene = new SceneManager(this);
        SceneManager.instance.loadingScene = new Loading(this);
        SceneManager.instance.preload()
            .then(() => {
                PIXI.Loader.shared.add(Assets);
                PIXI.Loader.shared.load(() => {
                    this.ui = new Nav(this);
                    EffectsManager.init(this);
                    EffectsManager.load(PissPool, FuckedUp);
                })
            })
            .catch((e) => {
                console.error("Loading scene failed to initialize", e)
            })
        
    }

    tick(time: number){
        this.scene.tick(time);
    }

    addChild(child: PIXI.DisplayObject){
        this.stage.addChild(child);
    }

    removeChild(child: PIXI.DisplayObject){
        this.stage.removeChild(child);
    }

    resizeApp(){
        SceneManager.instance.resize();
        this.ui.resize();
    }

    get width(){
        return this.view.width;
    }

    get height(){
        return this.view.height;    
    }

}

export default PissApp;