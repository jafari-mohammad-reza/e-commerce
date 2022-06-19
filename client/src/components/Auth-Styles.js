import styled from "styled-components";
import {Link} from "react-router-dom";
import {FaGoogle} from "react-icons/fa";

export const AuthWrapper = styled.form`
  width: 42rem;
  height: auto;
  border-radius: 1.3rem;
  background-color: #fefefe;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2.5rem;
  margin: 0 auto;
  margin-top: 5rem;
  @media (max-width: 768px) {
    width: 80%;
    height: auto;
    padding: 1rem;
    margin-top: 0;
  }
  h1 {
    font-size: 3.2rem;
    font-weight: 600;
    color: #c8a267;
    @media (max-width: 768px) {
      font-size: 2.4rem;
    }
  }
  hr {
    width: 100%;
    height: 1px;
    background-color: #595959;
    margin-top: 1rem;
    margin-bottom: 2.5rem;
  }
`;
export const Input = styled.input`
  width: 100%;
  height: 4rem;
  border: #c8a267 solid 1px;
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: #595959;
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;
export const Button = styled.button`
  width: 12rem;
  text-decoration: none;
  padding: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  position: relative;
  margin: 1.5rem 0;
  background: #c8a267;
  color: #fff;
  border: none;
  border-radius: 1.5rem;
  transition: transform 0.3s ease;
  cursor: pointer;
  @media (max-width: 768px) {
    width: 60%;
    height: auto;
    font-size: 1.2rem;
  }
  &:hover {
    transform: translate(-12px, -12px);
  }
  &::before,
  &::after {
    content: "";
    position: absolute;
    opacity: 0.3;
    background: #c8a267;
    border-radius: inherit;
    width: 100%;
    height: 100%;
    left: 0;
    bottom: 0;
    z-index: -1;
    transition: transform 0.3s ease;
  }
  &:hover::after {
    transform: translate(6px, 6px);
  }

  &:hover::before {
    transform: translate(12px, 12px);
  }
`;
export const SubLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  h5 {
    font-size: 2rem;
    font-weight: 600;
    color: #595959;
  }
  span {
    font-size: 1.5rem;
    font-weight: 600;
    color: #c8a267;
    cursor: pointer;
    transition: transform 0.3s ease;
    margin-left: 1rem;
  }
`;

export const OuterOptions = styled.div`
  margin-top: 1.2rem;
  display: flex;
  width: 80%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  span {
    font-size: 2rem;
    font-weight: 500;
    color: #595959;
    @media (max-width: 768px) {
      font-size: 2.4rem;
    }
  }
  hr {
    width: 100%;
    height: 1px;
    background-color: #c8a267;
    margin-top: 1rem;
    margin-bottom: 2.5rem;
  }
`;

export const GoogleButton = styled(FaGoogle)`
  color: #c8a267;
  font-size: 3rem;
  margin: 2.5rem;
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.2);
  }
`;
