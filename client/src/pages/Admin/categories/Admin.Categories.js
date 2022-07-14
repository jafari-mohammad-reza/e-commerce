import React, {Fragment, useEffect, useState} from "react";
import {useDeleteCategoryMutation, useGetCategoriesQuery} from "../../../app/features/AdminApies/categoriesApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../../app/features/auth/authSlice";
import {BiDownArrow} from "react-icons/bi";
import {IoCreateOutline} from "react-icons/io5";
import LoadingComponent from "../../../components/LoadingComponent";
import {BsGearWide} from "react-icons/bs";
import {AiFillDelete, AiFillEdit, AiOutlineClose} from "react-icons/ai";
import {Button, Header, Table, Wrapper,} from "../../../components/tableComponents";
import Swal from "sweetalert2";
import {CloseButton} from "../../../components/FormsComponents";
import AdminCategoryForm from "./Admin.CategoryForm";

const AdminCategories = () => {
    const token = useSelector(selectCurrentToken);
    const {data, isLoading} = useGetCategoriesQuery({credentials: token});
    const [remove] = useDeleteCategoryMutation()
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("create");
    const [selectedCategory, setSelectedCategory] = useState(null)
    useEffect(() => {
        if (!isLoading) {
            setCategories(data.data);
        }
    }, [data]);
    return (
        <Fragment>
            {showForm && (
                <Fragment>
                    <CloseButton onClick={() => {
                        setShowForm(false)
                        setSelectedCategory(null)
                        setFormMode("create")
                    }}>
                        <AiOutlineClose/>
                    </CloseButton>
                    <AdminCategoryForm formMode={formMode} id={selectedCategory}/>
                </Fragment>
            )}
            <Wrapper>
                <Header>
                    <h3>Categories</h3>
                    <div>
                        <Button>
                            Export <BiDownArrow/>
                        </Button>
                        <Button onClick={() => {
                            setShowForm(true)
                            setFormMode("create")
                        }}>
                            Create <IoCreateOutline/>
                        </Button>
                    </div>
                </Header>
                <Table>
                    {isLoading ? (
                        <LoadingComponent/>
                    ) : categories?.length > 0 ? (
                        <Fragment>
                            <thead>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Parent</th>
                            <th>
                                <BsGearWide/>
                            </th>
                            </thead>
                            {categories.map((category) => (
                                <tr key={category._id}>
                                    <td>{category._id}</td>
                                    <td>{category.title}</td>
                                    <td>
                                        {category?.parent
                                            ? categories.find((cat) => category?.parent === cat?._id)
                                                ?.title
                                            : "❌"}
                                    </td>
                                    <td className="flex">
                                        <div className="btnContainer">
                                            <button className={"editBtn"} onClick={() => {
                                                setShowForm(true)
                                                setFormMode("edit")
                                                console.log(category._id)
                                                setSelectedCategory(category._id)
                                            }}>
                                                Edit <AiFillEdit/>
                                            </button>
                                            <button
                                                className={"deleteBtn"}
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: "Do you want to delete this Category?",
                                                        showDenyButton: true,
                                                        confirmButtonText: "Delete",
                                                    }).then(async (result) => {
                                                        if (result.isConfirmed) {
                                                            const response = await remove({
                                                                token: token,
                                                                id: category._id,
                                                            }).unwrap();
                                                            if (response.success) {
                                                                Swal.fire({
                                                                    icon: "success",
                                                                    title: "Deleted!",
                                                                });
                                                                setCategories((categories) => [
                                                                    ...categories.filter(
                                                                        (pr) => pr._id !== category._id && pr.parent !== category._id
                                                                    ),
                                                                ]);
                                                            }
                                                            if (response.error) {
                                                                return Swal.fire({
                                                                    icon: "error",
                                                                    title: "Failed to delete.",
                                                                });
                                                            }
                                                        }
                                                    });
                                                }}
                                            >
                                                Delete <AiFillDelete/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </Fragment>
                    ) : (
                        <h1>No Category</h1>
                    )}
                </Table>
            </Wrapper>
        </Fragment>

    );
};

export default AdminCategories;
