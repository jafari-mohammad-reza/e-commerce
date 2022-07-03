import React from 'react';
import styled from "styled-components";
import {MdOutlineExpandMore} from "react-icons/md";
import "react-circular-progressbar/dist/styles.css"
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import {BiDownArrow, BiUpArrow} from "react-icons/bi";

const Wrapper = styled.div`
  flex: 2;
  -webkit-box-shadow: 2px 4px 10px 1px rgba(0, 0, 0, 0.47);
  box-shadow: 2px 4px 10px 1px rgba(201, 201, 201, 0.47);
  padding: 1rem;

  .top {
    display: flex;
    align-items: center;
    justify-content: center;
    color: gray;

    .title {
      display: flex;
      font-size: 2.5rem;
    }
  }

  .bottom {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;

    .featuredChart {
      width: 12rem;
      height: 12rem;
    }

    .title {
      font-weight: 500;
      color: gray;
    }

    p {
      font-size: 30px;
    }

    .summery {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      margin-top: 1.5rem;

      .item {
        text-align: center;
      }

      .itemTile {
        font-size: 14px;
        color: gray;
      }

      .itemResult {
        display: flex;
        align-items: center;
        margin-top: 10px;
        font-size: 14px;

        &.positive {
          color: green
        }

        &.negative {
          color: red
        }
      }
    }

  }
`

const AdminFeaturedChart = () => {
    return (
        <Wrapper>
            <div className="top">
                <h1 className="title">Total Revenue</h1>
                <MdOutlineExpandMore fontSize={'small'}/>
            </div>
            <div className="bottom">
                <div className="featuredChart">
                    <CircularProgressbar value={70} text={"70%"} strokeWidth={5} styles={
                        buildStyles(
                            {
                                pathColor: '#C8A267F2',
                                textColor: '#888'
                            }
                        )
                    }/>
                </div>
                <h4 className={'title'}>Total sales made today</h4>
                <p className="title">$ 430</p>
                <div className="summery">
                    <div className="item">
                        <div className="itemTitle">Today
                            <div className="itemResult positive">
                                <BiUpArrow fontSize={'small'}/>
                                <div className="resultAmount">$12.43k</div>
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="itemTitle">This Week
                            <div className="itemResult negative">
                                <BiDownArrow fontSize={'small'}/>
                                <div className="resultAmount">$12.43k</div>
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="itemTitle">This Month
                            <div className="itemResult negative">
                                <BiDownArrow fontSize={'small'}/>
                                <div className="resultAmount">$12.43k</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default AdminFeaturedChart;