import { createAction } from 'typesafe-actions';

export const POUND_BEER = 'pissOMeter/POUND_BEER';
export const DRAIN_PISS = 'pissOMeter/DRAIN_PISS';
export const SET_DEFAULTS = 'pissOMeter/SET_DEFAULTS';

export const poundBeer = createAction(POUND_BEER)<void>();
export const drainPiss = createAction(DRAIN_PISS)<object | void>();
export const setDefaults = createAction(SET_DEFAULTS)<object>();