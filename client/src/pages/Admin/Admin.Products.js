import React from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {AiFillPrinter, AiOutlineSearch} from "react-icons/ai";
import {BiExport} from "react-icons/bi";
import {IoAdd} from "react-icons/io5";

const Wrapper = styled.div`
  padding: 0 2rem;
  width: 100%;
  height: 100vh;
  position: relative;
`;
const Nav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const NavButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  height: 4rem;
  padding: 0.3rem 1rem;
  border-radius: 0.5rem;
  background-color: #c1c1c1;
  color: #000;
  font-size: 1.7rem;
  margin: 0 0.5rem;
  ${({addBtn}) =>
    addBtn && "font-weight:700; background-color: #C8A063; color: #f2f2f2;"}
  transition: all .3s ease-in-out;
  &:hover {
    filter: brightness(1.1);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
  background-color: #f2f2f2;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 1rem;
  position: relative;
  width: 30rem;
  height: 4rem;
  svg {
    color: #c8a063;
    font-size: 1.8rem;
    position: absolute;
    left: 1.2rem;
    top: 50%;
    transform: translateY(-50%);
  }
  input {
    border: none;
    outline: none;
    padding: 1.5rem 5rem;
    width: 100%;
    font-size: 1.5rem;
    background-color: #f2f2f2;
    color: #000;
  }
`;
const ProductsContainer = styled.table`
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-collapse: collapse;
  tr {
    border-bottom: 1px solid #c1c1c1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 4rem;
    td {
      width: max-content;
      height: 100%;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      &:first-child {
        width: 20%;
      }
      &:last-child {
        width: 20%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
  a {
    color: #c8a063;
    font-size: 1.5rem;
    text-decoration: none;
    transition: all 0.3s ease-in-out;
    &:hover {
      filter: brightness(1.1);
    }
  }
`;

function AdminProductsPage() {
    const [search, setSearch] = React.useState("");
    return (
        <Wrapper>
            <Nav>
                <h2>Products</h2>
                <div>
                    <NavButton to="/admin/products/print">
                        <AiFillPrinter/>
                        Print
                    </NavButton>
                    <NavButton to="/admin/products/export">
                        <BiExport/>
                        Export
                    </NavButton>
                    <NavButton to="/admin/products/new" addBtn>
                        <IoAdd/>
                        Add Product
                    </NavButton>
                </div>
            </Nav>
            <Container>
                <SearchBar>
                    <input
                        type="text"
                        placeholder="Search by name or category"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <AiOutlineSearch/>
                </SearchBar>
                <ProductsContainer>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Product 1</td>
                        <td>Category 1</td>
                        <td>$100</td>
                        <td>100</td>
                        <td>
                            <Link to="/admin/products/edit">Edit</Link>
                            <Link to="/admin/products/delete">Delete</Link>
                        </td>
                    </tr>
                    </tbody>
                </ProductsContainer>
            </Container>
        </Wrapper>
    );
}

export default AdminProductsPage;
