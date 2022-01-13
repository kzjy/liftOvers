import React from "react";
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { logoutUser } from "../../actions/auth"


class Logout extends React.Component{
  constructor() {
    super();
  }
  onLogout = (e) => {
    this.props.logoutUser();
  }


  render() {
    if (!this.props.auth.isAuthenticated) {
      return <Redirect to={'/login'}></Redirect>;
    }
    return (
        <div>
            <button onClick={this.onLogout()}></button>
        </div>
    );
  }

}


const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, { logoutUser })(Logout));


