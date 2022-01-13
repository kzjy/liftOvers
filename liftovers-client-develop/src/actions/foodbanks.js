import axios from "axios";
import ApiUrl from "../api/config";
import { toggleLoader } from "./auxilliary";
import { SET_FOOD_BANKS } from "../constants";
import { Button } from "flexibull/build/Buttons/Button.components";
import React from "react";
import '../App.css'

const FileDownload = require('js-file-download');

export function downloadRequests() {
  return function() { 
    return axios.get(`${ApiUrl}/admin/foodbanks/download`, {withCredentials: true}).then(res => { FileDownload(res.data, 'Foodbanks.csv'); }).catch(res => console.log(res))
  }
}

export function setFoodBanks(banks) {
  return {
    type: SET_FOOD_BANKS,
    payload: banks
  };
}

export function getFoodBanks(params) {
  return function(dispatch) {
    dispatch(toggleLoader(true));
    return axios.get(`${ApiUrl}/admin/foodbanks?page=${params.page}&limit=${params.limit}`, {withCredentials: true}).then(({ data }) => {
      dispatch(toggleLoader(false));
      if (data) {
        data.docs.forEach(elem => elem.button = <div style={{textAlign:"center"}}><Button className='removeBtn' onClick={function () {
          if (window.confirm("Are you sure you wish to delete this item?")) {
            dispatch(deleteFoodBanks(elem, params))
          }
        }} style={{background:"rgba(237, 86, 78, 0.5)", width:"80px"}}>Remove</Button></div>)
        }
      dispatch(setFoodBanks(data));
    });
  };
}

const deleteFoodBanks = (elem, params) => dispatch => {
  axios.delete(`${ApiUrl}/admin/foodbanks/delete?foodBank=${elem._id}`, {withCredentials: true})
    .then(result => {
      dispatch(getFoodBanks(params))
    })
    .catch(res => console.log(res))
}
