import React, {useState} from 'react'
import './edit.css'
import {Modal} from "react-bootstrap"
import {FormGroup, FormControl} from "react-bootstrap";
import {
    Boxed,
    Button
  } from "flexibull";
  import DatePicker from 'react-datepicker'
  import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { withRouter, Redirect } from 'react-router-dom';
class EditTimeField extends React.Component{
  	state = {
        show: false,
        startTime: null,
        endTime: null
      }
    
    startHandleChange = time => {
        this.setState({
          startTime: time
        }, () => {
          this.props.callback(this.props.day, 'start', this.state.startTime)
        });
      };

      endHandleChange = time => {
        this.setState({
          endTime: time
        }, () => {
          this.props.callback(this.props.day, 'end', this.state.endTime)
        });
      };
      
     
     

	render () {
		return (
		<>
            <span className= 'create-request-text'>{`${this.props.day}:`}</span>
            <FormGroup>
                Start time:
                <DatePicker
                onChange={this.startHandleChange}
                selected={this.state.startTime}
                className="time"
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeFormat="HH:mm"
                dateFormat="hh:mm"
                placeholderText="Click to select a time"
                />
            </FormGroup>
            <FormGroup>
                End time:
                <DatePicker
                onChange={this.endHandleChange}
                selected={this.state.endTime}
                className="time"
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeFormat="HH:mm"
                dateFormat="hh:mm"
                placeholderText="Click to select a time"
                />
            </FormGroup>
        </>  
        )
        }
}


const mapStateToProps = state => ({
  volunteers: state.volunteers,
});

export default withRouter(connect(mapStateToProps)(EditTimeField));
