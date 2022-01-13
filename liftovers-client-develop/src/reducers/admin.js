import { UPDATE_VOLUNTEER } from '../constants'

const initialState = {
    updated: null
}

export function admin(state = initialState, action) {
    switch (action.type) {
        case UPDATE_VOLUNTEER:
            return {
                ...state,
                updated: action.payload
            }
        case RESET_UPDATE:
            return {
                ...state,
                updated: null
            }
        default:
            return state;
    }
}