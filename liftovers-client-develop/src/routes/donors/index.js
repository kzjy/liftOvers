import {Donors} from "./donors";
import {connect} from "react-redux";
import {getDonors, downloadRequests} from "../../actions/donors"

function mapStateToProps(state) {
    return {
        donors: state.donors,
        loading: state.loading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        downloadRequests: () => dispatch(downloadRequests()),
        getDonors: params => dispatch(getDonors(params))
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Donors);