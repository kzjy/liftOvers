import axios from "axios";
import ApiUrl from "../api/config";
import '../App.css'
import { toggleLoader } from "./auxilliary";
import { SET_VOLUNTEERS, UPDATE_VOLUNTEER } from "../constants";
import { Button } from "flexibull/build/Buttons/Button.components";
import React from "react";
import '../App.css'

const FileDownload = require('js-file-download');

export function downloadRequests() {
  return function() { 
    
    return axios.get(`${ApiUrl}/admin/volunteers/download`, {withCredentials: true}).then(res => { FileDownload(res.data, 'Volunteers.csv'); }).catch(res => console.log(res))
  }
}

export function setVolunteers(volunteers) {
  return {
    type: SET_VOLUNTEERS,
    payload: volunteers
  };
}

export function getVolunteers(params) {
  
  return function(dispatch) {
    dispatch(toggleLoader(true));
    return axios.get(`${ApiUrl}/admin/volunteers`, {withCredentials: true}, { params }).then(({ data }) => {
      dispatch(toggleLoader(false));
      if (data) {
        data.docs.forEach(elem => elem.button = <div style={{textAlign:"center"}}><Button className='removeBtn' onClick={function () {
          if (window.confirm("Are you sure you wish to delete this item?")) {
            dispatch(deleteVolunteer(elem, params))
          }
        }} style={{background:"rgba(237, 86, 78, 0.5)", width:"80px"}}>Remove</Button></div>)
      }
      dispatch(setVolunteers(data));
    });
  };
}

const deleteVolunteer = (elem, params) => dispatch => {
  axios.delete(`${ApiUrl}/admin/volunteers/delete?volunteer=${elem._id}`, {withCredentials: true})
    .then(result => {
      dispatch(getVolunteers(params))
    })
    .catch(res => console.log(res))
}

export const editInfo = (email, update) => (dispatch) => {
 
  axios.patch(`${ApiUrl}/volunteer/edit`, {
    "volunteerEmail": email,
    "update": update
  })
  .then(({ data }) => {
    
    alert('Successfully Edited')
    dispatch({
      type: UPDATE_VOLUNTEER,
    })

  })
  
}