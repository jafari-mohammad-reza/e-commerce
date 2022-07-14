import React, {useEffect, useState} from 'react';
import {Form, FormButton, FormInput, FormWrapper} from "../../../components/FormsComponents";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../../app/features/auth/authSlice";
import Swal from "sweetalert2";
import {useCreateCategoryMutation, useEditCategoryMutation} from "../../../app/features/AdminApies/categoriesApiSlice";
import axios from "../../../conf/axios";

const AdminCategoryForm = ({formMode, id = null}) => {
    const [title, setTitle] = useState('')
    const [parent, setParent] = useState(undefined)
    const [create, {isLoading: createLoading}] = useCreateCategoryMutation()
    const [edit, {isLoading: editLoading}] = useEditCategoryMutation()
    const token = useSelector(selectCurrentToken)
    useEffect(() => {
        if (formMode === "edit" && id) {
            axios.get(`/admin/categories/${id}`, {headers: {authorization: `Bearer ${token}`}}).then(response => {
                console.log(response)
                setTitle(response.data.data.title)
                setParent(response.data.data?.children?.id)
            })
        }
    }, [formMode, id])

    async function submitHandler(e) {
        e.preventDefault()
        const body = {title, parent}
        console.log(body)
        const response = formMode === "create" ? await create({token, body}).unwrap() : await edit({
            token,
            body,
            id
        }).unwrap()
        if (response.success) {
            await Swal.fire({
                icon: "success",
                title: "Success"
            })
            return window.location.reload()
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
                <FormInput
                    required={false}
                    name={"parent"}
                    placeholder={"parent"}
                    value={parent}
                    onChange={(e) => {
                        setParent(e.target.value);
                    }}
                />

                <FormButton value={"Create"} type={"submit"}>
                    {formMode === 'create' ? 'Create' : 'Edit'}
                </FormButton>
            </Form>
        </FormWrapper>)
};

export default AdminCategoryForm;