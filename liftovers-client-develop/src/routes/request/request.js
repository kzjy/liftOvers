import React from 'react';
import { connect } from "react-redux";
import './request.css';
import { withRouter } from 'react-router-dom';


const request = {title: '(request)', description: '(description)', address: '123 Street', availability: '24/7', img: '(image)'};

class Request extends React.Component {
    accept = () => {

    }

    render() {
        return (
        <div class='container'>
            {//<div class='title'>{request.title}</div>
            }
            <div class='info'>
                <div class='img'>{request.img}</div>
                <div class='desc'>{request.description}</div>
            </div>
            
            <div class='label'>
                {/**
                <div class='labels'>                
                    <div>Address: </div>
                    <div>Availability: </div>
                </div>
                <div class='user'>
                    <div>{request.address}</div>
                    <div>{request.availability}</div>
                </div>
                */}
                <div class='buttons'>
                    <button class='button' onclick={this.accept}>Accept Request</button>
                </div>
            </div>
        </div>
        )
    }
        
}

const mapStateToProps = state => ({
    auth: state.auth
});

//export default Request;
export default withRouter(connect(mapStateToProps)(Request));