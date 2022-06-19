import React from "react";
import {Route, Routes} from "react-router-dom";
import styled from "styled-components";
import NotFound from "../NotFound";
import MainDashboard from "./Admin.Dashboard";
import AdminProductsPage from "./Admin.Products";
import SidePanel from "./SidePannel";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
`;
const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
`;
const AdminDashboard = () => {
    return (
        <Wrapper>
            <SidePanel/>
            <MainWrapper>
                <Routes>
                    <Route path="/" element={<MainDashboard/>}/>
                    <Route path="/products" element={<AdminProductsPage/>}/>
                    <Route path="/categories" element={<div>Admin cc</div>}/>
                    <Route path="/orders" element={<div>Admin oo</div>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </MainWrapper>
        </Wrapper>
    );
};

export default AdminDashboard;
