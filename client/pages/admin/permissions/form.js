import React, {Fragment, useRef} from "react";
import {useRouter} from "next/router";
import axios from "../../../axios";
import {Global_Error, Global_Message, Global_Success} from "../../../conf/ConstantFunctions";

const Form = () => {
    const router = useRouter()
    const titleRef = useRef(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {


            await axios.post(`http://localhost:5000/admin/permissions/`, {title: titleRef.current.value}, {withCredentials: true}).then(result => {
                if (result.status === 201) {
                    Global_Success("permission has been created successfully");
                    return setInterval(() => {
                        router.push("/admin/permissions")
                    }, 2000)
                } else {
                    return Global_Message("Something happened")
                }
            })
        } catch (error) {
            console.log(error?.response.data.errors.message)
            return Global_Error(`${error.response.data.errors.message}`)
        }
    }
    return (
        <Fragment>
            <form
                className={'flex flex-row w-full h-max flex-wrap px-6 md:px-12 lg:px-24 md:justify-between py-10 items-center'}
                encType="multipart/form-data" onSubmit={(e) => handleSubmit(e)}>
                <input type="text" className={'admin_input'} placeholder={'permission title....'} required={true}
                       ref={titleRef}/>
                <button className={'auth_button'} type={'submit'}>
                    Create permission
                </button>
            </form>
        </Fragment>
    )
}
export default Form
