import React from 'react';
import UserLayout from "../../components/UserLayout";
import {GetUserDashboard_Query} from "../../graphql/Queries/GlobalQueries";
import client from "../../apollo-client";

const Index = ({userDashboard}) => {
    return (
        <UserLayout>
            <div className="px-20 py-10 overflow-hidden">

                <div className="flex flex-col items-start justify-center w-full bg-gray-200 px-20 py-10 rounded-3xl ">
                    <h2 className={'text-3xl md:text-4xl mb-10 border-b-2 border-b-gray-800'}>Your information's</h2>
                    <div className="w-full flex flex-row items-center justify-between flex-wrap">
                        <div className="flex items-center justify start-space-x-6">
                            <h3 className={'text-2xl md:text-3xl'}>Mobile Number :</h3>
                            <span
                                className={'text-xl md:text-2xl'}>{userDashboard?.mobileNumber ? userDashboard?.mobileNumber : "No mobile"}</span>
                        </div>
                        <div className="flex items-center justify start-space-x-6">
                            <h3 className={'text-2xl md:text-3xl'}>Email :</h3>
                            <span
                                className={'text-xl md:text-2xl'}>{userDashboard.email ? userDashboard.email : "No email"}</span>
                        </div>
                        <div className="flex items-center justify start-space-x-6">
                            <h3 className={'text-2xl md:text-3xl'}>Username :</h3>
                            <span
                                className={'text-xl md:text-2xl'}>{userDashboard.username ? userDashboard.username : "No username"}</span>
                        </div>
                        <div className="flex items-center justify start-space-x-6">
                            <h3 className={'text-2xl md:text-3xl'}>Wallet credit :</h3>
                            <span className={'text-xl md:text-2xl'}>{userDashboard.walletCredit}</span>
                        </div>

                    </div>
                </div>
            </div>

        </UserLayout>
    );
};

export async function getServerSideProps(context) {
    const {data: userDashboard} = await client.query({
        query: GetUserDashboard_Query,
        context: {
            headers: {
                authorization: `Bearer ${context.req.cookies["access_token"]}`
            }
        }
    })
    return {
        props: {
            userDashboard: userDashboard.GetUserDashboard.data
        }
    }

}

export default Index;
