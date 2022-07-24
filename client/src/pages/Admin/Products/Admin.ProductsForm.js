import React, {useEffect, useState} from "react";
import {Form, FormArea, FormButton, FormInput, FormWrapper,} from "../../../components/FormsComponents";
import axios from "../../../conf/axios";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../../app/features/auth/authSlice";
import {useCreateProductMutation, useUpdateProductMutation} from "../../../app/features/AdminApies/ProductsApiSlice";
import Swal from "sweetalert2";

const AdminProductsForm = ({mode = "create", id = null}) => {
    const [categories, setCategories] = useState([]);
    const token = useSelector(selectCurrentToken);
    const [title, setTitle] = useState("");
    const [overView, setOverView] = useState("");
    const [tags, setTags] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [stockCount, setStockCount] = useState("");
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState("");
    const [create, {isLoading}] = useCreateProductMutation();
    const [update] = useUpdateProductMutation();

    async function submitHandler(e) {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("overView", overView);
            formData.append("tags", tags);
            formData.append("category", category);
            formData.append("price", price);
            formData.append("discount", discount);
            formData.append("stockCount", stockCount);
            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }
            formData.append("description", description);
            const response = mode === "create" ? await create({formData, token}).unwrap() : await update({
                formData,
                id,
                token
            }).unwrap();
            console.log(response);
            if (response.success) {
                await Swal.fire({
                    icon: "success",
                    title: "Success ✅",
                });
                return window.location.reload();
            }
        } catch (e) {
            console.log(e)
            return await Swal.fire({
                icon: "Error",
                title: "Error!",
                text: e?.data.errors.message
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
            axios.get(`/admin/products/${id}`, {
                headers: {
                    authorization: `Bearer ${token}`,
                }
            }).then((r) => {
                setTitle(r.data.product.title);
                setOverView(r.data.product.overView);
                setTags(r.data.product.tags);
                setCategory(r.data.product.category);
                setPrice(r.data.product.price);
                setDiscount(r.data.product.discount);
                setStockCount(r.data.product.stockCount);
                setDescription(r.data.product.description);
                setImages(r.data.product.images);
            })
        }
    }, [id, mode]);

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
                    required={true}
                    name={"price"}
                    placeholder={"Price"}
                    value={price}
                    onChange={(e) => {
                        setPrice(e.target.value);
                    }}
                />
                <FormInput
                    required={true}
                    name={"discount"}
                    placeholder={"Discount percentage"}
                    value={discount}
                    onChange={(e) => {
                        setDiscount(e.target.value);
                    }}
                />
                <FormInput
                    required={true}
                    name={"stockCount"}
                    placeholder={"items in stock"}
                    value={stockCount}
                    onChange={(e) => {
                        setStockCount(e.target.value);
                    }}
                />
                <FormInput
                    type='file'
                    id='images'
                    name="images"
                    placeholder="Upload an Image"
                    multiple={true}
                    required={true}
                    onChange={(e) => {

                        setImages([...images, ...e.target.files]);
                    }}
                />
                <FormArea
                    required={true}
                    name={"description"}
                    placeholder={"Description"}
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                    }}
                />
                <FormButton value={"Create"} type={"submit"}>
                    {mode === "create" ? "Create" : "Edit"}
                </FormButton>
            </Form>
        </FormWrapper>
    );
};

export default AdminProductsForm;
