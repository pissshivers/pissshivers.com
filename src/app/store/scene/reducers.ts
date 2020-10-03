import { createReducer, getType } from 'typesafe-actions';
import { SCENE_NAME, TRACK_NUM } from './constants';
import { SceneStateType } from './types';
import { loadScene, changeTrack } from './actions';

const sceneReducer = createReducer({
    name: SCENE_NAME,
    track: TRACK_NUM
} as SceneStateType)
    .handleAction(loadScene, (state, action) => {
        state.name = action.payload;
        return state;
    })
    .handleAction(changeTrack, (state, action) => state);

export default sceneReducer;
export type SceneState = ReturnType<typeof sceneReducer>;