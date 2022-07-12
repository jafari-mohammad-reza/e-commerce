import styled from "styled-components";

export const FormWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
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
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  padding: 3rem 5rem;
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
  color: #bcb2bc;
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
  color: #bcb2bc;`
export const FormButton = styled.button``
export const FormImageInput = styled.div``