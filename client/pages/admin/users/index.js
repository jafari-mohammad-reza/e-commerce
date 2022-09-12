import React, {useMemo} from 'react';
import axios from "../../../axios";
import {Global_Success} from "../../../conf/ConstantFunctions";
import {AiFillDelete, AiFillEdit, AiFillPrinter, AiOutlinePlus} from "react-icons/ai";
import Link from "next/link";
import AdminLayout from "../../../components/AdminLayout";
import {useRouter} from "next/router";

const Users = ({users}) => {
    const data = useMemo(() => users, [users])
    const router = useRouter();
    return (
        <AdminLayout>
            <div className={'flex flex-col w-full h-screen overflow-hidden space-y-28'}>
                <div className={'flex flex-row w-full h-max items-start justify-between px-20'}>
                    {/*    header*/}
                    <h3 className={'font-bold text-2xl lg:text-4xl'}>users</h3>
                    <div className={'flex items-center space-x-10'}>
                        <button
                            className={'w-max px-6 py-4 font-semibold text-2xl  rounded-xl bg-blue-500 text-sky-50 flex items-center space-x-4'}>
                            <span>Print all</span> <AiFillPrinter/>
                        </button>
                        <Link href={"/admin/users/form"}>
                            <a className={'w-max px-6 py-4 font-semibold text-2xl  rounded-xl bg-blue-500 text-sky-50 flex items-center space-x-4'}>
                                <span>New user</span> <AiOutlinePlus/>
                            </a>
                        </Link>
                    </div>


                </div>
                <table className="w-full text-sm text-left text-gray-500     ">
                    <thead className="text-lg md:text-2xl  text-gray-700 uppercase ">
                    <tr>

                        <th scope="col" className="py-3 px-6">username</th>
                        <th scope="col" className="py-3 px-6">email</th>
                        <th scope="col" className="py-3 px-6">mobileNumber</th>
                        <th scope="col" className="py-3 px-6">Role</th>
                        <th scope="col" className="py-3 px-6">Status</th>
                        <th scope="col" className="py-3 px-6">Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(user => (
                        <tr key={user._id} className="bg-white border-b text-lg md:text-3xl ">
                            <td scope="row"
                                className="py-4 px-6 ">{user.username ? user.username : "🚫"}</td>
                            <td scope="row"
                                className="py-4 px-6 ">{user.email ? user.email : "🚫"}</td>
                            <td scope="row"
                                className="py-4 px-6 ">{user.mobileNumber ? user.mobileNumber : "🚫"}</td>
                            <td scope="row"
                                className="py-4 px-6 ">{user.Role}</td>

                            <td scope="row"
                                className="py-4 px-6 ">{user.isBanned ? "Banned" : "Active"}</td>

                            <td className="flex flex-col items-center justify-center w-max h-max space-y-3 mt-10">
                                <Link href={`/admin/users/${user._id}`}>
                                    <a className="w-max h-max py-5 px-7 rounded-2xl text-2xl bg-blue-600 text-center text-white flex space-x-3 items-center"><span>Edit</span>
                                        <AiFillEdit/></a>
                                </Link>
                                <button
                                    className="w-max h-max py-5 px-7 rounded-2xl text-2xl bg-red-600 text-center text-white flex space-x-3 items-center"
                                    onClick={() => {
                                        axios.put(`http://localhost:5000/admin/users/${user._id}`, {isBanned: true}).then(result => {
                                            if (result.status === 200) {
                                                Global_Success("user banned successfully.")
                                                setInterval(() => router.reload(), 2000)
                                            }
                                        })
                                    }}
                                ><span>Ban</span> <AiFillDelete/></button>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export async function getServerSideProps(context) {
    const {data} = await axios.get(`http://localhost:5000/admin/users`, {
        headers: {
            cookie: context.req.headers.cookie
        }
    })
    const users = data.users
    return {
        props: {
            users
        }
    }

}

export default Users;
