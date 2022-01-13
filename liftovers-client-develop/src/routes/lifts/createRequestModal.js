import React, {useState} from 'react'
import './settings.css'
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
  import { getLifts } from "../../actions/lifts";
  import { withRouter, Redirect } from 'react-router-dom';




class RequestModal extends React.Component{
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

		const firstName = document.querySelector("#first-name").value;
		const lastName =  document.querySelector("#last-name").value;
		const email =  document.querySelector("#email").value;
        const phone = document.querySelector('#phone-num').value;
        const address = document.querySelector('#address').value;
        const description = document.querySelector('#description').value

        if(firstName === '' || lastName === '' || email === '' || phone === '' || address === '' || description === ''){
            alert("Please fill in all fields")
            return
        }
        if(!this.state.date){
            alert("Please fill in all fields")
            return
        }
        const year= this.state.date.getFullYear().toString()
        const month = (this.state.date.getMonth() + 1).toString()
        const day = this.state.date.getDate().toString()
        const hour = this.state.date.getHours().toString()
        const minute = this.state.date.getMinutes().toString()

        const donorInfo = {
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "phone": phone,
            "address": address,
        }
        const availability = {
            "date" : {"year": year, "month": month, "day": day},
            "time": {"hour": hour, "minute": minute}
        }
        const request = {"donor": donorInfo, "availability": availability, "description": description}
        console.log(request)
        axios.post(`${ApiUrl}/lift/request`, request).then(
			() => {
				console.log("ok")
				this.props.getLifts({ page: 1, limit: 10, display: 'all'})

            }).catch( function(error){
                console.log("error")
                console.log(error)
                }
            )
		this.handleClose();
	}

	render () {
		return (
		<div style={{marginRight: "10px"}}>
            <Boxed pad="0.2rem" align="right">
                <Button variant='link' className="edit-button" onClick={this.handleShow} size='sm'>
                    <i className=" icon-plus"/> Create Request 
                </Button>
            </Boxed>

			<Modal className='edit-modal' show={this.state.show} onHide={this.handleClose} >
			<Modal.Header>
				<Modal.Title>Create Lift Request</Modal.Title>
			</Modal.Header>
			<Modal.Body className="create-request-body">
					<span className='create-request-text'>Donor First Name</span>
					<FormGroup>
						<FormControl
							className ="create-request-input"
							type="text"
							id="first-name"
							/>
					</FormGroup>
					<span className= 'create-request-text' >Donor Last Name</span>
					<FormGroup>
						<FormControl
							className ="create-request-input"
							type="text"
							id="last-name"
						/>
					</FormGroup>
					<span className= 'create-request-text'>Donor Email</span>
					<FormGroup>
						<FormControl
							className ="create-request-input"
							type="email"
							id="email"
						/>
					</FormGroup>
                    <span className= 'create-request-text'>Donor Phone Number</span>
					<FormGroup>
						<FormControl
							className ="create-request-input"
							type="text"
							id="phone-num"
						/>
					</FormGroup>
                    <span className= 'create-request-text'>Donor Address</span>
					<FormGroup>
						<FormControl
							className ="create-request-input"
							type="text"
							id="address"
						/>
                        
					</FormGroup>
                    <span className= 'create-request-text'>Pickup Date and Time</span>
					<FormGroup>
                        <DatePicker
                        onChange={this.handleChange}
                        selected={this.state.date}
                        id="pickup-date"
                        showTimeSelect
                        timeIntervals={15}
                        timeFormat="HH:mm"
                        dateFormat="MMMM d, yyyy hh:mm"
                        placeholderText="Click to select a date"
                        />
					</FormGroup>
                    <span className= 'create-request-text'>Short Description</span>
					<FormGroup>
                        <FormControl
							className ="create-request-input"
							type="text"
							id="description"
						/>
					</FormGroup>
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
  export default withRouter(connect(mapStateToProps, {getLifts})(RequestModal));
