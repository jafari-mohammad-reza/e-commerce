import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../../app/features/auth/authSlice";
import {useCreateBlogMutation, useUpdateBlogMutation} from "../../../app/features/AdminApies/BlogsApiSlice";
import axios from "../../../conf/axios";
import {Form, FormArea, FormButton, FormInput, FormWrapper} from "../../../components/FormsComponents";
import Swal from "sweetalert2";

const AdminBlogForm = ({mode = "create", id = null}) => {
    const token = useSelector(selectCurrentToken);
    const [title, setTitle] = useState("");
    const [overView, setOverView] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");
    const [create] = useCreateBlogMutation()
    const [update] = useUpdateBlogMutation()
    const [categories, setCategories] = useState([]);

    async function submitHandler(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("overView", overView);
        formData.append("content", content);
        formData.append("tags", tags);
        formData.append("category", category);
        formData.append("image", image);
        const response = mode === "create" ? await create({formData, token}).unwrap() : await update({
            formData,
            id,
            token
        }).unwrap();
        if (response.success) {
            await Swal.fire({
                icon: "success",
                title: "Success ✅",
            });
            return window.location.reload();
        }
        if (response.errors) {
            return await Swal.fire({
                icon: "Error",
                title: "Error!",
                text: response?.errors?.message,
            });
        }
    }

    async function fetchCategories() {
        const response = await axios.get("/admin/categories", {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });

        return response.data.data;
    }

    useEffect(() => {
        fetchCategories().then((r) => {
            setCategories(r);
        });
        if (mode === "edit" && id) {
            axios.get("/admin/blogs/" + id, {
                headers: {
                    authorization: `Bearer ${token}`,
                }
            }).then(res => {
                setTitle(res.data.blog.title);
                setOverView(res.data.blog.overView);
                setContent(res.data.blog.content);
                setTags(res.data.blog.tags);
                setCategory(res.data.blog.category);
                setImage(res.data.blog.image);
            }).catch(err => {
                return Swal.fire({
                    icon: "Error",
                    title: "Error!",
                    text: err?.response?.data?.errors?.message,
                })
            })
        }
    }, [id, mode])

    return (
        <FormWrapper>
            <Form enctype="multipart/form-data" onSubmit={(e) => submitHandler(e)}>
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
                    name={"overView"}
                    placeholder={"overView"}
                    value={overView}
                    onChange={(e) => {
                        setOverView(e.target.value);
                    }}
                />
                <FormInput
                    required={true}
                    name={"tags"}
                    placeholder={"#Tags1,#Tag2"}
                    value={tags}
                    onChange={(e) => {
                        setTags(e.target.value);
                    }}
                />
                <select
                    name="category"
                    id=""
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                    }}
                >
                    {categories &&
                        categories?.map((category) => (
                            <option value={category._id} id={category._id} key={category._id}>
                                {category.title}
                            </option>
                        ))}
                </select>


                <FormInput
                    type='file'
                    id='image'
                    name="image"
                    placeholder="Upload an Image"
                    multiple={false}
                    required={true}
                    onChange={(e) => {
                        setImage(e.target.files[0]);
                    }}
                />
                <FormArea
                    required={true}
                    name={"description"}
                    placeholder={"Description"}
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                    }}
                />
                <FormButton value={"Create"} type={"submit"}>
                    {mode === "create" ? "Create" : "Edit"}
                </FormButton>
            </Form>
        </FormWrapper>
    );
};

export default AdminBlogForm;