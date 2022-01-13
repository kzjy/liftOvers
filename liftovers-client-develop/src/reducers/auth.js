import { SET_CURRENT_USER, USER_LOADING } from "../constants";

const initialState = {
    isAuthenticated: false, 
    user: {}, 
    loading: false
}
export function auth(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: Object.keys(action.payload).length === 0 ? false : true,
                user: action.payload
            }
        case USER_LOADING:
            return {
                ...state, 
                loading: true
            }
        default:
            return state;
    }
}
