import styled from "styled-components";

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  padding: 2rem 4rem;
  @media screen and (max-width: 726px) {
    padding: 2rem;
  }

  a {
    img {
      width: 15rem;
      height: auto;
      object-fit: contain;
    }
  }
`

export const ChatsContainer = styled.div`
  height: 90vh;
  width: 100vw;
  overflow-x: hidden;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 0.5rem;

  }

  padding: 6rem 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-self: flex-start;
`

export const ChatInputContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-self: center;

  .emoji {
    position: absolute;
    left: 2%;
    @media screen and (max-width: 726px) {
      left: 4%;
    }
    top: 1.5rem;
    font-size: 3rem;
    color: rgba(238, 212, 42, 0.87);
    cursor: pointer;
  }

  .emoji-picker-react {
    position: absolute;
    top: -325px;
    left: 3rem;
    width: 40%;
    border-radius: 2.5rem 2.5rem 2.5rem 0;


    .emoji-scroll-wrapper::-webkit-scrollbar {
      display: none;
    }

  }


  .btnContainer {

    display: flex;
    align-items: center;
    width: max-content;
    justify-content: space-between;

    .chatOptions {
      cursor: pointer;


      position: absolute;
      right: 10%;
      display: flex;
      align-items: center;

      svg {
        font-size: 3rem;
        margin-left: 2rem;
        cursor: pointer;
      }

      @media screen and (max-width: 726px) {
        right: 13%;
        svg {
          margin-left: 1.3rem;
        }
      }

    }

    .sendBtn {
      position: relative !important;
      height: 6rem;
      border-radius: 0 2.5rem 2.5rem 0;
      background-color: #080420;
      border: none;
      outline: none;
      color: #bcb2bc;
      cursor: pointer;

      &:hover {
        filter: brightness(0.8);
      }

      &:active {
        filter: brightness(0.9);
      }

      @media screen and (min-width: 1024px) {
        width: 10rem;
      }
      width: 5rem;

      svg {
        font-size: 3rem;
        position: relative !important;
      }


    }
  }
`

export const ChatInput = styled.input`
  width: 95%;
  @media screen and (max-width: 726px) {
    width: 100%;
  }

  &::content {
    white-space: pre-wrap;
    max-width: 85%;
    overflow-wrap: break-word;

  }

  height: 6rem;
  border-radius: 2.5rem 0 0 2.5rem;
  color: #101010;
  border: 1px solid #000017;
  wrap-option: break-word;
  outline: none;
  padding: 0 7rem;
  @media screen and (max-width: 726px) {
    padding: 0 6rem;
  }
  font-size: 2rem;
  margin: 0 auto;
`

export const Message = styled.div`
  position: relative;
  max-width: 40%;
  @media screen and (max-width: 726px) {
    max-width: 90%;
  }

  min-height: max-content;
  border-radius: ${({recived}) => recived ? "2.5rem 2.5rem  2.5rem 0" : " 2.5rem  2.5rem 0 2.5rem"};
  place-self: ${({recived}) => recived ? "start" : "end"};
  background-color: ${({recived}) => recived ? "rgba(200, 162, 103, 0.93)" : "rgb(215,177,116)"};
  color: #f1f1f1;
  padding: 1.2rem 1.6rem;
  text-align: ${({recived}) => recived ? "left" : "right"};
  margin: 0 3rem 6rem;

  .logo {
    position: absolute;
    ${({recived}) => recived ? "left: -5.5rem;" : "right: -5.5rem;"}
    bottom: -2.5rem;
    border: 1px solid #c8a267;
    border-radius: 50%;
    width: 5rem;
    height: 5rem;
    object-fit: contain;
    z-index: 10;
  }

  .img-content {
    width: 100%;
  }

  p {
    width: 100%;
    overflow-wrap: break-word;
    font-size: 1.4rem;
    border-radius: 1rem;

  }
`