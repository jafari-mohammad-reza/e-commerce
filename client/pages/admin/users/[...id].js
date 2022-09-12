import React, {Fragment, useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import axios from "../../../axios";
import {Global_Error, Global_Message, Global_Success} from "../../../conf/ConstantFunctions";

const EditForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const firstNameRef = useRef(null)
    const lastNameRef = useRef(null)
    const usernameRef = useRef(null)
    const mobileNumberRef = useRef(null)
    const emailRef = useRef(null)
    const birthdayRef = useRef(null)
    const RoleRef = useRef(null)
    const isPrimeRef = useRef(null)
    const isBannedRef = useRef(null)
    const [allRoles, setAllRoles] = useState([])
    useEffect(() => {
        axios.get("http://localhost:5000/admin/roles", {withCredentials: true}).then((result) => {
            if (result.status === 200) {
                setAllRoles(result.data.roles)
            }
        })
    }, [])
    useEffect(() => {
        router.query.id && axios.get(`http://localhost:5000/admin/users/${router?.query?.id}`).then(result => {
            if (result.status === 200) {
                const user = result.data.user
                firstNameRef.current.value = user.firstName;
                lastNameRef.current.value = user.lastName;
                usernameRef.current.value = user.username;
                emailRef.current.value = user.email;
                mobileNumberRef.current.value = user.mobileNumber;
                birthdayRef.current.value = user.birthday;
                RoleRef.current.value = user.Role;
                isBannedRef.current.value = user.isBanned;
                isPrimeRef.current.value = user.isPrime;
                setIsLoading(false)
            } else {
                setIsLoading(true)
            }
        })
    }, [router.query.id])
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {

            const bodyData = {
                firstName: firstNameRef.current.value || undefined,
                lastName: lastNameRef.current.value || undefined,
                username: usernameRef.current.value || undefined,
                email: emailRef.current.value || undefined,
                mobileNumber: mobileNumberRef.current.value || undefined,
                birthday: birthdayRef.current.value || undefined,
                Role: RoleRef.current.value || undefined,
                isBanned: isBannedRef.current.value || undefined,
                isPrime: isPrimeRef.current.value || undefined,
            }
            router?.query?.id && await axios.put(`http://localhost:5000/admin/users/${router?.query?.id}`, bodyData, {withCredentials: true}).then(result => {
                console.log(result)
                if (result.status === 200) {
                    Global_Success("user has been Updated successfully");
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
        <Fragment>
            {
                isLoading ? <h1>Loading</h1> : (
                    <form
                        className={'flex flex-row w-full h-max flex-wrap px-6 md:px-12 lg:px-24 md:justify-between py-10 items-center'}
                        encType="multipart/form-data" onSubmit={(e) => handleSubmit(e)}>
                        <input type="text" className={'admin_input'} placeholder={'user firstname ....'}
                               required={false}
                               ref={firstNameRef}/>
                        <input type="text" className={'admin_input'} placeholder={'user lastname ....'} required={false}
                               ref={lastNameRef}/>
                        <input type="text" className={'admin_input'} placeholder={'user username....'} required={false}
                               ref={usernameRef}/>
                        <input type="text" className={'admin_input'} placeholder={'user email ....'} required={false}
                               ref={emailRef}/>
                        <input type="text" className={'admin_input'} placeholder={'user mobileNumber ....'}
                               required={false}
                               ref={mobileNumberRef}/>

                        <input type="date" className={'admin_input'} placeholder={'user mobileNumber ....'}
                               required={false}
                               ref={birthdayRef}/>
                        <select name="Role" className={'admin_input'} ref={RoleRef}>
                            {RoleRef?.current?.value &&
                                <option value={RoleRef?.current?.value} disabled={false} defaultChecked={true}>Select
                                    One Role</option>}
                            {allRoles && allRoles.map(category => (
                                <option value={category.title} key={category._id}>{category.title}</option>
                            ))}
                        </select>
                        <div className={'flex items-center justify-start space-x-20'}>
                            <div className={'flex items-center space-x-3.5 my-3 place-self-start w-max'}>
                                <span className={'text-2xl text-blue-500'}>isPrime</span>
                                <input type="checkbox" name={'isPrime'} ref={isPrimeRef}
                                       className={'w-8 h-8 rounded-lg  '}/>
                            </div>
                            <div className={'flex items-center space-x-3.5 my-3 place-self-start w-max'}>
                                <span className={'text-2xl text-blue-500'}>isBanned</span>
                                <input type="checkbox" name={'isBanned'} ref={isBannedRef}
                                       className={'w-8 h-8 rounded-lg  '}/>
                            </div>
                        </div>
                        <button className={'auth_button'} type={'submit'}>
                            Update user
                        </button>
                    </form>
                )
            }
        </Fragment>
    )
}
export default EditForm
