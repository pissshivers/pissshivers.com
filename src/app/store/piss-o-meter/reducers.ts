import { createReducer, getType } from 'typesafe-actions';

import { PissOMeter} from './types';
import { PISS_BASE, PISS_MAX, PISS_LEVEL, PISS_STEPS, PISS_MIN, PISS_DRAIN_DURATION } from './constants';
import { poundBeer, drainPiss, setDefaults } from './actions';

const pissOMeterReducer = createReducer({
        level: PISS_LEVEL,
        max: PISS_MAX,
        min: PISS_MIN,
        base: PISS_BASE,
        drainDurration: PISS_DRAIN_DURATION,
        steps: PISS_STEPS,
        fuckedUp: false
    } as PissOMeter )
    .handleAction(setDefaults, (state, action) => Object.assign(state, action.payload))
    .handleAction(poundBeer, (state, _) => {
        if (state.level > state.max){
            state.level -= state.steps;
        }
        if (!state.fuckedUp && state.level == state.max){
            state.fuckedUp = true;
        }
        return state;
    })
    .handleAction(drainPiss, (state, _) => {
        state.level = state.min
        state.fuckedUp = false;
        return state;
    });

    export default pissOMeterReducer;
    export type PissOMeterState = ReturnType<typeof pissOMeterReducer>