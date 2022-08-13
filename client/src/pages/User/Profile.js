import React from 'react';
import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import UserSideBar from "./UserSideBar";
import ProfileDashboard from "./ProfileDashboard";
import ProfileInfo from "./ProfileInfo";
import ProfileOrders from "./ProfileOrders";
import ProfileTickets from "./ProfileTickets";
import ProfileMarked from "./ProfileMarked";

const Profile = () => {
    return (
        <Wrapper>
            <UserSideBar/>
            <Routes>
                <Route path={"/"} index element={<ProfileDashboard/>}/>
                <Route path={"/change-info"} element={<ProfileInfo/>}/>
                <Route path={"/orders"} element={<ProfileOrders/>}/>
                <Route path={"/tickets"} element={<ProfileTickets/>}/>
                <Route path={"/marked"} element={<ProfileMarked/>}/>

            </Routes>
        </Wrapper>
    );
};
const Wrapper = styled.div`
  display: flex;
  overflow: hidden;
`
export const ProfileWrapper = styled.div`
  flex: 6;
  overflow-x: hidden;
`

export default Profile;