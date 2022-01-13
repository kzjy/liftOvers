import { FoodBanks } from "./foodbanks";
import { connect } from "react-redux";
import { getFoodBanks, downloadRequests } from "../../actions/foodbanks";


function mapStateToProps(state) {
  return {
    foodbanks: state.foodbanks,
    loading: state.loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    downloadRequests: () => dispatch(downloadRequests()),
    getFoodBanks: params => dispatch(getFoodBanks(params))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FoodBanks);