import React from 'react';
import styled from "styled-components";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis} from "recharts"

const Wrapper = styled.div`
  flex: 5;
  -webkit-box-shadow: 2px 4px 10px 1px rgba(0, 0, 0, 0.47);
  box-shadow: 2px 4px 10px 1px rgba(201, 201, 201, 0.47);
  padding: 1rem;
  color: gray;
`
const data = [
    {name: "January", total: 3243},
    {name: "February", total: 6435},
    {name: "March", total: 25645},
    {name: "April", total: 4236},
    {name: "May", total: 35456},
    {name: "June", total: 5466},
];
const AdminChart = () => {
    return (
        <Wrapper>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={450}
                    height={350}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <Line type="monotoneX" dataKey="total" stroke="#8884d8" activeDot={{r: 8}}/>
                </LineChart>
            </ResponsiveContainer>
        </Wrapper>
    );
};

export default AdminChart;