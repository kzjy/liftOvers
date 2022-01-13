import React from 'react'
import './edit.css'
import {Button} from "flexibull";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { editInfo } from '../../actions/volunteer';

class EditField extends React.Component {
    state = {
        userInfo: this.props.userInfo, 
        editing: false
    }

    clickHandler = (e) => {
        e.preventDefault();
        const update = {}
        if(this.state.editing){
            const userInputField = document.getElementById('change-user-info')
            const userInput = userInputField.value
            const id = e.target.id
            if(userInput.length === 0){
                alert("Field cannot be empty!")
                return;
            }
            this.setState({userInfo: userInput, editing: false}, () => {
                update[id] = this.state.userInfo
                this.props.editInfo(this.props.auth.user.email, update);
            })
        }
        else{
            this.setState({userInfo: this.state.userInfo, editing: true})
        }

    }

    cancel = () => {
        this.setState({userInfo: this.state.userInfo, editing: false})
    }

    render () {
        return (
            <div className='settings-field'>
                <span className="settings-field-label">{this.props.label}</span> 
                <span className="user-info">
                    {
                    this.state.editing ?
                    <input id='change-user-info'></input> :
                    this.state.userInfo
                    }
                </span>
                    {   this.state.editing ? 
                        <Button id={this.props.field} onClick={this.cancel} variant="link" className="cancel-button" size='sm'>
                            Cancel
                        </Button> : null
                    }
                    <Button id={this.props.field} onClick={this.clickHandler} variant="link" className="edit-button-profile" size='sm'>
                        {this.state.editing ? 'Save' : 'Edit'}
                    </Button>
                <hr/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});


export default withRouter(connect(mapStateToProps, { editInfo })(EditField));