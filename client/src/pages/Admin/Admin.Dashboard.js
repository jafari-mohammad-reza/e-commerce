import {BiCart, BiMoney, BiUser} from "react-icons/bi";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  padding: 5rem 10rem;
  position: relative;
  height: 100%;
`;
const DailyGoalContainer = styled.div`
  width: 100%;
  height: 2.5rem;
  border-radius: 2rem;
  background-color: #000;
`;
const AllStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4rem 3rem;
  border-radius: 6rem;
  width: 95%;
  margin-bottom: 6rem;
  height: max-content;
  background: rgba(191, 191, 191, 0.33);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(11.2px);
  -webkit-backdrop-filter: blur(11.2px);
  border: 1px solid rgba(191, 191, 191, 0.12);
  div {
    display: flex;
    align-items: center;
    svg {
      font-size: 4rem;
      margin-right: 1.2rem;
      background: #fff;
      border-radius: 1rem;
      padding: 0.5rem;
    }
    div {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      h6 {
        font-size: 1.6rem;
        margin-bottom: 0.5rem;
      }
      span {
        font-size: 1.5rem;
        font-weight: bold;
      }
    }
  }
`;
const TodayStatus = styled.div`
  width: 100%;
  padding: 5rem 6rem;
  background-color: #c8a063;
  color: #000;
  display: flex;
  border-radius: 2.5rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    justify-items: flex-start;
    margin-bottom: 2.5rem;
    h3 {
      width: 20rem;
      font-size: 2.2rem;
      font-weight: 600;
    }
    span {
      font-size: 1.6rem;
      font-weight: 500;
    }
  }
`;
const MainDashboard = () => {
    return (
        <Wrapper>
            <AllStatus>
                <div>
                    <BiCart/>
                    <div>
                        <h6>Orders Completed</h6>
                        <span>1.274k</span>
                    </div>
                </div>
                <div>
                    <BiUser/>
                    <div>
                        <h6>Total users</h6>
                        <span>1.274k</span>
                    </div>
                </div>
                <div>
                    <BiMoney/>
                    <div>
                        <h6>Total earned</h6>
                        <span>1.274k</span>
                    </div>
                </div>
            </AllStatus>
            <TodayStatus>
                <div>
                    <h3>Today orders: </h3>
                    <span>1.274k</span>
                    {/* //? Daily goal container */}
                    {/*<DailyGoalContainer />*/}
                </div>
                <div>
                    <h3>Today viewers: </h3>
                    <span>1.274k</span>
                    {/* //? Daily goal container */}
                    {/*<DailyGoalContainer />*/}
                </div>
                <div>
                    <h3>Today earning: </h3>
                    <span>1.274k</span>
                    {/* //? Daily goal container */}
                    {/*<DailyGoalContainer />*/}
                </div>
                <div>
                    <h3>Today profit: </h3>
                    <span>1.274k</span>
                    {/* //? Daily goal container */}
                    {/*<DailyGoalContainer />*/}
                </div>
                {/* // Random motivational  */}
            </TodayStatus>
        </Wrapper>
    );
};
export default MainDashboard;
