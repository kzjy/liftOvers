import { SET_DONORS } from "../constants";

export function setDonors(state = {}, action) {
    switch (action.type) {
        case SET_DONORS:
            return action.payload;
        default:
            return state;
    }
}
