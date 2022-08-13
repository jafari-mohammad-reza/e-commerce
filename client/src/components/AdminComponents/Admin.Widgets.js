import React from 'react';
import styled from "styled-components";
import {Link} from "react-router-dom";
import {BiDownArrow, BiUpArrow} from "react-icons/bi";
import {FaEye, FaShoppingBasket, FaUsers} from "react-icons/fa";
import {MdDeliveryDining,} from "react-icons/md";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 2.2rem;
  gap: 2rem;
`
const Widget = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  min-width: 20rem;
  padding: 1.2rem;
  -webkit-box-shadow: 2px 4px 10px 1px rgba(0, 0, 0, 0.47);
  box-shadow: 2px 4px 10px 1px rgba(201, 201, 201, 0.47);

  .left, .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .title {
      font-weight: bold;
      font-size: 1.4rem;
      color: rgba(160, 160, 160);
      margin-bottom: .6rem;
    }

    .counter {
      font-size: 2.6rem;
      font-weight: 300;
      margin-bottom: .6rem;
    }

    a {
      width: max-content;
      font-size: 1.4rem;
      border-bottom: 1px solid gray;
      margin-bottom: .6rem;
    }

    .percentage {
      display: flex;
      align-items: center;
      font-size: 1.5rem;

      &.positive {
        color: green;
      }

      &.negative {
        color: red;
      }
    }

    .icon {
      font-size: 2.8rem;
      padding: .5rem;
      border-radius: .5rem;
      background-color: rgba(200, 162, 103, 0.93);
      align-self: flex-end;
    }
  }
`
const AdminWidgets = () => {
    return (
        <Wrapper>
            <Widget>
                <div className="left">
                    <span className="title">USERS</span><span className="counter">2323</span><Link
                    to={"/admin/users"}><a>See all users</a></Link>
                </div>
                <div className="right">
                    <div className="percentage positive"><BiUpArrow/>20%</div>
                    <FaUsers className={'icon'}/>
                </div>
            </Widget>
            <Widget>
                <div className="left">
                    <span className="title">ORDERS</span><span className="counter">2323</span><Link
                    to={"/admin/orders"}><a>See all orders</a></Link>
                </div>
                <div className="right">
                    <div className="percentage positive"><BiUpArrow/>20%</div>
                    <FaShoppingBasket className={'icon'}/>
                </div>
            </Widget>
            <Widget>
                <div className="left">
                    <span className="title">EARNING</span><span className="counter">2323$</span><Link
                    to={"/admin/delivery"}><a>See all incomes</a></Link>
                </div>
                <div className="right">
                    <div className="percentage positive">20%</div>
                    <MdDeliveryDining className={'icon'}/>
                </div>
            </Widget>
            <Widget>
                <div className="left">
                    <span className="title">VIEWS</span><span className="counter">2323</span>
                </div>
                <div className="right">
                    <div className="percentage negative"><BiDownArrow/>-5%</div>
                    <FaEye className={'icon'}/>
                </div>
            </Widget>
        </Wrapper>
    );
};

export default AdminWidgets;