import { createAction } from 'typesafe-actions';

export const LOAD_SCENE = 'scene/LOAD_SCENE';
export const CHANGE_TRACK = 'scene/CHANGE_TRACK';

export const loadScene = createAction(LOAD_SCENE)<string>();
export const changeTrack = createAction(CHANGE_TRACK)<number>();