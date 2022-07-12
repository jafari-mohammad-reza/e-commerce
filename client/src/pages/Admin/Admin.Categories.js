import React, {Fragment, useEffect, useState} from 'react';
import {useGetCategoriesQuery} from "../../app/features/AdminApies/categoriesApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../app/features/auth/authSlice";
import {BiDownArrow} from "react-icons/bi";
import {IoCreateOutline} from "react-icons/io5";
import LoadingComponent from "../../components/LoadingComponent";
import {BsGearWide} from "react-icons/bs";
import {Link} from "react-router-dom"
import {AiFillDelete, AiFillEdit} from "react-icons/ai";
import {Button, Header, Table, Wrapper} from "../../components/tableComponents";


const AdminCategories = () => {
    const token = useSelector(selectCurrentToken)
    const {data, isLoading} = useGetCategoriesQuery({credentials: token})
    const [categories, setCategories] = useState([])
    console.log(categories)
    useEffect(() => {
        if (!isLoading) {
            setCategories(data.data)
        }
    }, [data])
    return (
        <Wrapper>
            <Header
            >
                <h3>
                    Categories
                </h3>
                <div>
                    <Button>Export <BiDownArrow/></Button>
                    <Button>Create <IoCreateOutline/></Button>
                </div>
            </Header>
            <Table>
                {isLoading ? <LoadingComponent/> : categories?.length > 0 ? (
                    <Fragment>
                        <thead>
                        <th>ID</th>
                        <th>Title
                        </th>
                        <th>Parent</th>
                        <th><BsGearWide/></th>
                        </thead>
                        {categories.map(category => (
                            <tr key={category._id}>
                                <td>{category._id}</td>
                                <td>{category.title}</td>
                                <td>{category?.parent ? categories.find(cat => category?.parent === cat?._id)?.title : "❌"}</td>
                                <td className="flex">
                                    <div className="btnContainer">
                                        <Link to={`/admin/categories/edit/${category._id}`}><a
                                            className={'editBtn'}>Edit <AiFillEdit/></a></Link>
                                        <Link to={`/admin/categories/edit/${category._id}`}><a
                                            className={'deleteBtn'}>Delete < AiFillDelete/></a></Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </Fragment>
                ) : <h1>No Category</h1>}

            </Table>
        </Wrapper>
    );
};

export default AdminCategories;