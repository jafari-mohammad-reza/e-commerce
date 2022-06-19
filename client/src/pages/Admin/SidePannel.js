import styled from "styled-components";
import {Link} from "react-router-dom";
import {FaDiceFour, FaProductHunt, FaShoppingBasket, FaUser,} from "react-icons/fa";
import {BiBarChartSquare, BiCategory, BiLogOut} from "react-icons/bi";
import {MdOutlineLocalShipping, MdSettings} from "react-icons/md";
import {useState} from "react";

const Wrapper = styled.div`
  display: flex;
  width: max-content;
  padding: 2rem 4rem;
  flex-direction: column;
  align-items: flex-start;
  justify-items: center;
  background: rgba(89, 89, 89, 0.17);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(89, 89, 89, 0.16);
`;
const Logo = styled.img`
  width: 12.5rem;
  height: auto;
  margin: 3rem 0;
`;
const PageItem = styled(Link)`
  font-size: 2rem;
  font-weight: 600;
  color: #010101;
  padding: 1rem 0;
  color: ${(props) => props.name === props.activeLink && "#c8a267ff"};
  svg {
    //display: block;
    margin-right: 1rem;
    font-size: 1.5rem;
    color: #c8a267ff;
    transition: all 0.3s ease-in-out;
  }

  position: relative;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #c8a267ff;
  }
  &:hover svg {
    transform: scale(1.5);
  }
`;
const Gap = styled.div`
  margin: 4rem 0;
`;
const SidePanel = () => {
    const [activeLink, setActiveLink] = useState("");
    return (
        <Wrapper>
            <Logo alt={"logo"} src={"/images/logo.png"}/>
            <PageItem
                activeLink={activeLink}
                to="/admin"
                name="dashboard"
                onClick={() => setActiveLink("dashboard")}
            >
                {" "}
                <FaDiceFour/> Dashboard{" "}
            </PageItem>
            <PageItem
                activeLink={activeLink}
                to="/admin/orders"
                name="orders"
                onClick={() => setActiveLink("orders")}
            >
                <FaShoppingBasket/> Orders
            </PageItem>
            <PageItem
                activeLink={activeLink}
                to="/admin/products"
                name="products"
                onClick={() => setActiveLink("products")}
            >
                <FaProductHunt/> Products
            </PageItem>
            <PageItem
                activeLink={activeLink}
                to="/admin/Categories"
                name="Categories"
                onClick={() => setActiveLink("Categories")}
            >
                <BiCategory/>
                Categories
            </PageItem>
            <PageItem
                activeLink={activeLink}
                to="/admin/Customers"
                name="Customers"
                onClick={() => setActiveLink("Customers")}
            >
                <FaUser/> Customers
            </PageItem>
            <PageItem
                activeLink={activeLink}
                to="/admin/Reports"
                name="Reports"
                onClick={() => setActiveLink("Reports")}
            >
                <BiBarChartSquare/> Reports
            </PageItem>
            <PageItem
                activeLink={activeLink}
                to="/admin/Shipment"
                name="Shipment"
                onClick={() => setActiveLink("Shipment")}
            >
                <MdOutlineLocalShipping/>
                Shipment
            </PageItem>
            <Gap/>
            <PageItem
                activeLink={activeLink}
                to="/admin/Settings"
                name="Settings"
                onClick={() => setActiveLink("Settings")}
            >
                <MdSettings/> Settings
            </PageItem>
            <PageItem
                activeLink={activeLink}
                to="/admin/Logout"
                name="Logout"
                onClick={() => setActiveLink("Logout")}
            >
                <BiLogOut/> Logout
            </PageItem>
        </Wrapper>
    );
};

export default SidePanel;
