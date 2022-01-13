import { connect } from "dva";
import { Wrapper } from "./wrapper";

export const mapStateToProps = (state, ownProps) => {
  return {};
};

export const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchData(action, payload) {
      dispatch({ type: action, payload });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper);
