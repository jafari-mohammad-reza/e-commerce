import React, {Fragment, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../../app/features/auth/authSlice";
import {Button, Header, Table, Wrapper,} from "../../../components/tableComponents";
import {BiDownArrow} from "react-icons/bi";
import {IoCreateOutline} from "react-icons/io5";
import {useDeleteProductMutation, useGetProductsQuery,} from "../../../app/features/AdminApies/ProductsApiSlice";
import LoadingComponent from "../../../components/LoadingComponent";
import {BsGearWide} from "react-icons/bs";
import {AiFillDelete, AiFillEdit, AiOutlineClose} from "react-icons/ai";
import Swal from "sweetalert2";
import AdminProductsForm from "./Admin.ProductsForm";
import {CloseButton} from "../../../components/FormsComponents";

const AdminProducts = () => {
    const token = useSelector(selectCurrentToken);
    const {data, isLoading} = useGetProductsQuery({credentials: token});
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("");
    const [remove] = useDeleteProductMutation();

    useEffect(() => {
        if (!isLoading) {
            setProducts(data.products);
        }
    }, [data]);
    return (
        <Fragment>
            <Wrapper>
                <Header>
                    <h3>Products</h3>
                    <div>
                        <Button>
                            Export <BiDownArrow/>
                        </Button>
                        <Button
                            onClick={() => {
                                setFormMode("create");
                                setShowForm(true);
                            }}
                        >
                            Create <IoCreateOutline/>
                        </Button>
                    </div>
                </Header>
                <Table>
                    {isLoading ? (
                        <LoadingComponent/>
                    ) : products ? (
                        <Fragment>
                            <thead>
                            <th>Title</th>
                            <th>overView</th>
                            <th>Description</th>
                            <th>Tags</th>
                            <th>Category</th>
                            <th>price</th>
                            <th>In stock</th>
                            <th>Image</th>
                            <th>
                                <BsGearWide/>
                            </th>
                            </thead>
                            {products?.map((product) => (
                                <tr key={product._id}>
                                    <td>{product.title}</td>
                                    <td>{product.overView.substring(0, 30)}</td>
                                    <td>{product.description.substring(0, 50)}</td>
                                    <td>
                                        {product.tags.map((tag) => (
                                            <span key={tag}>
                        #{tag}
                                                <br/>
                      </span>
                                        ))}
                                    </td>
                                    <td>{product?.categoryName?.title}</td>
                                    <td>{product?.price}</td>
                                    <td>{product.stockCount}</td>
                                    <td>
                                        <img
                                            src={product?.imagesURL[product.imagesURL.length - 1]}
                                            alt={product.title}
                                        />
                                    </td>
                                    <td className="flex">
                                        <div className="btnContainer">
                                            <button className={"editBtn"}>
                                                Edit <AiFillEdit/>
                                            </button>
                                            <button
                                                className={"deleteBtn"}
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: "Do you want to delete this product?",
                                                        showDenyButton: true,
                                                        confirmButtonText: "Delete",
                                                    }).then(async (result) => {
                                                        if (result.isConfirmed) {
                                                            const response = await remove({
                                                                token: token,
                                                                id: product._id,
                                                            }).unwrap();
                                                            if (response.success) {
                                                                Swal.fire({
                                                                    icon: "success",
                                                                    title: "Deleted!",
                                                                });
                                                                setProducts((products) => [
                                                                    ...products.filter(
                                                                        (pr) => pr._id !== product._id
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
                        <h1>No product</h1>
                    )}
                </Table>
            </Wrapper>
            {showForm && (
                <Fragment>
                    <CloseButton onClick={() => setShowForm(false)}>
                        <AiOutlineClose/>
                    </CloseButton>
                    <AdminProductsForm formMode setShowForm/>
                </Fragment>
            )}
        </Fragment>
    );
};
export default AdminProducts;
