import axios from "axios";
import ApiUrl from "../api/config";
import { SET_CURRENT_USER, USER_LOADING } from "../constants";

export const registerUser = (user, history) => dispatch => {
    axios.post(`${ApiUrl}/register`, user)
        .then(res => history.push("/login"))   
        .catch(err =>
            console.log(err.response.data)
        );   
}

export const loginUser = (user) => dispatch => {
    
    fetch(`${ApiUrl}/login`, {
        method: 'POST',
        body: JSON.stringify(user),
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json',
        }
    }).then(function(response) {
        if (response.status !== 200) {
            alert('Incorrect login credentials')
        }
        return response.json()
    }).then(data => {
        
        dispatch(setCurrentUser(data.user))
    }).catch(error => {
        console.log(error)

    })
}

export const logoutUser = () => dispatch => {
    axios.get(`${ApiUrl}/logout`)
        .then(res => {
            dispatch(setCurrentUser({}));
        })
}

export const verifyUser = () => dispatch => {
    axios.get(`${ApiUrl}/verify`, {withCredentials: true})
        .then(res => {
            
            dispatch(setCurrentUser(res.data))
        })
        .catch(err => {
            console.log(err)
        })
}

export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

export const setCurrentUser = user => {
    return {
        type: SET_CURRENT_USER,
        payload: user
    };
};