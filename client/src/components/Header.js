import React, {useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {AiOutlineHeart, AiOutlineShopping,} from "react-icons/ai";

const Wrapper = styled.header`
  padding: 1.5rem 5rem;
  position: relative;
  min-height: 7rem;
`;
const List = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const Logo = styled.img`
  width: auto;
  height: 10rem;
  object-fit: contain;
  @media (max-width: 768px) {
    height: 7rem;
  }
`;
const MainItemsWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;

  li {
    margin-right: 4rem;
    transition: all 2s ease-in-out;
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

const SideBarButton = styled.button`
  background-color: #fff;
  border: #c8a267 1px solid;
  color: #595959;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  text-align: center;
  position: absolute;
  right: 3rem;
  top: 3rem;
  display: none;
  z-index: 20;
  @media (max-width: 768px) {
    display: block;
  }
`;
const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const IconWrapper = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 2.5rem;
  padding: 1.2rem;
  color: #595959;
  border: #c8a267 solid 1px;
  border-radius: 1.5rem;
  margin-right: 1.5rem;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;
  &:hover {
    background-color: #c8a267;
    color: #fff;
  }
  span {
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: block;
    text-align: center;
    font-size: 1rem;
    padding: 0.5rem;
    background-color: #ff4d4d;
    color: #fff;
    position: absolute;
    top: -1rem;
    right: 0.2rem;
  }
  @media (max-width: 768px) {
    /* font-size: 2rem; */
    margin-top: 1.5rem;
  }
`;
const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    font-size: 2rem;
    font-weight: 600;
    color: #595959;
    &:hover::before {
      width: 100%;
    }
    &::before {
      content: "";
      display: block;
      width: 0;
      height: 2px;
      background-color: #c8a267;
      transition: width 0.3s ease-in-out;
    }
  }
`;

export default function Header() {
    const [isClicked, setIsClicked] = useState(false);
    return (
        <Wrapper>
            <List>
                <Link to="/">
                    <Logo src="/images/logo.png" alt="Website logo"/>
                </Link>
                <MainItemsWrapper isClicked={isClicked}>
                    <ListItem>
                        <Link to={"/hotItems"}>Hot🔥</Link>
                    </ListItem>
                    <ListItem>
                        <Link to={"/hotItems"}>Discounts</Link>
                    </ListItem>
                    <ListItem>
                        <Link to={"/categories"}>Categories</Link>
                    </ListItem>
                    <ListItem>
                        <Link to={"/contact"}>Contact</Link>
                    </ListItem>
                </MainItemsWrapper>
                <FlexWrapper>
                    <Link to={"/cart"}>
                        <IconWrapper>
                            <span>0</span>
                            <AiOutlineShopping/>
                        </IconWrapper>
                    </Link>
                    <Link to="/liked">
                        <IconWrapper>
                            <AiOutlineHeart/>
                        </IconWrapper>
                    </Link>
                    {/* <Link to="/profile">
            <IconWrapper>
              //? show user icon while use ris logged in and show login or register links while nots
              <AiOutlineUser />
            </IconWrapper>
          </Link> */}
                    <Link to={"/login"}>
                        <IconWrapper>
                            <h6>Login</h6>
                        </IconWrapper>
                    </Link>
                </FlexWrapper>
            </List>
            <SideBarButton onClick={() => setIsClicked(!isClicked)}>
                {isClicked ? "X" : "☰"}
            </SideBarButton>
        </Wrapper>
    );
}
