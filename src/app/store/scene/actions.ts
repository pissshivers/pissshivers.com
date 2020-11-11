import { createAction } from 'typesafe-actions';

export const LOAD_SCENE = 'scene/LOAD_SCENE';
export const CHANGE_TRACK = 'scene/CHANGE_TRACK';
export const TOGGLE_HELP_MEU = 'scene/TOGGLE_HELP_MENU';

export const loadScene = createAction(LOAD_SCENE)<string>();
export const changeTrack = createAction(CHANGE_TRACK)<number>();
export const toggleHelpMenu = createAction(TOGGLE_HELP_MEU)<boolean>();