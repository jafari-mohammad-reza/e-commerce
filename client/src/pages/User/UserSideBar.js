import React, {useState} from 'react';
import styled from "styled-components";
import {RiDashboardFill, RiInformationLine, RiListOrdered, RiLogoutBoxRLine, RiTicket2Line} from "react-icons/ri";
import {BsSave2} from "react-icons/bs";
import {Link} from "react-router-dom";
import {logout, selectCurrentToken} from "../../app/features/auth/authSlice"
import {useDispatch, useSelector} from "react-redux";

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

const UserSideBar = () => {
    const [isLightTheme, setIsLightTheme] = useState(true)
    const dispatch = useDispatch()
    const token = useSelector(selectCurrentToken)
    return (

        <Wrapper>
            <TopWrapper><img src={'/images/logo.png'} alt={'logo'}/></TopWrapper>
            <CenterWrapper>
                <ul>
                    <h4>Main</h4>
                    <Link to={"/profile"}>
                        <li><RiDashboardFill/><span>Dashboard</span></li>
                    </Link>
                    <h4>List</h4>
                    <Link to={"/profile/orders"}>
                        <li><RiListOrdered/><span>orders</span></li>
                    </Link>
                    <Link to={"/profile/change-info"}>
                        <li><RiInformationLine/><span>change-info</span></li>
                    </Link> <Link to={"/profile/tickets"}>
                    <li><RiTicket2Line/><span>tickets</span></li>
                </Link> <Link to={"/profile/marked"}>
                    <li><BsSave2/><span>marked</span></li>
                </Link>

                    <a href={'/'}>
                        <li onClick={async () => {
                            dispatch(logout())
                        }}><RiLogoutBoxRLine/><span>Logout</span></li>
                    </a>


                </ul>
            </CenterWrapper>
        </Wrapper>
    );
};


export default UserSideBar;