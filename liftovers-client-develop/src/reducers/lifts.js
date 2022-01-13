import { SET_LIFTS } from "../constants";

export function setLifts(state = {}, action) {
    switch (action.type) {
        case SET_LIFTS:
            return action.payload;
        default:
            return state;
    }
}
