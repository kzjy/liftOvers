import { TOGGLE_LOADER } from "../constants";

export function toggleLoader(loader) {
  return {
    type: TOGGLE_LOADER,
    payload: loader
  };
}
