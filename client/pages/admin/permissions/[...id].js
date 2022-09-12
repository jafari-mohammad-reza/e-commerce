import React, {Fragment, useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "../../../axios";
import {Global_Message, Global_Success} from "../../../conf/ConstantFunctions";


const EditForm = () => {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        router.query.id && axios.get(`http://localhost:5000/admin/permissions/${router?.query?.id}`).then(result => {
            const permission = result.data.permission
            if (result.status === 200) {
                setTitle(permission.title)
                setIsLoading(false)
            }
        })
    }, [router.query.id])
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            router.query.id && await axios.put(`http://localhost:5000/admin/permissions/${router.query.id}`, {title}, {withCredentials: true}).then(result => {
                console.log(result)
                if (result.status === 200) {
                    Global_Success("permission has been updated successfully");
                    return setInterval(() => {
                        router.push("/admin/permissions")
                    }, 2000)
                } else {
                    return Global_Message("Something happened")
                }
            })
        } catch (error) {
            console.log(error)
            // return Global_Error(`${error.response.data.errors.message}`)
        }
    }
    return (
        <Fragment>
            {isLoading ? <h1>Loading....</h1> : <form
                className={'flex flex-row w-full h-max flex-wrap px-6 md:px-12 lg:px-24 md:justify-between py-10 items-center'}
                encType="multipart/form-data" onSubmit={(e) => handleSubmit(e)}>
                <input type="text" className={'admin_input'} placeholder={'permission title....'} required={true}
                       value={title} onChange={e => setTitle(e.target.value)}/>
                <button className={'auth_button'} type={'submit'}>
                    update permission
                </button>
            </form>}
        </Fragment>
    )
}
export default EditForm
