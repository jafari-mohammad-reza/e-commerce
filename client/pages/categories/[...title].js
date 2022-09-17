import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useQuery} from "@apollo/client";
import {GetCategoryProductsByTitle_Query} from "../../graphql/Queries/GlobalQueries";
import ProductCard from "../../components/ProductsCard";
import client from "../../apollo-client";

const Category = () => {
    const {query} = useRouter();
    const title = query.title && query.title[0];
    const {data, loading} = useQuery(GetCategoryProductsByTitle_Query, {
        variables: {
            title: title
        }
    })
    const [products, setProduct] = useState(null);
    useEffect(() => {
        if (data && !loading) {
            setProduct(data.GetProductByCategory);
            products && console.log(products);
        }
    }, [data, loading])
    return (
        <div
            className={`flex flex-row flex-wrap items-center justify-center  md:items-start md:justify-start md:space-x-24 space-y-14 md:space-y-0 px-10 md:px-24 lg:px-32 py-14`}>
            {
                products &&
                products.map((product, index) => {
                    return (
                        <ProductCard product={product} key={index}/>
                    )
                })
            }

        </div>
    );
};

export default Category;
