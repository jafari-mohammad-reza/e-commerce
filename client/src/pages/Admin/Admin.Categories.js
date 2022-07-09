import React, {useEffect, useState} from 'react';
import {useGetCategoriesQuery} from "../../app/features/categories/categoriesApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../app/features/auth/authSlice";
import LoadingComponent from "../../components/LoadingComponent";

const AdminCategories = () => {
    const token = useSelector(selectCurrentToken)
    const {data, isLoading} = useGetCategoriesQuery({credentials: token})
    const [categories, setCategories] = useState([])
    useEffect(() => {
        if (!isLoading) {
            setCategories(data.data)
        }
    }, [data])
    return (
        <div>
            {isLoading ? <LoadingComponent/> : categories.map(category => {
                return <div id={category._id}>
                    {category.title}
                </div>
            })}
        </div>
    );
};

export default AdminCategories;