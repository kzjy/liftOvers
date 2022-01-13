import { Volunteer } from "./volunteer";
import { connect } from "react-redux";
import { getVolunteers, downloadRequests } from "../../actions/volunteer";
function mapStateToProps(state) {
  return {
    volunteers: state.volunteers,
    loading: state.loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    downloadRequests: () => dispatch(downloadRequests()),
    getVolunteers: params => dispatch(getVolunteers(params))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Volunteer);
