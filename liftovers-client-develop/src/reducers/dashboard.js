import { SET_TOTAL_COMPLETED, SET_TOTAL_CANCELLED, SET_TOTAL_INCOMPLETE, SET_TOTAL_VOLUNTEERS, SET_TOTAL_MONTHS } from "../constants";

const initialState = {
    total_completed: 0,
    total_cancelled: 0,
    total_incomplete: 0,
    total_volunteers: 0, 
    total_months: []
}
export function dashboard(state = initialState, action) {
    switch (action.type) {
        case SET_TOTAL_COMPLETED:
            return {
                ...state,
                total_completed: action.payload
            }
        case SET_TOTAL_CANCELLED:
            return {
                ...state, 
                total_cancelled: action.payload
            }
        case SET_TOTAL_INCOMPLETE:
            return {
                ...state, 
                total_incomplete: action.payload
            }
        case SET_TOTAL_VOLUNTEERS:
            return {
                ...state,
                total_volunteers: action.payload
            }
        case SET_TOTAL_MONTHS:
            return {
                ...state,
                total_months: action.payload
            }
        default:
            return state;
    }
}