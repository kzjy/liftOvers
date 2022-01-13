import axios from "axios";

import React, { useEffect, useState } from "react";
import {
  Loader,
  FlexiTable,
  FlexiPagination,
  Boxed,
  Grid,
  Input,
  Button
} from "flexibull";
import { Theme } from "flexibull/build/theme";
import styled from "styled-components";
import RequestModal from './createRequestModal'
import { Box } from "@material-ui/core";
import ApiUrl from '../../api/config';
import { removeLifts } from '../../actions/lifts'
import '../../App.css'

export const PageTitle = styled.h3`
  color: ${Theme.PrimaryFontColor};
  margin: 0;
  padding: 10px 0;
`;
const columns = [
  { title: "Status", dataIndex: "status"},
  { title: "Donor", dataIndex: "donorDetails[0].firstName"},
  { title: "Volunteer", dataIndex: "volunteerDetails[0].name"},
  { title: "Donor Location", dataIndex: "donorDetails[0].address"},
  { title: "Food Bank", dataIndex: "foodBankDetails[0].agency"},
  { title: "Lift Date", dataIndex: "availability"},
  { title: "Remove", dataIndex: "button"},
];
const pageOptions = [
  { value: 10, label: "10 Rows" },
  { value: 20, label: "20 Rows" },
  { value: 50, label: "50 Rows" },
  { value: 100, label: "100 Rows" }
];

const state = { show: false }
let model = null

export const Lifts = ({ downloadRequests, getLifts, deleteLifts, lifts, loading }) => {
  useEffect(() => {
    getLifts({ page: 1, limit: 10, display: 'all' });
  }, []);

  
  let { docs, totalDocs, page } = lifts;

  const [showModal, setShowModal] = useState(false)
  return (
    <div data-test="volunteer">
      <Boxed pad="5px 0">
        <PageTitle data-test="title">Lifts</PageTitle>
      </Boxed>
      <Boxed>
        <Grid
          default="50% 50%"
          tablet="60% 40%"
          mobile="100%"
          padHorizontal="0"
        >
          <Grid
            default="65% 35%"
            tablet="65% 35%"
            mobile="60% 40%"
            padHorizontal="0"
          >
            
            <Boxed pad="0.2rem 0 0.2rem 0.15rem" />
          </Grid>
          
          <Grid default="100%" tablet="100%" mobile="100%">
            
            <Boxed pad="0.2rem" style={{display:"flex", flexDirection:"row", marginLeft:'auto'}} align="right">
                <RequestModal> </RequestModal>
                <div style={{padding:"0.2rem"}}>
                  <Button onClick={() => { 
                    downloadRequests()
                  }}>
                    <i tyle={{padding:"0.2rem"}} className="icon-angle-down gFPpeB" /> Download Requests
                  </Button>
                </div>
                
            </Boxed>
            
          </Grid>
        </Grid>
      </Boxed>
      <Boxed>
        {loading ? (
          <Loader />
        ) : (
          
            <FlexiTable columns={columns} data={docs} rowKey={"_id"}>
              {lifts.docs ? lifts.docs.forEach(elem => elem.button = <div style={{ textAlign: "center" }}><Button className='removeBtn' onClick={deleteLifts.bind(this, elem)} style={{ background: "rgba(237, 86, 78, 0.5)", width: "80px", justifyContent: "true" }}>Remove</Button></div>) : lifts.docs}
            <FlexiPagination
              total={totalDocs}
              onChange={newPage => getLifts({ page: newPage, limit: 10, display: 'all'})}
              current={page}
              pageCounts={pageOptions}
              pageSize={10}
              showTotal={(total, range) => {
                return `${range[0]} - ${range[1]} of ${total} items`;
              }}
            />
            
          </FlexiTable>
          
        )}
        
      </Boxed>
    </div>
  );
};

 //export default Lifts;
