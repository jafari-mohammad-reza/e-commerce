import {createGlobalStyle} from "styled-components";

const Colors = {
    textSecondary: "#4E4D48",
};
export const GlobalStyle = createGlobalStyle`
    *{
        margin:0;
        padding:0;
        box-sizing:border-box;
        outline:none;
    }
    html{
        font-size:62.5%;
    }
    body{
        background-color: #F7F6F1;
        color: #000;
        font-size: 16px;
        overflow-x:none;
    }
    a{
        color: inherit;
        text-decoration:none;
    }
`;
