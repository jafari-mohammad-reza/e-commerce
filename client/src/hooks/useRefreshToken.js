import React from "react";
import axios from "../conf/axios";

const useRefreshToken = () => {
    const refreshToken = async () => {
        const response = await axios.get("/refresh", {
            withCredentials: true,
        });

    };
    return refreshToken;
};

export default useRefreshToken;
