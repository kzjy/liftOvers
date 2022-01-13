import React from "react";
import { BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import Login from "./routes/login";
import Dashboard from "./routes/dashboard";
import Volunteers from "./routes/volunteer";
import Lifts from "./routes/lifts";
import { AdminLayout } from "./components/admin";
import { UserLayout } from "./components/user";
import { DefaultLayout } from "./components/default";
import SignUp from "./routes/signup";
import Request from "./routes/request/request";
import InProgress from "./routes/request/inProgress";
import Completed from "./routes/request/completed";
import RequestList from "./routes/requestlist";
import Logout from "./routes/logout";
import Edit from "./routes/edit";
import UserAccount from "./routes/userAccount";
import FoodBanks from './routes/foodbanks'
import Donors from "./routes/donors";
import EditVolunteer from './routes/UpdateInfo'
import {connect} from 'react-redux'
import {verifyUser} from './actions/auth'

// console.log(window.location.pathname);
class App extends React.Component {

    componentDidMount = () => {
        this.props.verifyUser()
    }

    render () {

        if (window.location.pathname === `/signup`){
            return(
                <Router>
                {/* Login / Signup Routes */}
                <Route exact path="/">
                    <DefaultLayout>
                        <Login/>
                    </DefaultLayout>
                </Route>
                <Route exact path="/login">
                    <DefaultLayout>
                        <Login />
                    </DefaultLayout>
                </Route>
                <Route exact path="/signup">
                    <DefaultLayout>
                        <SignUp />
                    </DefaultLayout>
                </Route>

            </Router>
            )
            
        }
       

        if (!this.props.auth.isAuthenticated) {
            return (
                <Router>
                {/* Login / Signup Routes */}
                <Route exact path="/">
                    <DefaultLayout>
                        <Login/>
                    </DefaultLayout>
                </Route>
                <Route exact path="/login">
                    <DefaultLayout>
                        <Login />
                    </DefaultLayout>
                </Route>
                <Route exact path="/signup">
                    <DefaultLayout>
                        <SignUp />
                    </DefaultLayout>
                </Route>
                <Route path = "/">
                    <Redirect to="/login"/>
                </Route>

            </Router>)
        }

        if (this.props.auth.user.role === "admin") {
            return (
                <Router>
                    {/* Login / Signup Routes */}
                    <Route exact path="/">
                        <DefaultLayout>
                            <Login />
                        </DefaultLayout>
                    </Route>
                    <Route exact path="/login">
                        <DefaultLayout>
                            <Login />
                        </DefaultLayout>
                    </Route>
                    <Route exact path="/signup">
                        <DefaultLayout>
                            <SignUp />
                        </DefaultLayout>
                    </Route>

                    {/* Admin Account Routes */}

                    <Route exact path="/dashboard">
                        <AdminLayout>
                            <Dashboard />
                        </AdminLayout>
                    </Route>
                    <Route exact path="/volunteers">
                        <AdminLayout>
                            <Volunteers />
                        </AdminLayout>
                    </Route>
                    <Route exact path="/lifts">
                        <AdminLayout>
                            <Lifts />
                        </AdminLayout>
                    </Route>
                    <Route exact path="/request">
                        <AdminLayout>
                            <Request />
                        </AdminLayout>
                    </Route>
                    <Route exact path="/edit">
                        <AdminLayout>
                            <Edit />
                        </AdminLayout>
                    </Route>
                    <Route exact path="/foodbanks">
                        <AdminLayout>
                            <FoodBanks />
                        </AdminLayout>
                    </Route>
                    <Route exact path="/donors">
                        <AdminLayout>
                            <Donors />
                        </AdminLayout>
                    </Route>
                    <Route exact path="/editVolunteer">
                        <AdminLayout>
                            <EditVolunteer />
                        </AdminLayout>
                    </Route>
                    <Route exact path="/logout">
                        <AdminLayout>
                            <Logout />
                        </AdminLayout>
                    </Route>
                </Router>
            )
        } else {
            return (
                <Router>
                    {/* Login / Signup Routes */}
                    <Route exact path="/">
                        <DefaultLayout>
                            <Login />
                        </DefaultLayout>
                    </Route>
                    <Route exact path="/login">
                        <DefaultLayout>
                            <Login />
                        </DefaultLayout>
                    </Route>
                    <Route exact path="/signup">
                        <DefaultLayout>
                            <SignUp />
                        </DefaultLayout>
                    </Route>
                    

                    {/* User Account Routes */}
                    <Route exact path="/inprogress">
                        <UserLayout>
                            <InProgress />
                        </UserLayout>
                    </Route>
                    <Route exact path="/completed">
                        <UserLayout>
                            <Completed />
                        </UserLayout>
                    </Route>
                    <Route exact path="/requests">
                        <UserLayout>
                            <RequestList />
                        </UserLayout>
                    </Route>
                    <Route exact path="/logout">
                        <UserLayout>
                            <Logout />
                        </UserLayout>
                    </Route>
                    <Route exact path="/user">
                        <UserLayout>
                            <UserAccount />
                        </UserLayout>
                    </Route>
                    <Route exact path="/edit">
                        <UserLayout>
                            <Edit />
                        </UserLayout>
                    </Route>
                </Router>
            )}
        
    }
    
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {verifyUser})(App);
