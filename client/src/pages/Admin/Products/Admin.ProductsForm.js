import React, {useEffect, useState} from "react";
import {Form, FormArea, FormButton, FormInput, FormWrapper,} from "../../../components/FormsComponents";
import axios from "../../../conf/axios";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../../app/features/auth/authSlice";
import {useCreateProductMutation} from "../../../app/features/AdminApies/ProductsApiSlice";
import Swal from "sweetalert2";

const AdminProductsForm = ({formMode}) => {
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

    async function submitHandler(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("overView", overView);
        formData.append("tags", tags);
        formData.append("category", category);
        formData.append("price", price);
        formData.append("discount", discount);
        formData.append("stockCount", stockCount);
        formData.append("images", images);
        formData.append("description", description);
        const response = await axios.post("/admin/products", formData, {
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            }
        });

        console.log(response);
        if (response.status === 200) {
            await Swal.fire({
                icon: "success",
                title: "Success ✅",
                text: "Created",
            });
        }
        if (response?.error) {
            return await Swal.fire({
                icon: "Error",
                title: "Error!",
                text: response?.error?.data?.errors?.message,
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
    }, []);

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
                    required={true}
                    type={"file"}
                    multiple
                    value={images}
                    onChange={(e) => {
                        setImages([e.target.value]);
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
                    Create
                </FormButton>
            </Form>
        </FormWrapper>
    );
};

export default AdminProductsForm;
