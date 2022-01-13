import { SET_FOOD_BANKS } from "../constants";

export function setFoodBank(state = {}, action) {
    switch (action.type) {
        case SET_FOOD_BANKS:
            return action.payload;
        default:
            return state;
    }
}
