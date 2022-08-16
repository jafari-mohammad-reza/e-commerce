import React from 'react';
import styled from 'styled-components';
import {RiArrowLeftLine} from "react-icons/ri";
import {Link, useNavigate} from "react-router-dom";

const DropDownNavBar = ({categories}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const navigate = useNavigate()
    return (
        <Container>
            <h3 onClick={() => setIsOpen(!isOpen)}>Categories</h3>
            {
                isOpen && <CategoriesList>
                    {!selectedCategory ? categories.map(category => (
                            <Category key={category._id} onClick={() => {
                                if (category.children.length > 0) {
                                    setSelectedCategory(category);
                                } else {
                                    navigate(`/categories/${category.title.replace(" ", "_")}`)
                                    setIsOpen(false)
                                }
                            }}>
                                {category.title}

                            </Category>
                        ))
                        : <>
                            <RiArrowLeftLine onClick={() => setSelectedCategory(null)}/>
                            {selectedCategory.children.map(category => (
                                <CategoryChild to={`/categories/${category.title.replace(" ", "_")}`} key={category._id}
                                               onClick={() => setIsOpen(false)}>
                                    <div>
                                        {category.title}
                                    </div>
                                </CategoryChild>
                            ))}
                        </>
                    }

                </CategoriesList>
            }

        </Container>
    );
};

const Container = styled.div`
  position: relative;

  h3 {
    cursor: pointer;
  }
`
const CategoriesList = styled.ul`
  position: absolute;
  width: 30rem;
  height: 60rem;
  overflow-y: scroll;
  overflow-x: hidden;
  z-index: 10;
  border-radius: 2.5rem;
  top: 4.5rem;
  display: flex;
  flex-direction: column;;
  left: -5rem;
  padding: 3rem 5rem;
  background-color: rgba(200, 162, 103, 0.88);
  list-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  svg {
    color: white;
    font-size: 3.5rem;
    margin-top: -2rem;
    margin-left: -3rem;
    margin-bottom: 3rem;
  }

`


const Category = styled.li`
  cursor: pointer;
  width: max-content;
  padding: 1rem;
  margin: 1.5rem;
  border-bottom: 1px solid #eee;
  color: white;

`
const CategoryChild = styled(Link)`
  color: white;

  div {
    cursor: pointer;
    width: max-content;
    color: white;
    margin: 1rem 0;

  }


`


export default DropDownNavBar;