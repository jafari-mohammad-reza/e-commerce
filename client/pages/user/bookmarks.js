import React from 'react';
import UserLayout from "../../components/UserLayout";
import client from "../../apollo-client";
import {GetMarkedProducts_Query} from "../../graphql/Queries/GlobalQueries";

const Bookmarks = ({bookmarks}) => {
    return (
        <UserLayout>
            <div className={'flex flex-col items-start justify-start overflow-x-hidden overflow-y-scroll'}>
                {
                    bookmarks.length >0 ? bookmarks.map(bookmarked => (
                        <div key={bookmarked._id}>
                            <h2>{bookmarked.title}</h2>
                        </div>
                    )) : <h1 className="position-center text-7xl text-blue-500 font-bold">No bookmarked yet</h1>
                }
            </div>
        </UserLayout>
    );
};


export async function getServerSideProps(context) {
    const {data} = await client.query({
        query :GetMarkedProducts_Query,
        context : {
            headers: {
                "authorization" : `Bearer ${context.req.cookies["access_token"]}`
            }
        }
    })
    return {
        props : {
            bookmarks : data.GetMarkedProducts
        }
    }
}
export default Bookmarks;
