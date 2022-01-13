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
  import { getFoodBanks } from "../../actions/foodbanks";
import { withRouter, Redirect } from 'react-router-dom';





class FoodbankModal extends React.Component{
  	state = {
        show: false,
        date:  null,
        refresh: true
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

		const contact = document.querySelector("#contact").value;
		const email =  document.querySelector("#email").value;
        const phone =  document.querySelector("#phone").value;
        const agency = document.querySelector("#agency").value;
		const address =  document.querySelector("#address").value;

		const password = 'liftovers'
        if(contact == '' || email == '' || phone == '' || agency == '' || address == ''){
            alert("Please fill in all fields")
            return
        }

        const request = {
            "agency": agency, 
            "email": email, 
            "phone": phone, 
            "address": address, 
            "contact": contact
        }
        console.log(request)
        axios.post(`${ApiUrl}/addFoodBank`, request).then(
			(res) =>
			{
				console.log(res)
				this.props.getFoodBanks({ page: 1, limit: 10 })
			}
            ).catch( function(error){
				console.log("error")
				alert("Please properly fill in all fields")
                console.log(error)
                }
			)

		this.handleClose();
	}

	render () {
		return (
		<div style={{marginRight: '10px'}}>
            <Boxed pad="0.2rem" align="right">

                <Button variant='link' className="edit-button" onClick={this.handleShow} size='sm' style={{width: "182.25px"}}>
                    <i className=" icon-plus"/> Create Food Bank
                </Button>
            </Boxed>

			<Modal className='edit-modal' show={this.state.show} onHide={this.handleClose} >
			<Modal.Header>
				<Modal.Title>Create Food Bank</Modal.Title>
			</Modal.Header>
			<Modal.Body className="create-request-body">
					<span className='create-request-text'>Agency</span>
					<FormGroup>
						<FormControl
							className ="create-request-input"
							type="text"
							id="agency"
							/>
					</FormGroup>
					<span className= 'create-request-text' >Address</span>
					<FormGroup>
						<FormControl
							className ="create-request-input"
							type="text"
							id="address"
						/>
					</FormGroup>
					<span className= 'create-request-text'>Main Contact</span>
					<FormGroup>
						<FormControl
							className ="create-request-input"
							type="text"
							id="contact"
						/>
					</FormGroup>
                    <span className= 'create-request-text'>Phone</span>
					<FormGroup>
						<FormControl
							className ="create-request-input"
							type="text"
							id="phone"
						/>
					</FormGroup>
                    <span className= 'create-request-text'>Email</span>
					<FormGroup>
						<FormControl
							className ="create-request-input"
							type="email"
							id="email"
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

export default withRouter(connect(mapStateToProps, {getFoodBanks})(FoodbankModal));
