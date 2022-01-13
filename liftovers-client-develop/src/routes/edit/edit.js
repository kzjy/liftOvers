import React from 'react';
import EditField from './editField'
import './edit.css';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'; 
import { editInfo } from '../../actions/volunteer';
import AvailabilityModal from './availabilityModal'

class Edit extends React.Component {
    render() {
        return (
            <>
            <h2 className='label'>General Account Settings</h2>
            <div className="editFieldContainers">
                <EditField field="name" label='Name: ' userInfo={this.props.auth.user.name}></EditField><hr/>
                <EditField field="password" label='Password: ' userInfo='********'></EditField><hr/>
                <EditField field="postalCode" label='Postal Code: ' userInfo={this.props.auth.user.postalCode}></EditField><hr/>
                <AvailabilityModal></AvailabilityModal>
            </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps, {editInfo})(Edit));
