import React from 'react';
import client from "../../apollo-client";
import {GetUserDiscounts_Query} from "../../graphql/Queries/GlobalQueries";
import UserLayout from "../../components/UserLayout";

const Discounts = ({discounts}) => {
    return (
        <UserLayout>
            <div className={'flex flex-col items-start justify-start space-y-12 py-10 px-20'}>
                {
                    discounts.length > 1 ? discounts.map((discount) => (
                        <div key={discount._id}
                             className={'w-max text-white   flex items-center justify-between px-10 py-7 space-x-14 bg-blue-600 rounded-3xl'}>
                            <h2 className={'text-4xl lg:text-5xl'}>{discount.code}</h2>
                            <div className={'text-2xl lg:text-3xl'}>
                                <h5>
                                    Percentage : {discount.percentage}
                                </h5><h5>
                                works until : {discount.expiresIn}
                            </h5>
                            </div>
                        </div>
                    )) : <h1 className="position-center text-7xl text-blue-500 font-bold">No discount yet</h1>
                }
            </div>
        </UserLayout>
    );
};

export async function getServerSideProps(context) {
    const {data} = await client.query({
        query: GetUserDiscounts_Query,
        context: {
            headers: {
                "authorization": `Bearer ${context.req.cookies["access_token"]}`
            }
        }
    })
    return {
        props: {
            discounts: data.GetUserDiscounts.data
        }
    }
}

export default Discounts;
