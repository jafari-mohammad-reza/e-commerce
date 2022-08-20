import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useQuery} from "@apollo/client";
import {GetCategoryProductsByTitle_Query} from "../../graphql/Queries/GlobalQueries";

const Category = () => {
    const {query} = useRouter();
    const title = query.title && query.title[0];
    const {data, loading} = useQuery(GetCategoryProductsByTitle_Query, {
        variables: {
            title: "Gaming"
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
        <div>
            {products && products.map((product, index) => {
                return (
                    <div key={index}>
                        <h1>{product.title}</h1>
                        <img src={product.imagesURL[0]} alt={product.title} width={250} height={250}/>
                    </div>
                )
            })}
        </div>
    );
};

export default Category;
