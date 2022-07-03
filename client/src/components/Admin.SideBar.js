import React, {useState} from 'react';
import styled from "styled-components";
import {
    RiDashboardFill,
    RiFileList3Line,
    RiLightbulbFlashLine,
    RiLightbulbLine,
    RiLogoutBoxRLine,
    RiNotification3Line,
    RiPercentLine,
    RiProductHuntLine,
    RiSettings3Line,
    RiUser3Line
} from "react-icons/ri";
import {ImBlog, ImCreditCard, ImStatsDots} from "react-icons/im";
import {MdCategory} from "react-icons/md";
import {Link} from "react-router-dom";

const Wrapper = styled.div`
  flex: 1;
  padding: 4rem 0;
  border-right: 0.5px solid rgba(200, 162, 103, 0.76);
  min-height: 100vh;
  background-color: #ffff;
`
const TopWrapper = styled.div`
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 10rem;
    height: auto;
    object-fit: contain;
    margin-bottom: 1rem;
    border-bottom: .3px solid rgb(230, 227, 227);
  }

  margin-bottom: 3rem;
`
const CenterWrapper = styled.div`
  padding-left: 1rem;

  h4 {
    font-size: 1.6rem;
    font-weight: bold;
    color: #999;
    margin-top: 1.5rem;
    margin-bottom: 2rem;
    margin-left: .4rem;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: start;
    padding: .5rem;
    cursor: pointer;
    transition: background-color .2s ease-in;
    margin-bottom: 1.5rem;

    &:hover {
      background-color: rgba(200, 162, 103, 0.93);

      svg {
        color: #f1f1f1;
      }
    }

    svg {
      font-size: 1.8rem;
      color: rgba(200, 162, 103, 0.95);
    }

    span {
      font-size: 1.4rem;
      font-weight: 800;
      color: #888;
      margin-left: 1rem;
    }
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .themeSwitcher {
    width: 50%;
    margin: 3rem auto;
    position: relative;

    &:hover {
      background-color: #ffff;

      svg {
        color: rgba(200, 162, 103, 0.95);
      }
    }

    svg {
      font-size: 3rem;
    }
  }
`
const BottomWrapper = styled.div``

const AdminSideBar = () => {
    const [isLightTheme, setIsLightTheme] = useState(true)
    return (
        <Wrapper>
            <TopWrapper><img src={'/images/logo.png'} alt={'logo'}/></TopWrapper>
            <CenterWrapper>
                <ul>
                    <h4>Main</h4>
                    <Link to={"/admin"}>
                        <li><RiDashboardFill/><span>Dashboard</span></li>
                    </Link>
                    <h4>List</h4>
                    <Link to={"/admin/Products"}>
                        <li><RiProductHuntLine/><span>Products</span></li>
                    </Link>
                    <Link to={"/admin/Categories"}>
                        <li><MdCategory/><span>Categories</span></li>
                    </Link>
                    <Link to={"/admin/Blogs"}>
                        <li><ImBlog/><span>Blogs</span></li>
                    </Link>

                    <Link to={"/admin/Users"}>
                        <li><RiUser3Line/><span>Users</span></li>
                    </Link>

                    <Link to={"/admin/Orders"}>
                        <li><ImCreditCard/><span>Orders</span></li>
                    </Link>

                    <Link to={"/admin/Discounts"}>
                        <li><RiPercentLine/><span>Discounts</span></li>
                    </Link>
                    <h4>Services</h4>

                    <Link to={"/admin/Stats"}>
                        <li><ImStatsDots/><span>Stats</span></li>
                    </Link>

                    <Link to={"/admin/Notifications"}>
                        <li><RiNotification3Line/><span>Notifications</span></li>
                    </Link>

                    <Link to={"/admin/Logs"}>
                        <li><RiFileList3Line/><span>Logs</span></li>
                    </Link>

                    <Link to={"/admin/Settings"}>
                        <li><RiSettings3Line/><span>Settings</span></li>
                    </Link>

                    <Link to={"/admin/Logout"}>
                        <li><RiLogoutBoxRLine/><span>Logout</span></li>
                    </Link>
                    {isLightTheme ? (<li onClick={() => setIsLightTheme(!isLightTheme)} className={'themeSwitcher'}>
                            <RiLightbulbLine/></li>) :
                        <li onClick={() => setIsLightTheme(!isLightTheme)} className={'themeSwitcher'}>
                            <RiLightbulbFlashLine/></li>}

                </ul>
            </CenterWrapper>
            <BottomWrapper></BottomWrapper>
        </Wrapper>
    );
};

export default AdminSideBar;