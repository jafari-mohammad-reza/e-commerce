import React from 'react';
import client from "../../../apollo-client";
import {GetUserOrders_Query} from "../../../graphql/Queries/GlobalQueries";
import UserLayout from "../../../components/UserLayout";

const Index = ({orders}) => {
    return (
        <UserLayout>
            <div className={'flex flex-col items-start justify-start overflow-x-hidden overflow-y-scroll'}>
                {
                    orders.length > 0 ? orders.map(order => (
                        <div key={order._id}>
                            <h2>{order.totalPrice}</h2>
                        </div>
                    )) : <h1 className="position-center text-7xl text-blue-500 font-bold">No order yet</h1>
                }
            </div>
        </UserLayout>
    );
};

export async function getServerSideProps(context) {
    const {data} = await client.query({
        query: GetUserOrders_Query,
        context: {
            headers: {
                "authorization": `Bearer ${context.req.cookies["access_token"]}`
            }
        }
    })
    return {
        props: {
            orders: data
        }
    }
}

export default Index;
