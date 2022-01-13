import { SET_VOLUNTEERS } from "../constants";

export function setVolunteers(state = {}, action) {
  switch (action.type) {
    case SET_VOLUNTEERS:
      return action.payload;
    default:
      return state;
  }
}
