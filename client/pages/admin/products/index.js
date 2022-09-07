import React, {useMemo} from 'react';
import Link from "next/link";
import {AiFillDelete, AiFillEdit, AiFillPrinter, AiOutlinePlus} from "react-icons/ai";
import axios from "../../../axios";
import {Global_Error, Global_Success} from "../../../conf/ConstantFunctions";
import AdminLayout from "../../../components/AdminLayout";
import Image from "next/image";
import 'swiper/css';

const Products = ({products}) => {
    const data = useMemo(() => products, [products])

    return (
        <AdminLayout>
            <div className={'flex flex-col w-full h-screen overflow-hidden space-y-28'}>
                <div className={'flex flex-row w-full h-max items-start justify-between px-20'}>
                    {/*    header*/}
                    <h3 className={'font-bold text-2xl lg:text-4xl'}>Products</h3>
                    <div className={'flex items-center space-x-10'}>
                        <button
                            className={'w-max px-6 py-4 font-semibold text-2xl  rounded-xl bg-blue-500 text-sky-50 flex items-center space-x-4'}>
                            <span>Print all</span> <AiFillPrinter/>
                        </button>
                        <Link href={"/admin/products/form"}>
                            <a className={'w-max px-6 py-4 font-semibold text-2xl  rounded-xl bg-blue-500 text-sky-50 flex items-center space-x-4'}>
                                <span>New product</span> <AiOutlinePlus/>
                            </a>
                        </Link>
                    </div>


                </div>
                <table className="w-full text-sm text-left text-gray-500     ">
                    <thead className="text-lg md:text-2xl  text-gray-700 uppercase ">
                    <tr>

                        <th scope="col" className="py-3 px-6">Title</th>
                        <th scope="col" className="py-3 px-6">Price</th>
                        <th scope="col" className="py-3 px-6">Discount</th>
                        <th scope="col" className="py-3 px-6">Discounted Price</th>
                        <th scope="col" className="py-3 px-6">StockCount</th>
                        <th scope="col" className="py-3 px-6">Average Rating</th>
                        <th scope="col" className="py-3 px-6">Supplier</th>
                        <th scope="col" className="py-3 px-6">Image</th>
                        <th scope="col" className="py-3 px-6">Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(product => (
                        <tr key={product._id} className="bg-white border-b text-lg md:text-3xl ">
                            <td scope="row"
                                className="py-4 px-6 text-3xl font-bold text-gray-900 whitespace-nowrap ">{product.title}</td>
                            <td className="py-4 px-6">{product.price}</td>
                            <td className="py-4 px-6">{product.discount}</td>
                            <td className="py-4 px-6">{product.discountedPrice}</td>
                            <td className="py-4 px-6">{product.stockCount}</td>
                            <td className="py-4 px-6">{product.averageRating}</td>
                            <td className="py-4 px-6">{product.supplier.username || product.supplier.mobileNumber}</td>
                            <td className="py-4 px-6">
                                <Image src={product.imagesURL[0]} alt={product.title} width={120} height={100}/>
                            </td>
                            <td className="flex flex-col items-center-justify-center w-max h-max space-y-3">
                                <Link href={`/admin/products/${product._id}`}>
                                    <a className="w-max h-max py-5 px-7 rounded-2xl text-2xl bg-blue-600 text-center text-white flex space-x-3 items-center"><span>Edit</span>
                                        <AiFillEdit/></a>
                                </Link>
                                <button
                                    className="w-max h-max py-5 px-7 rounded-2xl text-2xl bg-red-600 text-center text-white flex space-x-3 items-center"
                                    onClick={() => {
                                        axios.delete(`http://localhost:5000/admin/products/${product._id}`).then(result => {
                                            console.log(result)
                                            if (result.status === 200) {
                                                Global_Success("Products deleted successfully.")
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
    const {data} = await axios.get(`http://localhost:5000/admin/products`, {
        headers: {
            cookie: context.req.headers.cookie
        }
    })
    if (!data.success) {
        return Global_Error("Failed while fetching products")
    }
    const products = data.products
    return {
        props: {
            products,
        }
    }
}

export default Products;

