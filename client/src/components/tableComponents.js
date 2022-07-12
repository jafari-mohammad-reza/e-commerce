import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  height: 100vh;
  width: 100%;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 12rem;
  width: 100%;
  padding: 2rem 4rem;

  h3 {
    font-size: 4rem;
    font-weight: 600;
    color: #000;
  }

  div {
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      width: 8rem;
      margin: 0 1rem;
      border: none;
      outline: none;
      height: 3.5rem;
      border-radius: 1.2rem;
      color: #f1f1f1;
      padding: 1rem;
      background-color: #c8a267;
      font-weight: 500;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      svg {
        margin: 0 .3rem;
        font-size: 1.3rem;
      }

      &:hover {
        filter: brightness(-10deg);
      }
    }
  }

`

export const Table = styled.table`
  table-layout: fixed;
  font-size: 1rem;
  color: gray;
  padding: 10rem 5rem;
  width: 100%;

  th {
    border: 1px solid #c8a267;
    padding: 1.25rem;
    font-weight: 600;
    font-size: 2.5rem;
  }

  td {
    border: 1px solid #c8a267;
    padding: .5rem;
    font-size: 1.8rem;
    text-align: center;
    width: 100%;
    height: max-content;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      max-height: 10rem;
      object-fit: contain;
    }


    .btnContainer {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin: 0 auto;
      width: max-content;

      .editBtn {
        background-color: rgba(76, 125, 213, 0.97);
      }

      .deleteBtn {
        background-color: rgba(210, 18, 18, 0.6);
      }

      button {
        width: max-content;
        padding: .4rem 1rem;
        color: #fff;
        border-radius: .4rem;
        display: flex;
        align-items: center;
        margin: .4rem 0;

        &:hover {
          filter: brightness(15deg);
        }

        svg {
          margin: 0 .3rem;
        }


      }
    }

  }
`


export const Button = styled.button`
  padding: 1.25rem 2rem 1.5rem 2rem;
  color: #000;
  border-radius: 1.7rem;
  background-color: #c8a267;
  transition: color 2ms ease-in-out;

  &:hover {
    background-color: #a08252;
  }
`