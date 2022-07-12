import React, {Fragment, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../app/features/auth/authSlice";
import {Button, Header, Table, Wrapper} from "../../components/tableComponents";
import {BiDownArrow} from "react-icons/bi";
import {IoCreateOutline} from "react-icons/io5";
import {useDeleteProductQuery, useGetProductsQuery} from "../../app/features/AdminApies/ProductsApiSlice";
import LoadingComponent from "../../components/LoadingComponent";
import {BsGearWide} from "react-icons/bs";
import {AiFillDelete, AiFillEdit} from "react-icons/ai";
import {Form, FormArea, FormInput, FormWrapper} from "../../components/FormsComponents";
import Swal from "sweetalert2";

const AdminProducts = () => {
    const token = useSelector(selectCurrentToken)
    const {data, isLoading} = useGetProductsQuery({credentials: token})
    const [products, setProducts] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [fomrMode, setFormMode] = useState("")
    const [remove] = useDeleteProductQuery()
    useEffect(() => {
        if (!isLoading) {
            setProducts(data.products)
            console.log(products)

        }
    }, [data])
    return (
        <Fragment>

            <Wrapper>
                <Header
                >
                    <h3>
                        Products
                    </h3>
                    <div>
                        <Button>Export <BiDownArrow/></Button>
                        <Button onClick={() => {
                            setFormMode("create")
                            setShowForm(true)
                        }}>Create <IoCreateOutline/></Button>
                    </div>
                </Header>
                <Table>
                    {isLoading ? <LoadingComponent/> : products ? (
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
                            <th><BsGearWide/></th>
                            </thead>
                            {products.map(product => (

                                <tr key={product._id}>
                                    <td>{product.title}</td>
                                    <td>{product.overView.substring(0, 30)}</td>
                                    <td>{product.description.substring(0, 50)}</td>
                                    <td>{product.tags.map(tag => (<span key={tag}>#{tag}<br/></span>))}</td>
                                    <td>{product?.categoryName?.title}</td>
                                    <td>{product?.price}</td>
                                    <td>{product.stockCount}</td>
                                    <td>
                                        <img src={product?.imagesURL[product.imagesURL.length - 1]}
                                             alt={product.title}/>
                                    </td>
                                    <td className="flex">
                                        <div className="btnContainer">
                                            <button className={"editBtn"}>Edit <AiFillEdit/></button>
                                            <button className={"deleteBtn"} onClick={() => {
                                                Swal.fire({
                                                    title: 'Do you want to delete this product?',
                                                    showDenyButton: true,
                                                    confirmButtonText: 'Delete',
                                                }).then(async (result) => {
                                                    if (result.isConfirmed) {
                                                        // await axios.delete(`/admin/products/${product._id}`, {
                                                        //     authorization: `Bearer ${token}`
                                                        // }).then(async response => {
                                                        //     if (response.status == 200) {
                                                        //         Swal.fire('Deleted!', '', 'success')
                                                        //     }
                                                        // }).catch(async error => {
                                                        //     console.log(error)
                                                        // })
                                                    }
                                                })
                                            }}>Delete < AiFillDelete/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </Fragment>
                    ) : <h1>No product</h1>}

                </Table>
            </Wrapper>
            {showForm && <FormWrapper>
                <Form>
                    <FormInput name={'title'} placeholder={"Title"}/>
                    <FormInput name={'overView'} placeholder={"overView"}/>
                    <FormInput name={'title'} placeholder={"#Tags1,#Tag2"}/>
                    <FormInput name={'title'} placeholder={"Title"}/>
                    <FormArea name={'description'} placeholder={"Description"}/>
                </Form>
            </FormWrapper>}
        </Fragment>

    );
};
export default AdminProducts;