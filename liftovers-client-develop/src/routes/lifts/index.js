import { Lifts } from "./lifts";
import { connect } from "react-redux";
import { getLifts, downloadRequests, deleteLift } from "../../actions/lifts";
function mapStateToProps(state) {
  return {
    lifts: state.lifts,
    loading: state.loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    downloadRequests: () => dispatch(downloadRequests()),
    getLifts: params => dispatch(getLifts(params)),
    deleteLifts: elem => dispatch(deleteLift(elem))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lifts);