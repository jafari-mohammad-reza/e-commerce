import React, {useMemo} from 'react';
import Link from "next/link";
import {AiFillDelete, AiFillEdit, AiFillPrinter, AiOutlinePlus} from "react-icons/ai";
import axios from "../../../axios";
import {Global_Error, Global_Success} from "../../../conf/ConstantFunctions";
import AdminLayout from "../../../components/AdminLayout";
import Image from "next/image";
import 'swiper/css';

const categories = ({categories}) => {
    const data = useMemo(() => categories, [categories])

    return (
        <AdminLayout>
            <div className={'flex flex-col w-full h-screen overflow-hidden space-y-28'}>
                <div className={'flex flex-row w-full h-max items-start justify-between px-20'}>
                    {/*    header*/}
                    <h3 className={'font-bold text-2xl lg:text-4xl'}>categories</h3>
                    <div className={'flex items-center space-x-10'}>
                        <button
                            className={'w-max px-6 py-4 font-semibold text-2xl  rounded-xl bg-blue-500 text-sky-50 flex items-center space-x-4'}>
                            <span>Print all</span> <AiFillPrinter/>
                        </button>
                        <Link href={"/admin/categories/form"}>
                            <a className={'w-max px-6 py-4 font-semibold text-2xl  rounded-xl bg-blue-500 text-sky-50 flex items-center space-x-4'}>
                                <span>New category</span> <AiOutlinePlus/>
                            </a>
                        </Link>
                    </div>


                </div>
                <table className="w-full text-sm text-left text-gray-500     ">
                    <thead className="text-lg md:text-2xl  text-gray-700 uppercase ">
                    <tr>

                        <th scope="col" className="py-3 px-6">Title</th>
                        <th scope="col" className="py-3 px-6">Parent</th>
                        <th scope="col" className="py-3 px-6">Image</th>
                        <th scope="col" className="py-3 px-6">Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(category => (
                        <tr key={category._id} className="bg-white border-b text-lg md:text-3xl ">
                            <td scope="row"
                                className="py-4 px-6 text-3xl font-bold text-gray-900 whitespace-nowrap ">{category.title}</td>
                            <td className="py-4 px-6">{category.parent ? category.parent : "🚫"}</td>
                            <td className="py-4 px-6 max-w-min ">
                                <Image src={category.imageURL} alt={"🚫"} width={120} height={120} layout={'fixed'}
                                       objectFit={"contain"}/>
                            </td>
                            <td className="flex flex-col items-center justify-center w-max h-max space-y-3 mt-10">
                                <Link href={`/admin/categories/${category._id}`}>
                                    <a className="w-max h-max py-5 px-7 rounded-2xl text-2xl bg-blue-600 text-center text-white flex space-x-3 items-center"><span>Edit</span>
                                        <AiFillEdit/></a>
                                </Link>
                                <button
                                    className="w-max h-max py-5 px-7 rounded-2xl text-2xl bg-red-600 text-center text-white flex space-x-3 items-center"
                                    onClick={() => {
                                        axios.delete(`/admin/categories/${category._id}`).then(result => {
                                            console.log(result)
                                            if (result.status === 200) {
                                                Global_Success("category deleted successfully.")
                                            }
                                        })
                                    }}
                                ><span>Delete</span> <AiFillDelete/></button>

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
    const {data} = await axios.get(`/admin/categories`, {
        headers: {
            cookie: context.req.headers.cookie
        }
    })
    if (!data.success) {
        return Global_Error("Failed while fetching categories")
    }
    const categories = data.categories
    return {
        props: {
            categories,
        }
    }
}

export default categories;

