import axios from "axios";
import ApiUrl from "../api/config";
import { toggleLoader } from "./auxilliary";
import { SET_LIFTS } from "../constants";

const FileDownload = require('js-file-download');

export function downloadRequests() {
  return function(dispatch) { 
    
    return axios.get(`${ApiUrl}/admin/lifts/download`, {withCredentials: true}).then(res => { FileDownload(res.data, 'liftRequests.csv'); }).catch(res => console.log(res))
  }
}

export function setLifts(lifts) {
  return {
    type: SET_LIFTS,
    payload: lifts
  };
}

function fix(n) {
  if (n < 10) {
    return '0' + n.toString();
  } else {
    return n.toString();
  }
}


function fixTime(h, m) {
  if(h == 24) {
    return (h-12).toString() + ':' + m + 'am';
  } else if(h > 12) {
    return fix((h-12)) + ':' + m + 'pm';
  } else if (h < 12){
    return fix(h) + ':' + m + 'am';
  } else {
    return fix(h) + ':' + m+ 'pm';
  }
}


function displayTime(av) {
  if(typeof(av) == 'undefined') {
    return 0;
  } else {
    av.date.day = fix(av.date.day);
    av.date.month = fix(av.date.month);
    av.date.year = fix(av.date.year);
    av.time.minute = fix(av.time.minute);
    const time = fixTime(av.time.hour, av.time.minute);
    //av.time.hour = fix(av.time.hour);
    //av.time.minute = fix(av.time.minute);
    const date = av.date.day +'/'+ av.date.month + '/' + av.date.year + '   ' + time;
    
    return date;
  }
}

export function getLifts(params) {
 
  return function(dispatch) {
    dispatch(toggleLoader(true));
    return axios.get(`${ApiUrl}/admin/lifts?page=${params.page}&limit=${params.limit}&display=${params.display}&sortBy=${params.sortBy}`, {withCredentials: true}).then(({ data }) => {
      dispatch(toggleLoader(false));
      if (data) {
        data.docs.forEach(lst => (lst.availability = displayTime(lst.availability)));
      }
      dispatch(setLifts(data));
    }).catch(err => {
      console.log(err)
    })
  };
}

export const deleteLift = (elem) => dispatch => { 
  
  axios.delete(`${ApiUrl}/admin/lifts/delete?lift=${elem._id}`, { withCredentials: true })
    .then(res => {
      console.log(res)
      dispatch(getLifts({ page: 1, limit: 10, display: 'all' }))
    })
    .catch(res => console.log(res))
}
