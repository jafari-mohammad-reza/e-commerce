import React from 'react';
import styled from "styled-components";
import {RiChat3Line, RiFileList3Line, RiLightbulbLine, RiNotification3Line, RiSearch2Line} from "react-icons/ri";
import {Link} from "react-router-dom";

const Nav = styled.nav`
  height: 5.5rem;
  border-bottom: 0.5px solid rgba(231 228 228);
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  color: #555;
`
const Wrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 2rem;
  justify-content: space-between;
`
const ItemsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const Item = styled(Link)`
  margin-right: 1.8rem;
  cursor: pointer;
  position: relative;

  .counter {
    width: 1.6rem;
    height: 1.6rem;
    background-color: rgba(200, 162, 103, 0.95);
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: bold;
    position: absolute;
    top: -5px;
    right: -5px;
  }

  svg {
    color: #888;
    font-size: 2.3rem;
  }
`
const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 0.5px solid lightgray;
  padding: .5rem;
`
const SearchBox = styled.input`
  border: none;
  outline: none;
  background-color: transparent;
  color: #c8a267;

  &::placeholder {
    font-size: 1.2rem;
  }
`
const AdminNavbar = () => {
    return (
        <Nav>
            <Wrapper>
                <SearchWrapper>
                    <SearchBox type={'text'} placeholder={'Search....'}/>
                    <RiSearch2Line/>
                </SearchWrapper>
                <ItemsWrapper>
                    <Item to={"#"}><RiLightbulbLine/></Item>
                    <Item to={"/admin/notifications"}><RiNotification3Line/> <span className="counter">0</span></Item>
                    <Item to={"/admin/messages"}><RiChat3Line/> <span className="counter">0</span> </Item>
                    <Item to={"/admin/logs"}><RiFileList3Line/></Item>
                </ItemsWrapper>
            </Wrapper>
        </Nav>
    );
};

export default AdminNavbar;