import {useEffect, useState} from "react";
import Swal from "sweetalert2";

export function client_authentication({router}) {
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("user_info")) {
                router.push("/")
            }
        }

    }, [])
}

export const Global_Error = ({message}) => {

    return (
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: message,
            position: "top-right",
            showConfirmButton: true,
        })
    );
}

export const Global_Success = ({message}) => {
    return (
        Swal.fire({
            icon: "success",
            title: "Success",
            text: message,
            position: "top-right",
            showConfirmButton: true,
        })
    );
}
export const Global_Message = ({message}) => {
    return (
        Swal.fire({
            icon: "info",
            text :message,
            position: "top-right",
            timer:1500
        })
    );
}

export const useWindowInnerWidth = () => {
    const [width, setWidth] = useState(null);
    useEffect(() => {
            if (typeof window !== "undefined") {
                window.addEventListener("resize", () => {
                    setWidth(window.innerWidth);
                })
                return () => {
                    window.removeEventListener("resize", () => {
                        setWidth(window.innerWidth);
                    })
                }
            }
        }
        , [width]);
    return width ? width : typeof window !== "undefined" ? window.innerWidth : null;
}