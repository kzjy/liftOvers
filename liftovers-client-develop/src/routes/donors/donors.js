import React, { useEffect } from "react";
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

export const PageTitle = styled.h3`
  color: ${Theme.PrimaryFontColor};
  margin: 0;
  padding: 10px 0;
`;

const columns = [
    { title: "First Name", dataIndex: "firstName" },
    { title: "Last Name", dataIndex: "lastName" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Address", dataIndex: "address" },
    { title: "Special Notes", dataIndex: "notes" },
    { title: "Remove", dataIndex: "button"}
  ];

const pageOptions = [
    { value: 10, label: "10 Rows" },
    { value: 20, label: "20 Rows" },
    { value: 50, label: "50 Rows" },
    { value: 100, label: "100 Rows" }
];

export const Donors = ({ downloadRequests, getDonors, donors, loading}) => {
    
     useEffect(() => {
        getDonors({page: 1, limit: 10});
    }, []);
    let { docs, totalDocs, page } = donors;

    return (
        <div>
            <Boxed pad='5px 0'>
                <PageTitle>Donors</PageTitle>
            </Boxed>
            <Boxed>
                <Grid
                    default='50% 50%'
                    tablet='60% 40%'
                    mobile='100%'
                    padHorizontal='0'
                >
                    <Grid
                        default="65% 35%"
                        tablet="65% 35%"
                        mobile="60% 40%"
                        padHorizontal="0"
                    >
                        {/* <Boxed pad="0.2rem 0.15rem 0.2rem 0">
                            <Input type="search" />
                        </Boxed> */}
                        <Boxed pad="0.2rem 0 0.2rem 0.15rem" />
                    </Grid>
                    <Grid default="100%" tablet="100%" mobile="100%">

                        <Boxed pad="0.2rem" align="right">
                            <Button onClick={() => { 
                                downloadRequests()
                            }}>
                                <i className="icon-angle-down" /> Download Donors 
                            </Button>
                        </Boxed>
                        
                    </Grid>
                </Grid>
            </Boxed>

            <Boxed>
                {loading ? (<Loader />) : (
                    <FlexiTable columns={columns} data={docs || []} rowKey={"_id"}>
                        <FlexiPagination 
                            total={totalDocs}
                            onChange={page => getDonors({page, limit: 10 })}
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
    )
}