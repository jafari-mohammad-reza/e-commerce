import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import AdminNavbar from "../../components/AdminComponents/Admin.Navbar";
import AdminWidgets from "../../components/AdminComponents/Admin.Widgets";
import AdminCharts from "../../components/AdminComponents/Admin.Chart";
import AdminFeaturedChart from "../../components/AdminComponents/Admin.FeaturedChart";
import Table from "../../components/Table";

export const AdminWrapper = styled.div`
  flex: 6;
  overflow-x: hidden;

`
const Charts = styled.div`
  display: flex;
  padding: .5rem 2rem;
  flex-wrap: wrap;
  gap: 2rem;
`
const ListContainer = styled.div`
  padding: 2rem;
  margin: 2rem;
  -webkit-box-shadow: 2px 4px 10px 1px rgba(0, 0, 0, 0.47);
  box-shadow: 2px 4px 10px 1px rgba(201, 201, 201, 0.47);

  .listTitle {
    font-weight: 500;
    color: gray;
    margin-bottom: 1.5rem;
  }
`
const AdminDashboard = () => {
    const [width, setWidth] = useState(window.innerWidth)
    useEffect(() => {
        setWidth(window.innerWidth)
    }, [window.innerWidth])

    return (
        <AdminWrapper>
            <AdminNavbar/>
            <AdminWidgets/>
            <Charts>
                <AdminFeaturedChart/>
                {width >= 750 && (
                    <AdminCharts/>
                )}
            </Charts>
            <ListContainer>
                <h3 className="listTitle">
                    Latest transactions
                </h3>
                <Table/>
            </ListContainer>
        </AdminWrapper>
    );
};

export default AdminDashboard;