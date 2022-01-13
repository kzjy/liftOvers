import axios from "axios";
import ApiUrl from "../api/config";
import { toggleLoader } from "./auxilliary";
import { SET_DONORS } from "../constants";
import { Button } from "flexibull/build/Buttons/Button.components";
import React from "react";
import '../App.css'

const FileDownload = require('js-file-download');

export function downloadRequests() {
  return function() { 
    return axios.get(`${ApiUrl}/admin/donors/download`, {withCredentials: true}).then(res => { FileDownload(res.data, 'Donors.csv'); }).catch(res => console.log(res))
  }
}

export function setDonors(donors) {
  return {
    type: SET_DONORS,
    payload: donors
  };
}

export function getDonors(params) {
  
  return function(dispatch) {
    dispatch(toggleLoader(true));
    return axios.get(`${ApiUrl}/admin/donors?page=${params.page}&limit=${params.limit}`, {withCredentials: true}).then(({ data }) => {
      dispatch(toggleLoader(false));
      if (data) {
        data.docs.forEach(elem => elem.button = <div style={{textAlign:"center"}}><Button className='removeBtn' onClick={function () {
          if (window.confirm("Are you sure you wish to delete this item?")) {
            dispatch(deleteDonors(elem, params))
          }
        }} style={{background:"rgba(237, 86, 78, 0.5)", width:"80px"}}>Remove</Button></div>)
        }
      dispatch(setDonors(data));
    });
  };
}

const deleteDonors = (elem, params) => dispatch => {
  axios.delete(`${ApiUrl}/admin/donors/delete?donor=${elem._id}`, {withCredentials: true})
    .then(result => {
      dispatch(getDonors(params))
    })
    .catch(err => console.log(err))
}