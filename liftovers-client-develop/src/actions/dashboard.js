import axios from "axios";
import ApiUrl from "../api/config";
import { SET_TOTAL_COMPLETED, SET_TOTAL_CANCELLED, SET_TOTAL_INCOMPLETE, SET_TOTAL_VOLUNTEERS, SET_TOTAL_MONTHS } from "../constants";


export function setTotalCompleted(total_completed) {
    return {
        type: SET_TOTAL_COMPLETED,
        payload: total_completed
    };
}

export const getTotalCompleted = () => dispatch => {
    axios.get(`${ApiUrl}/admin/totalCompleted`).then(({ data }) => {
        if (data[0]) {
            dispatch(setTotalCompleted(data[0].numCompleted));
        } else {
            dispatch(setTotalCompleted(0));
        }
        
    });
}

export function setTotalCancelled(total_cancelled) {
    return {
        type: SET_TOTAL_CANCELLED,
        payload: total_cancelled
    };
}

export const getTotalCancelled = () => dispatch => {
    axios.get(`${ApiUrl}/admin/totalCancelled`).then(({ data }) => {
        if (data[0]) {
            dispatch(setTotalCancelled(data[0].numCancelled));
        } else {
            dispatch(setTotalCancelled(0))
        }
    });
}

export function setTotalIncomplete(total_incomplete) {
    return {
        type: SET_TOTAL_INCOMPLETE,
        payload: total_incomplete
    };
}

export const getTotalIncomplete = () => dispatch => {
    axios.get(`${ApiUrl}/admin/totalIncomplete`).then(({ data }) => {
        if (data[0]) {
            dispatch(setTotalIncomplete(data[0].numIncomplete));
        } else {
            dispatch(setTotalIncomplete(0));
        }
        
    });
}

export function setTotalVolunteers(total_volunteers) {
    return {
        type: SET_TOTAL_VOLUNTEERS,
        payload: total_volunteers
    };
}

export const getTotalVolunteers = () => dispatch => {
    axios.get(`${ApiUrl}/admin/totalVolunteers`).then(({ data }) => {
        if (data[0]) {
            dispatch(setTotalVolunteers(data[0].numVolunteers));
        } else {
            dispatch(setTotalVolunteers(0));
        }
    }).catch(err => { 
        console.log(err)
    })
}

export function setTotalMonths(total_months) {
    return {
        type: SET_TOTAL_MONTHS,
        payload: total_months
    };
}

export const getTotalMonths = () => dispatch => {
    axios.get(`${ApiUrl}/admin/totalMonths`).then(({ data }) => {
        dispatch(setTotalMonths(data));
    });
}