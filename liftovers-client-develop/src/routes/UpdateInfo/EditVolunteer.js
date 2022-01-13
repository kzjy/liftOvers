import React from 'react'
import { connect } from 'react-redux'
import { Boxed, Grid} from 'flexibull'
import { Form , Button, Dropdown, DropdownButton, ButtonGroup} from 'react-bootstrap'
import { Theme } from "flexibull/build/theme";
import { editInfo } from '../../actions/volunteer'
import styled from "styled-components";
import './EditVolunteer.css'

export const PageTitle = styled.h3`
  color: ${Theme.PrimaryFontColor};
  margin: 0;
  padding: 10px 0;
`;


class EditVolunteer extends React.Component {

    state = {
        email: '',
        selected: 'Name',
        value: ''
    }

    handleChange = (e) => {
        console.log(e.target)
        console.log(e.target.innerText)
        this.setState({selected: e.target.innerText}, () => console.log(this.state))
    }

    handleEmail = (e) => {
        this.setState({email: e.target.value})
    }

    handleValue = (e) => {
        this.setState({value: e.target.value})
    }

    submitChange = (e) => {
        e.preventDefault()
        let field = 'name'
        if (this.state.selected === 'Name') {
            field = 'name'
        } else if (this.state.selected === 'Phone') {
            field = 'phone'
        } else if (this.state.selected === 'Password') {
            field = 'password'
        } else if (this.state.selected === 'Postal Code') {
            field = 'postalCode'
        } else {
            field = 'role'
        }
        const update = {[field]: this.state.value}
        // this.props.editInfo(this.props.auth.user.email, update)
        this.props.editInfo(this.state.email, update)
    }
    
    getPlaceHolder = () => {
        if (this.state.selected === 'Name') {
            return 'Enter new name eg. Firstname Lastname'
        } else if (this.state.selected === 'Password') {
            return 'Enter new password eg. password123'
        } else if (this.state.selected === 'Phone') {
            return 'Enter new phone number eg. 1234567' 
        } else if (this.state.selected === 'Postal Code') {
            return 'Enter new postal code eg. M9U 9N1'
        } else if (this.state.selected === 'Role') {
            return 'Enter either volunteer or admin eg. admin'
        }
    }

    render = () => {
        return (
            <div>
                <Boxed pad="5px 0">
                    <PageTitle data-test="title">Edit Volunteer Information</PageTitle>
                    
                </Boxed>
                
                <Boxed pad="5px 0">
                    <Grid default="50% 50%" tablet="60% 40%" mobile="100%" padHorizontal="0">

                        <div className="edit-volunteer-container">
                            <Form>
                                
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Email address of volunteer</Form.Label>
                                        <Form.Control value={this.state.email} onChange={this.handleEmail} type="email" placeholder="Enter email"/>
                                    </Form.Group>
                                

                                
                                <Form.Group controlId="formBasicSelect">
                                    <Form.Label>Field to Update</Form.Label>
                                    <div></div>
                                    <ButtonGroup justified="true">
                                    <DropdownButton className="edit-volunteer-field-button btn-block" block="true" id="dropdown-basic-button" title={this.state.selected}>
                                        <Dropdown.Item href="#/name" value="Name" onClick={this.handleChange}>Name</Dropdown.Item>
                                        <Dropdown.Item href="#/password" value="Password" onClick={this.handleChange}>Password</Dropdown.Item>
                                        <Dropdown.Item href="#/phone" value="Phone" onClick={this.handleChange}>Phone</Dropdown.Item>
                                        <Dropdown.Item href="#/postalCode" value="Postal Code" onClick={this.handleChange}>Postal Code</Dropdown.Item>
                                        <Dropdown.Item href="#/role" value="Role" onClick={this.handleChange}>Role</Dropdown.Item>
                                    </DropdownButton>
                                    </ButtonGroup>
                                    
                                    
                                </Form.Group>
                                {/* </div> */}


                                
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>New Info</Form.Label>
                                    <Form.Control value={this.state.value} onChange={this.handleValue} placeholder={this.getPlaceHolder()}/>
                                </Form.Group>
                                
                                <hr/>
                                <Button onClick={this.submitChange}className="btn-block" variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </div>

                    </Grid>
                </Boxed>
            </div>
        )
    }
}

export default connect(null, {editInfo})(EditVolunteer)