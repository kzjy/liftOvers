import React, {useState} from 'react'
import '../lifts/settings.css'
import {Modal} from "react-bootstrap"
import {FormGroup, FormControl} from "react-bootstrap";
import { connect } from 'react-redux'
import {
    Boxed,
    Button
  } from "flexibull";
  import DatePicker from 'react-datepicker'
  import "react-datepicker/dist/react-datepicker.css";
  import axios from 'axios'
  import ApiUrl from '../../api/config'
  import { getVolunteers } from "../../actions/volunteer";
  import { withRouter } from 'react-router-dom';






class VolunteerModal extends React.Component{
  	state = {
        show: false,
        date:  null
      }
    
      handleChange = date => {
        this.setState({
          date: date
        });
      };
     

        
	handleClose = () => {
		this.setState({show: false})
	}

	handleShow = () => {
		this.setState({show: true})
	}

	handleSave = () => {

		const name = document.querySelector("#name").value;
		const email =  document.querySelector("#email").value;
		const phone =  document.querySelector("#phone").value;

		const password = 'liftovers'
        if(name == '' || email == '' || phone == ''){
            alert("Please fill in all fields")
            return
        }

        const request = {
            "name": name,
            "email": email,
            "password": password,
            "password2": password,
            "phone": phone,
        }
        console.log(request)
        axios.post(`${ApiUrl}/register`, request).then(
			() => {
				console.log("ok")
				this.props.getVolunteers({ page: 1, limit: 10 })
            }).catch( function(error){
				console.log("error")
				alert("Please properly fill in all fields")
                console.log(error)
                }
            )
		this.handleClose();
	}

	render () {
		return (
		<div style={{marginRight: "10px"}}>
            <Boxed pad="0.2rem" align="right">

                <Button variant='link' className="edit-button" onClick={this.handleShow} size='sm' style={{width:"177.5px"}}>
                    <i className=" icon-plus"/> Create Volunteer  
                </Button>
            </Boxed>

			<Modal className='edit-modal' show={this.state.show} onHide={this.handleClose} >
			<Modal.Header>
				<Modal.Title>Create Lift Request</Modal.Title>
			</Modal.Header>
			<Modal.Body className="create-request-body">
					<span className='create-request-text'>Volunteer Name</span>
					<FormGroup>
						<FormControl
							className ="create-request-input"
							type="text"
							id="name"
							/>
					</FormGroup>
					<span className= 'create-request-text' >Volunteer Email</span>
					<FormGroup>
						<FormControl
							className ="create-request-input"
							type="text"
							id="email"
						/>
					</FormGroup>
					<span className= 'create-request-text'>Volunteer Phone</span>
					<FormGroup>
						<FormControl
							className ="create-request-input"
							type="text"
							id="phone"
						/>
					</FormGroup>
					<p>Volunteer will be created with default password 'liftovers'.<br/>
					The user should log in and change the password themselves.</p>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={this.handleClose}>
				Close
				</Button>
				<Button variant="primary" onClick={this.handleSave}>
				Save Changes
				</Button>
			</Modal.Footer>
			</Modal>
		</div>
		);
	}    
}

const mapStateToProps = state => ({
	auth: state.auth,
  });
export default withRouter(connect(mapStateToProps, {getVolunteers})(VolunteerModal));
