import React, {Fragment, useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../../app/features/auth/authSlice";
import {useCreateRoleMutation, useUpdateRoleMutation} from "../../../app/features/AdminApies/RolesApiSlice";
import {Form, FormButton, FormInput, FormWrapper} from "../../../components/FormsComponents";
import axios from "../../../conf/axios";
import Swal from "sweetalert2";

const AdminRoleForm = ({mode = "create", id = null}) => {
    const token = useSelector(selectCurrentToken)
    const [title, setTitle] = useState('')
    const [permissions, setPermissions] = useState([])
    const [create, {isLoading: createLoading}] = useCreateRoleMutation()
    const [edit, {isLoading: editLoading}] = useUpdateRoleMutation()
    const permissionsContainerRef = useRef(null)
    const [permissionsList, setPermissionsList] = useState([])
    const [permissionCount, setPermissionCount] = useState(0)


    async function fetchPermissions() {
        const response = await axios.get("/admin/permissions", {headers: {authorization: `Bearer ${token}`}})
        setPermissionsList(response.data.permissions)
    }

    async function submitHandler(e) {
        e.preventDefault()
        const body = {title, permissions}
        const response = mode === "create" ? await create({token, body}).unwrap() : await edit({
            id,
            token,
            body
        }).unwrap()
        console.log(response)
        if (response.success) {
            await Swal.fire({
                icon: "success",
                title: "Success",
                showCloseButton: true
            })
            return window.location.reload()
        }
        if (response.error) {
            return await Swal.fire({
                icon: "error",
                title: response.error.data.errors.message,
                showCloseButton: true,
            })
        }
    }

    useEffect(() => {
        fetchPermissions().catch(error => {
            console.log(error)
            return Swal.fire({
                icon: "error",
                title: error.messages,
                showCloseButton: true,
            })
        })
        if (mode === "edit" && id) {
            axios.get(`/admin/roles/${id}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).then(res => {
                setTitle(res.data.role.title)
                setPermissions(res.data.role.permissions)
            }).catch(err => {
                console.log(err)
            })
        }
    }, [id, mode])
    return (
        <FormWrapper>
            <Form onSubmit={(e) => submitHandler(e)}>
                <FormInput
                    required={true}
                    name={"title"}
                    placeholder={"Title"}
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                />
                <div ref={permissionsContainerRef} className={"flex-col"}>
                    {mode === "edit" && permissions && permissions.map(permission => (
                        <select name="permissions" id="" defaultValue={permission} onChange={(e) => {
                            setPermissions(permissions => [...new Set([...permissions, e.target.value])])
                        }}>
                            {permissionsList.map(permissionOption => (
                                <option value={permissionOption._id} key={permissionOption._id}>
                                    {permissionOption.title}

                                </option>

                            ))}
                        </select>
                    ))}
                    {mode === "create" &&
                        <Fragment>


                        </Fragment>
                    }
                </div>
                {/*<FormButton type={"button"} onClick={addPermissionInput}>Add Permission</FormButton>*/}


                <FormButton type={"submit"}>
                    {mode === 'create' ? 'Create' : 'Edit'}
                </FormButton>
            </Form>
        </FormWrapper>
    );
};

export default AdminRoleForm;