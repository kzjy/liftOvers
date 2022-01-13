import { combineReducers } from "redux";
import { setVolunteers } from "./volunteers";
import { setLoader } from "./auxiliiary";
import { auth } from "./auth";
import { setLifts } from "./lifts";
import { dashboard } from "./dashboard";
import { setFoodBank } from './foodbanks'
import { setDonors } from './donors'

/*
 * We combine all reducers into a single object before updated data is dispatched (sent) to store
 * Your entire applications state (store) is just whatever gets returned from all your reducers
 * */
const allReducers = combineReducers({
  volunteers: setVolunteers,
  loading: setLoader,
  auth: auth,
  lifts: setLifts,
  dashboard: dashboard,
  foodbanks: setFoodBank,
  donors: setDonors
});

export default allReducers;
