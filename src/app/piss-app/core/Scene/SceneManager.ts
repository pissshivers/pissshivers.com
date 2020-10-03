import * as PIXI from 'pixi.js';

import { store, getSceneState } from '../../../store'

import PissApp from '../..';
import { Scene } from './Scene';
import { PissClassFactory } from '../../common/piss-class-factory';

export class SceneManager extends PIXI.utils.EventEmitter {

    loader: PIXI.Loader;
    piss: PissApp;
    static instance: SceneManager;
    static scenes: {[name: string]: Scene} = {};

    private stage: PIXI.Container;
    private current: Scene;
    private loading: Scene;
    private stateName: string;

    constructor(piss: PissApp){
        super();

        this.piss = piss;
        this.stage = new PIXI.Container();
        this.piss.addChild(this.stage);        
    }

    static register(...scenes: any[]){
        scenes.forEach((scene) => {
            let name = scene.name;
            SceneManager.scenes[name] = scene;
        })
    }

    static init(piss: PissApp){
        SceneManager.instance = new SceneManager(piss)
    }

    set loadingScene(scene: Scene){
        this.loading = scene;
    }

    preload(){
        return new Promise((resolve, reject):any => {
            this.loading.preload()
            
            PIXI.Loader.shared.onComplete.add(() => {
                this.piss.addChild(this.loading);

                store.subscribe(() => {
                    const state = getSceneState(store.getState().scene);
                    if (this.stateName != state.name){
                        if (Object.keys(SceneManager.scenes).includes(state.name)){
                            this.load(SceneManager.scenes[state.name]);
                        }
                        else {
                            console.error("Scene not registered with SceneManager: ", state.name);
                        }
                    }
                    this.stateName = state.name;
                })

                resolve();
            })
            PIXI.Loader.shared.onError.add(() => {
                reject("Loading screen assets failed to load")
            })
        })
    }
    
    
    load(scene: any){
        console.log(this.loading.parent)
        if (!this.loading.parent){
            this.piss.addChild(this.loading)
        }
        console.log(this.piss.stage.children)
        if (this.current){
            this.current.destroy();
        }
        const pissScene = PissClassFactory(scene, this.piss) as Scene;
        pissScene.init(PIXI.Loader.shared.resources).then(() => {
            this.current = pissScene;
            this.stage.addChild(this.current);
            this.piss.removeChild(this.loading);
        });
        
    }

    transitionTo(to: Scene, callBack: Function){
        if (this.loading){
            this.piss.stage.removeChild(this.loading);
            this.piss.addChild(this.loading);
            callBack();
        }

    }

    tick(time: any){
        if (this.current && "tick" in this.current){
            this.current.tick(time);
        }
    }

    resize(){
        if ("resize" in this.current){
            this.current.resize();
        }
    }
}