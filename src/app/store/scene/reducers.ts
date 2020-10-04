import { createReducer, getType } from 'typesafe-actions';
import { SCENE_NAME, TRACK_NUM } from './constants';
import { SceneStateType } from './types';
import { loadScene, changeTrack } from './actions';

const sceneReducer = createReducer({
    name: SCENE_NAME,
    track: TRACK_NUM
} as SceneStateType)
    .handleAction(loadScene, (state, action) => {
        let newState = { ...state }
        newState.name = action.payload;
        return newState;
    })
    .handleAction(changeTrack, (state, action) => {
        let newState = {...state};
        newState.track = action.payload;
        return newState;
    });

export default sceneReducer;
export type SceneState = ReturnType<typeof sceneReducer>;