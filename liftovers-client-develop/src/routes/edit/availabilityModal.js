import React, {useState} from 'react'
import './edit.css'
import {Modal} from "react-bootstrap"
import {
    Boxed,
    Button
  } from "flexibull";
import "react-datepicker/dist/react-datepicker.css";
import EditTimeField from './editTimeField'
import {editInfo} from '../../actions/volunteer'
import { connect } from 'react-redux'

class AvailabilityModal extends React.Component{
  	state = {
		show: false,
		availability: [],
		raw: {
			0: {},
			1: {},
			2: {},
			3: {},
			4: {},
			5: {},
			6: {}
		},
    }
    
      handleChange = date => {
        this.setState({
          date: date
        });
      };
     
	handleClose = () => {
		this.setState({show: false, raw: {
			0: {},
			1: {},
			2: {},
			3: {},
			4: {},
			5: {},
			6: {}
		}})
	}

	handleShow = () => {
		this.setState({show: true})
	}

	checkValidAvailability = (availability) => {
		for (let i = 0; i < availability.length; i++) {
			const item = availability[i]
			if (!item.timeStart || !item.timeEnd) {
				return false
			}

			if (item.timeStart.hour > item.timeEnd.hour) {
				return false
			}

			if (item.timeStart.minute > item.timeEnd.minute) {
				return false
			}
		}

		return true
	}
	handleSave = () => {
		let availability = []
		for (let i = 0; i < 7; i++) {
			if (this.state.raw[i].dayOfWeek !== undefined) {
				availability.push(this.state.raw[i])
			}
		}
		// this.setState({availability}, () => console.log(availability))
		if (this.checkValidAvailability(availability)) {
			this.props.editInfo(this.props.user.email, {"availability": availability})
		} else {
			alert('End time must be greater than start time for one or more dates')
		}
		
	}

	handleChange = (day, mode, time) => {
		let raw = this.state.raw
		if (day === "Monday") {
			let item = raw[1]
			const field = (mode === 'start') ? 'timeStart': 'timeEnd'
			item['dayOfWeek'] = 1
			item[field] = {'hour': time.getHours(), 'minute': time.getMinutes()}
			raw[1] = item
		} else if (day === "Tuesday") {
			let item = raw[2]
			const field = (mode === 'start') ? 'timeStart': 'timeEnd'
			item['dayOfWeek'] = 2
			item[field] = {'hour': time.getHours(), 'minute': time.getMinutes()}
			raw[2] = item
		} else if (day === "Wednesday") {
			let item = raw[3]
			const field = (mode === 'start') ? 'timeStart': 'timeEnd'
			item['dayOfWeek'] = 3
			item[field] = {'hour': time.getHours(), 'minute': time.getMinutes()}
			raw[3] = item
		} else if (day === "Thursday") {
			let item = raw[4]
			const field = (mode === 'start') ? 'timeStart': 'timeEnd'
			item['dayOfWeek'] = 4
			item[field] = {'hour': time.getHours(), 'minute': time.getMinutes()}
			raw[4] = item
		} else if (day === "Friday") {
			let item = raw[5]
			const field = (mode === 'start') ? 'timeStart': 'timeEnd'
			item['dayOfWeek'] = 5
			item[field] = {'hour': time.getHours(), 'minute': time.getMinutes()}
			raw[5] = item
		} else if (day === "Saturaday") {
			let item = raw[6]
			const field = (mode === 'start') ? 'timeStart': 'timeEnd'
			item['dayOfWeek'] = 6
			item[field] = {'hour': time.getHours(), 'minute': time.getMinutes()}
			raw[6] = item
		} else {
			let item = raw[0]
			const field = (mode === 'start') ? 'timeStart': 'timeEnd'
			item['dayOfWeek'] = 0
			item[field] = {'hour': time.getHours(), 'minute': time.getMinutes()}
			raw[0] = item
		}
		this.setState({raw}, () => console.log(this.state))
	}

	render () {
		return (
		<div>
            <Boxed pad="0.2rem" align="left">
                <div className="centerbutton">
                    <Button variant='link' className="edit-button" onClick={this.handleShow} size='sm'>
                        <i className=" icon-plus"/> Change Availability 
                    </Button>
                </div>
            </Boxed>

			<Modal className='edit-modal' show={this.state.show} onHide={this.handleClose} >
			<Modal.Header>
				<Modal.Title>Change availability</Modal.Title>
			</Modal.Header>
			<Modal.Body className="create-request-body">
                    <EditTimeField day="Monday" callback={this.handleChange}></EditTimeField>
                    <EditTimeField day="Tuesday" callback={this.handleChange}></EditTimeField>
                    <EditTimeField day="Wednesday" callback={this.handleChange}></EditTimeField>
                    <EditTimeField day="Thursday" callback={this.handleChange}></EditTimeField>
                    <EditTimeField day="Friday" callback={this.handleChange}></EditTimeField>
                    <EditTimeField day="Saturday" callback={this.handleChange}></EditTimeField>
                    <EditTimeField day="Sunday" callback={this.handleChange}></EditTimeField>
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
	user: state.auth.user
})
export default connect(mapStateToProps, {editInfo})(AvailabilityModal);

