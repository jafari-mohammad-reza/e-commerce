import React, {Fragment, useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import axios from "../../../axios";
import {Global_Error, Global_Message, Global_Success} from "../../../conf/ConstantFunctions";
import {AiOutlinePlus, AiTwotoneDelete} from "react-icons/ai";

const Form = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const titleRef = useRef(null)
    const [permissions,setPermissions] = useState([])
    const [allPermissions, setAllPermissions] = useState([])

    useEffect(() => {
        axios.get("http://localhost:5000/admin/permissions", {withCredentials: true}).then((result) => {
            if (result.status === 200) {
                setAllPermissions(result.data.permissions)
                setIsLoading(false)
            }
        })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()


        try {
            const bodyData = {
                title : titleRef.current.value,
                permissions : [...new Set(permissions.map(permission => permission._id))]
            }
            console.log(bodyData)
            await axios.post(`http://localhost:5000/admin/roles/`, bodyData, {withCredentials: true}).then(result => {
                console.log(result)
                if (result.status === 201) {
                    Global_Success("role has been created successfully");
                    return setInterval(() => {
                        router.push("/admin/roles")
                    }, 2000)
                } else {
                    return Global_Message("Something happened")
                }
            })
        } catch (error) {
            console.log(error)
            return Global_Error(`${error.response.data.errors.message}`)
        }
    }
    return (
        <Fragment>
            {
                isLoading ? <h1>Loading</h1> : (
                    <form
                        className={'flex flex-row w-full h-max flex-wrap px-6 md:px-12 lg:px-24   py-10 items-center'}
                        encType="multipart/form-data" onSubmit={(e) => handleSubmit(e)}>
                        <input type="text" className={'admin_input'} placeholder={'role title....'} required={true}
                               ref={titleRef}/>


                        <select name="permission" className={'admin_input '} onChange={(e) => {
                            setPermissions([...permissions , allPermissions[e.target.options.selectedIndex -1]])
                            e.target.options.selectedIndex=0
                        }
                        }>
                            <option value={undefined} disabled={false} defaultChecked={true}>Select One role
                            </option>
                            {allPermissions && allPermissions.map(permission => (
                                <option value={permission._id} key={permission._id}>{permission.title}</option>
                            ))}
                        </select>


                        <button className={'auth_button'} type={'submit'}>
                            Create role
                        </button>
                        {
                            permissions.length > 0 && <div className=" flex items-center justify-start space-x-20 w-full block mt-20">
                                <h3 className={'text-2xl md:text-3xl lg:text-4xl font-semibold'}>Selected permissions:</h3>
                                { permissions.map(permission => {
                                    return <div key={permission._id} className={'flex items-center justify-center space-x-6'}>
                                        <h4 className={'text-xl md:text-3xl font-semibold'}>{permission.title}</h4>
                                        <button onClick={() => setPermissions([...permissions.filter(per => per._id !== permission._id)])} className={'flex items-center justify-center py-4 px-8 bg-red-500 text-white rounded-xl'}>
                                            <AiTwotoneDelete/>
                                        </button>
                                    </div>
                                })}
                            </div>
                        }
                    </form>
                )
            }
        </Fragment>
    )
}
export default Form