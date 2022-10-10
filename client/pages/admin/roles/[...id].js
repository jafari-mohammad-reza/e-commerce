import React, {Fragment, useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "../../../axios";
import {Global_Error, Global_Message, Global_Success} from "../../../conf/ConstantFunctions";
import {AiTwotoneDelete} from "react-icons/ai";

const EditForm = () => {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [permissions, setPermissions] = useState([])
    const [allPermissions, setAllPermissions] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        router.query.id && axios.get(`/admin/roles/${router?.query?.id}`).then(result => {
            if (result.status === 200) {
                const role = result.data.role
                setTitle(role.title)
                setPermissions([...role.permissions])
                setIsLoading(false)
            }
        })
    }, [router.query.id])
    useEffect(() => {
        axios.get("/admin/permissions", {withCredentials: true}).then((result) => {
            if (result.status === 200) {
                setAllPermissions(result.data.permissions)
            }
        })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()


        try {
            const bodyData = {
                title,
                permissions: [...new Set(permissions.map(permission => permission._id))]
            }
            router.query.id && await axios.put(`/admin/roles/${router.query.id}`, bodyData, {withCredentials: true}).then(result => {
                console.log(result)
                if (result.status === 200) {
                    Global_Success("role has been updated successfully");
                    setInterval(async () => {
                        await router.push("/admin/roles")
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
                               value={title} onChange={e => setTitle(e.target.value)}/>


                        <select name="permission" className={'admin_input '} onChange={(e) => {
                            setPermissions([...permissions, allPermissions[e.target.options.selectedIndex - 1]])
                            e.target.options.selectedIndex = 0
                        }
                        }>
                            <option value={undefined} disabled={false} defaultChecked={true}>Select One role
                            </option>
                            {allPermissions && allPermissions.map(permission => (
                                <option value={permission._id} key={permission._id}>{permission.title}</option>
                            ))}
                        </select>


                        <button className={'auth_button'} type={'submit'}>
                            update role
                        </button>
                        {
                            permissions.length > 0 &&
                            <div className=" flex items-center justify-start space-x-20 w-full block mt-20">
                                <h3 className={'text-2xl md:text-3xl lg:text-4xl font-semibold'}>Selected
                                    permissions:</h3>
                                {permissions.map(permission => {
                                    return <div key={permission._id}
                                                className={'flex items-center justify-center space-x-6'}>
                                        <h4 className={'text-xl md:text-3xl font-semibold'}>{permission.title}</h4>
                                        <button
                                            onClick={() => setPermissions([...permissions.filter(per => per._id !== permission._id)])}
                                            className={'flex items-center justify-center py-4 px-8 bg-red-500 text-white rounded-xl'}>
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
export default EditForm
