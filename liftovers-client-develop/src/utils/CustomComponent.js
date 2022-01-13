import React from 'react';
import { connect } from "react-redux"
import {verifyUser} from '../actions/auth'

class CustomComponent extends React.Component {

    componentWillMount = () => {
        this.props.verifyUser()
    }
}


export default connect(null, {verifyUser})(CustomComponent);