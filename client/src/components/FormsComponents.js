import styled from "styled-components";

export const FormWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
`
export const Form = styled.form`
  width: 75%;
  border-radius: 2rem;
  height: 80%;
  background: rgba(187, 151, 96, 0.5);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(17px);
  -webkit-backdrop-filter: blur(17px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  position: relative;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  padding: 3rem 5rem;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }


  select {
    width: 45%;
    height: 6rem;
    border: 1px solid rgba(188, 178, 188, 0.87);
    outline: none;
    margin: 0 auto;
    padding: 1rem 3rem;
    border-radius: .7rem;
    background-color: #f1f1f1;
    color: #000;
    @media screen and (max-width: 720px) {
      width: 100%;
      margin: 1rem 0;
    }
  }

  .flex {
    width: 100%;
    height: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;


    input {
      //margin-right: 1rem;
      width: 3.5rem;
      height: 3.5rem;
      margin: 0 2rem !important;
    }

    span {
      color: red;
      font-size: 1.4rem;
      margin-right: .4rem;
    }
  }
`
export const FormInput = styled.input`
  width: 45%;
  height: 6rem;
  border: 1px solid rgba(188, 178, 188, 0.87);
  outline: none;
  margin: 0 auto;
  padding: 1rem 3rem;
  border-radius: .7rem;
  background-color: #f1f1f1;
  color: #000;
  @media screen and (max-width: 720px) {
    width: 100%;
    margin: 1rem 0;
  }
`
export const FormArea = styled.textarea`
  width: 95%;
  height: 30rem;
  border: 1px solid rgba(188, 178, 188, 0.87);
  outline: none;
  margin: 0 auto;
  padding: 1rem 3rem;
  border-radius: .7rem;
  background-color: #f1f1f1;
  color: #000;
  @media screen and (max-width: 720px) {
    width: 100%;
    margin: 1rem 0;
  }
`
export const FormButton = styled.button`
  width: 20rem;
  height: 5rem;
  border: none;
  outline: none;
  border-radius: 1.5rem;
  color: #f1f1f1;
  padding: 2rem 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background-color: rgba(200, 162, 103, 0.93);
  margin: 0 auto;
  cursor: pointer;
`
export const FormImageInput = styled.div``

export const CloseButton = styled.span`
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.2rem;
  position: absolute;
  z-index: 50;
  top: 12%;
  left: 14%;
  cursor: pointer;

  svg {
    font-size: 1.5rem;
  }

`

