import React, {useEffect, useRef, useState} from 'react';
import {Global_Error, Global_Message, Global_Success} from "../../../conf/ConstantFunctions";
import axios from "../../../axios";
import {useRouter} from "next/router";

const Form = () => {
    const router = useRouter()
    const usernameRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const mobileNumberRef = useRef(null)
    const RoleRef = useRef(null)
    const [allRoles, setAllRoles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        axios.get("http://localhost:5000/admin/roles", {withCredentials: true}).then((result) => {
            if (result.status === 200) {
                setAllRoles(result.data.roles)
                setIsLoading(false)
            }
        })
    }, [])
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const bodyData = {
                email :emailRef.current.value || undefined,
                username :usernameRef.current.value || undefined,
                password :passwordRef.current.value || undefined,
                mobileNumber :mobileNumberRef.current.value || undefined,
                Role :RoleRef.current.value || undefined,
            }
            await axios.post("http://localhost:5000/admin/users", bodyData, {withCredentials: true}).then(result => {
                console.log(result)
                if (result.status === 200) {
                    Global_Success("user has been created successfully");
                    return setInterval(() => {
                        router.push("/admin/users")
                    }, 2000)
                } else {
                    return Global_Message("Something happened")
                }
            })
        } catch (error) {
            console.log(error.response.data.errors.message)
            return Global_Error(`${error.response.data.errors.message}`)
        }
    }
    return (
        <>
            {isLoading ? <h1>Loading....</h1> : (
                <form
                    className={'flex flex-row w-full h-max flex-wrap px-6 md:px-12 lg:px-24 md:justify-between py-10 items-center'}
                    encType="multipart/form-data" onSubmit={(e) => handleSubmit(e)}>
                    <input type="text" className={'admin_input'} placeholder={'user username....'} required={false}
                           ref={usernameRef}/>
                    <input type="text" className={'admin_input'} placeholder={'user email ....'} required={false}
                           ref={emailRef}/>
                    <input type="text" className={'admin_input'} placeholder={'user mobileNumber ....'} required={false}
                           ref={mobileNumberRef}/>
                    <input type="text" className={'admin_input'} placeholder={'user password ....'} required={false}
                           ref={passwordRef}/>
                    <select name="Role" className={'admin_input'} ref={RoleRef}>
                        <option value={"USER"} disabled={false} defaultChecked={true}>Select One Role</option>
                        {allRoles && allRoles.map(category => (
                            <option value={category.title} key={category._id}>{category.title}</option>
                        ))}
                    </select>


                    <button className={'auth_button'} type={'submit'}>
                        Create user
                    </button>
                </form>
            )}
        </>
    );
};

export default Form;