import { TOGGLE_LOADER } from "../constants";

export function setLoader(state = false, action) {
  switch (action.type) {
    case TOGGLE_LOADER:
      return action.payload;
    default:
      return state;
  }
}
