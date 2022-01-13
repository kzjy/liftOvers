import React from 'react';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import ApiUrl from '../../api/config';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

function addStyleSheet(fileName) {

    var head = document.head;
    var link = document.createElement("link");
  
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = fileName;
  
    head.appendChild(link);
  }
  
  addStyleSheet('https://fonts.googleapis.com/icon?family=Material+Icons');


class Completed extends React.Component {
    constructor(props) {
        super(props);
        this.classes = makeStyles(theme => ({
            button: {
              margin: theme.spacing(1),
            },
          }));;
        this.state = {
          data: [],
          original: []
        }
        this.deliverClick = this.deliverClick.bind(this)
      }

      componentDidMount() {
        
        axios.get(`${ApiUrl}/volunteer/record?email=${this.props.auth.user.email}`, {withCredentials: true})
          .then(response => {
            let filtered = [];
            response.data.forEach(function(element) {
            
              let min = "";
              let meridiem = "";
              let hour = "";
              if (element.availability.time.minute < 10) {
                min = "0" + (element.availability.time.minute).toString()
              } else {
                min = (element.availability.time.minute).toString()
              }
              if (element.availability.time.hour > 11) {
                meridiem = "PM"
                if (element.availability.time.hour > 12) {
                  hour = (element.availability.time.hour - 12).toString()
                } else {
                  hour = (element.availability.time.hour).toString()
                }
              } else {
                meridiem = "AM";
                hour = (element.availability.time.hour).toString()
              }
              if (element.status === "Complete") {
                filtered.push({id: element._id, donor: element.donorDetails[0].firstName + " " + element.donorDetails[0].lastName, 
                    pickup: element.donorDetails[0].address, dropoff: element.foodBankDetails[0].address, 
                    date: element.availability.date.year + "-" + element.availability.date.month + "-" + element.availability.date.day,
                    time: hour + ":" + min + " " + meridiem, contact: element.donorDetails[0].email})
                }
            });
            this.setState({
              data: filtered,
              original: response.data
            })
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
          .finally(function () {
            // always executed
          });
        }
    
/*
Parse incoming sms, calling diff functions
Sample request format: 
{
    "Body": //yes to accept//no to decline//cancel lift to cancel from donor//cannot complete to cancel from volunteer//complete to complete lift//everything else is error
    "From": "+16231232323" // Phone number of volunteer

    // If making request from web, include lift_id of which one to accept
    "_id": "some id"
}
*/


    deliverClick() {
      // axios post to update the status from incomplete to inprogress
      let phone = "+1" + this.props.auth.user.phone
      axios.post(`${ApiUrl}/lift/sms`, {
        Body: "yes",
        From: phone,
        _id: this.deliverClick.data.id
      })
      .then(res => {
        axios.get(`${ApiUrl}/volunteer/record?email=${this.props.auth.user.email}`, {withCredentials: true})
          .then(response => {
            let filtered = [];
            response.data.forEach(function(element) {
              let min = "";
              let meridiem = "";
              let hour = "";
              if (element.availability.time.minute < 10) {
                min = "0" + (element.availability.time.minute).toString()
              } else {
                min = (element.availability.time.minute).toString()
              }
              if (element.availability.time.hour > 11) {
                meridiem = "PM"
                if (element.availability.time.hour > 12) {
                  hour = (element.availability.time.hour - 12).toString()
                } else {
                  hour = (element.availability.time.hour).toString()
                }
              } else {
                meridiem = "AM";
                hour = (element.availability.time.hour).toString()
              }
              if (element.status === "Complete") {
                filtered.push({id: element._id, donor: element.donorDetails[0].firstName + " " + element.donorDetails[0].lastName, 
                    pickup: element.donorDetails[0].address, dropoff: element.foodBankDetails[0].address, 
                    date: element.availability.date.year + "-" + element.availability.date.month + "-" + element.availability.date.day,
                    time: hour + ":" + min + " " + meridiem, contact: element.donorDetails[0].email})
              }
            });
            this.setState({
              data: filtered,
              original: response.data
            })
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
          .finally(function () {

          });
          console.log(res)
      })
      .catch(function (error) {
        console.log(error);
      });
    }


    render() {
    
      return (
        <MaterialTable
          columns={[
            { title: 'Donor Name', field: 'donor' },
            { title: 'Pickup Location', field: 'pickup' },
            { title: 'Dropoff Location', field: 'dropoff' },
            { title: 'Date', field: 'date' },
            { title: 'Time', field: 'time' },
            { title: 'Donor Contact', field: 'contact'}
          ]}
          data={this.state.data}
          rowKey={"_id"}
          title="Lift Requests"
        />
      )
    }
  }

  const mapStateToProps = state => ({
    auth: state.auth,
  });

  export default withRouter(connect(mapStateToProps)(Completed));