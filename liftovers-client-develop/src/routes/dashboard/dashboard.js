import React from "react";
import { 
  Card,
  DSBarChart,
  Grid,
  Boxed
} from "flexibull";
import { Theme } from "flexibull/build/theme";
import styled from 'styled-components';
import { connect } from "react-redux";
import { withRouter, Redirect } from 'react-router-dom';
import { getTotalCompleted, getTotalCancelled, getTotalIncomplete, getTotalVolunteers, getTotalMonths } from '../../actions/dashboard'



const PageTitle = styled.h3`
  color: ${Theme.PrimaryFontColor};
  margin: 0;
  padding: 10px 0;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 100%;
  margin: 0;
`;

const StatscardContainer = styled.div`
  display: flex;
  width: 100%;
`;

const Statscard = styled(Card)`
  flex: 1 1 auto;
  margin: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1);
`;

const BarchartContainer = styled.div`
  padding-top: 5vh;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1);
  padding: 30px;
  flex-grow: 2;
  max-width: calc(100vw - 310px);
`;

const BarTitle = styled.p`
  text-align: center;
  opacity: 0.6;
  color: #314659;
`;

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      
    };
  }

  componentDidMount() {
    this.props.getTotalCompleted()
    this.props.getTotalCancelled()
    this.props.getTotalIncomplete()
    this.props.getTotalVolunteers()
    this.props.getTotalMonths()
  }

  render() {
    return (
      <div>
        <Boxed pad="5px 0">
          <PageTitle data-test="title">Dashboard</PageTitle>
        </Boxed>
        <StatsContainer>
          <StatscardContainer>
            <Statscard title="Completed Lifts" value={this.props.dashboard.total_completed} color={Theme.PrimaryColor} icon="icon-gauge" />
            <Statscard title="Cancelled Lifts" value={this.props.dashboard.total_cancelled} color={Theme.PrimaryColor} icon="icon-gauge" />
            <Statscard title="Incomplete Lifts" value={this.props.dashboard.total_incomplete} color={Theme.PrimaryColor} icon="icon-gauge" />
            <Statscard title="Volunteers" value={this.props.dashboard.total_volunteers} color={Theme.PrimaryColor} icon="icon-gauge" />
          </StatscardContainer>
          <BarchartContainer>
            {/* {console.log(this.props.dashboard.total_months)} */}
            <DSBarChart
              chartTitle="How many donations per month"
              xData={["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]}  
              yData={[{ title: "Number Donations", color: Theme.PrimaryColor, data: this.props.dashboard.total_months }]}
              height={400}
            />
            <BarTitle>How many donations per month</BarTitle>
          </BarchartContainer>
        </StatsContainer>
      </div>
    )
  }
}
 

const mapStateToProps = state => ({
  auth: state.auth,
  dashboard: state.dashboard
});

export default withRouter(connect(mapStateToProps, { getTotalCompleted, getTotalCancelled, getTotalIncomplete, getTotalVolunteers, getTotalMonths })(Dashboard));
