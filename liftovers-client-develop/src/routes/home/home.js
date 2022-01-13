import React from "react";
import { Grid, Layout, Boxed } from "flexibull";
import { withRouter } from 'react-router-dom';
import {
  Header,
  Contain,
  ClearButton,
  Wrapper,
  Square
} from "../../components/styles";
import Logo from "../../assets/liftovers.jpg";
import styled from "styled-components";
import {Link} from "react-router-dom"
import { connect } from "react-redux";
import { logoutUser } from "../../actions/auth"



const LogoHolder = styled.img`
  height: 100px !important;
`;
class Home extends React.Component{
  redirection = (url) => {
    return () => {
      this.props.history.push(url)
    }
  }

  onLogout = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  }

  render() {
    return (<div>Home Page</div>
      // <Layout>
      //   <Wrapper>
      //     <Square />
      //     <Header>
      //       <Contain width="1200px">
      //         <Boxed pad="5px 10px">
      //           <Grid
      //             default="auto 100px 100px 140px"
      //             tablet="auto 100px 100px 140px"
      //             mobile="1fr"
      //             pad="10px"
      //           >
      //             <div>
      //               <LogoHolder
      //                 src={Logo}
      //                 alt="LifTOvers Logo"
      //                 height="100px"
      //               />
      //             </div>
      //             {/* //do we really need a home button in our home page? */}
      //             <ClearButton>Home</ClearButton>
      //             {this.props.auth.isAuthenticated === true ? <ClearButton onClick={this.redirection('/requests')}>Lift Requests</ClearButton>: <ClearButton>About</ClearButton>}
      //             {this.props.auth.isAuthenticated === true ? <ClearButton onClick={this.onLogout}>Logout</ClearButton> : <ClearButton onClick={this.redirection('/login')}>Login</ClearButton>}
      //           </Grid>
      //         </Boxed>
      //       </Contain>
      //     </Header>
      //   </Wrapper>
      // </Layout>
    );


  }

}


const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, { logoutUser })(Home));


