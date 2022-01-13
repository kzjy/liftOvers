import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle 
} from 'reactstrap';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import DT from '../../../src/assets/example.jpg';
import exampleRq from '../../../src/assets/liftovers.jpg';
import ApiUrl from '../../api/config';
import axios from "axios";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="primary" href="https://material-ui.com/">
        LifTOvers
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const RenderCard = ({infoList}) => {
  

  return infoList.map((info, index) => {
    return (
      <div>{info}</div>
    )
  })
}
const exampleRequest = [
    <Card >
      <CardContent style={{
        display:"flex"
      }}>
        <div>
          <img src={exampleRq} className="example" alt="logo" style={{
            width: '128px',
            height: '128px',
            objectFit: 'cover'
          }} />
        </div>
        <div style={{
          paddingLeft: '1rem',
        }}>
          <Typography variant="h5" component="h2">
            Example request 1
          </Typography>
          <Typography variant="body2" component="p">
            example description
          </Typography>
          <div style={{
            paddingTop: '4rem',
          }}> 
          </div>
         
        </div>
      </CardContent>
    </Card>,
    <Card >
    <CardContent style={{
      display:"flex"
    }}>
      <div>
      <img src={exampleRq} className="example" alt="logo" style={{
            width: '128px',
            height: '128px',
            objectFit: 'cover'
          }} />
      </div>
      <div style={{
        paddingLeft: '1rem',
      }}>
        <Typography variant="h5" component="h2">
          Example request 1
        </Typography>
        <Typography variant="body2" component="p">
          example description
        </Typography>
        <div style={{
          paddingTop: '4rem',
        }}> 
        </div>
       
      </div>
    </CardContent>
  </Card>,
  <Card >
    <CardContent style={{
      display:"flex"
    }}>
      <div>
      <img src={exampleRq} className="example" alt="logo" style={{
            width: '128px',
            height: '128px',
            objectFit: 'cover'
          }} />
      </div>
      <div style={{
        paddingLeft: '1rem',
      }}>
        <Typography variant="h5" component="h2">
          Example request 1
        </Typography>
        <Typography variant="body2" component="p">
          example description
        </Typography>
        <div style={{
          paddingTop: '4rem',
        }}> 
        </div>
      
      </div>
      </CardContent>
  </Card>
    ]

const UserAccount = () => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    const bull = <span className={classes.bullet}>•</span>;
    const [volunteerProfileData, setProfileData] = React.useState(null)
    const [volunteerRecordData, setRecordData] = React.useState(null)
    // useEffect(() => {
    //     axios.get(`http://localhost:7000/admin/totalCompleted`).then((data) => {
    //     //console.log(data)
    //     //setNetworkRequestData(data)
    // });
    useEffect(() => {
      axios.get(`${ApiUrl}/volunteer/profile`).then(({ data }) =>{
       
        const name = data.name
        
        const email = data.email
        
        const post_code = data.post_code;
        
        setProfileData(data)
      })
      axios.get(`${ApiUrl}/volunteer/record`).then(({ data }) =>{
        //console.log(data);..
        setRecordData(data);
      })
    }, []);


    


    // const handleChange = (event, newValue) => {
    //     setValue(newValue);
    //   };
    // const bull = <span className={classes.bullet}>•</span>;
    
    const quest_completed = 1111
    
    return (
        <Container component="main" maxWidth="xl">
        <Paper square>
          <Card className={classes.card}>
            <CardContent style={{
              display:"flex"
            }}>
              <div>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  User Profile
                </Typography>
                <img src={DT} className="example" alt="logo" />
              </div>
              <div style={{
                paddingLeft: '1rem',
                paddingTop: '2rem'
              }}>
                <Typography variant="h5" component="h2">
                  DT
                </Typography>
                <Typography variant="body2" component="p">
                  Postal code: 37188
                </Typography>
                <Typography variant="body2" component="p">
                  Availability: Good to go
                </Typography>
                <Typography variant="body2" component="p">
                  Requests completed: 2984
                </Typography>
              </div>
            </CardContent>
          </Card>
          <Paper square>
            <Tabs
              defaultActiveKey = "progress"
              value={value}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChange}
            >
              <Tab label="In-progress" />
              <Tab label="Completed" />
          </Tabs>
          <TabPanel value={value} index={0}>
          
            <RenderCard infoList={exampleRequest} />
    
          </TabPanel>
          <TabPanel value={value} index={1}>
            <RenderCard infoList={exampleRequest} />
          </TabPanel>
          </Paper>
        </Paper>
        <CssBaseline />
      
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>)
}

export default UserAccount