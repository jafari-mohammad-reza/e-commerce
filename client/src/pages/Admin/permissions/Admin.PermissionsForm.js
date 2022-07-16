import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../../app/features/auth/authSlice";
import {
    useCreatePermissionsMutation,
    useUpdatePermissionsMutation
} from "../../../app/features/AdminApies/PermissionsApiSlice";
import axios from "../../../conf/axios";
import {Form, FormButton, FormInput, FormWrapper} from "../../../components/FormsComponents";
import Swal from "sweetalert2";

const AdminPermissionsForm = ({mode, id}) => {
    const token = useSelector(selectCurrentToken);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [create, {isLoading: createLoading}] = useCreatePermissionsMutation();
    const [update, {isLoading: editLoading}] = useUpdatePermissionsMutation();
    useEffect(() => {
        if (mode === "edit" && id) {
            axios.get(`/admin/permissions/${id}`, {headers: {authorization: `Bearer ${token}`}}).then(response => {
                setTitle(response.data.permission.title)
                setDescription(response.data.permission.description)
            })
        }
    }, [mode, id])

    async function handleSubmit(e) {
        e.preventDefault();
        const body = {title, description};
        const response = mode === "create" ? await create({token, body}).unwrap() : await update({
            token,
            id,
            body
        }).unwrap();
        if (response.success) {
            await Swal.fire({
                icon: "success",
                title: "Success"
            })
            return window.location.reload();
        }
        if (response.error) {
            return await Swal.fire({
                icon: "error",
                title: response.error.data.errors.message
            })
        }
    }

    return (
        <FormWrapper>
            <Form onSubmit={(e) => handleSubmit(e)}>
                <FormInput
                    required={true}
                    name={"title"}
                    placeholder={"Title"}
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                />
                <FormInput
                    required={true}
                    name={"description"}
                    placeholder={"description"}
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                    }}
                />

                <FormButton type={"submit"}>
                    {mode === 'create' ? 'Create' : 'Edit'}
                </FormButton>
            </Form>
        </FormWrapper>
    );
};

export default AdminPermissionsForm;