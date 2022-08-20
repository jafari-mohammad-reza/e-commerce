import React from 'react';
import client from "../../apollo-client";
import {GetParentCategories_Query} from "../../graphql/Queries/GlobalQueries";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from "next/image";
import Link from "next/link";


const Categories = ({categories}) => {
    return (
        <div className={'flex flex-col items-start justify-start py-5 md:py-10 lg:py-20 px-12 md:px-20 lg:px-32'}>
            {categories && categories.map((category, index) => {
                return (
                    <div className={'w-full h-max mb-10'}>
                        <div className={'text-3xl lg:text-6xl mb-12 font-semibold'}>{category.title}</div>
                        <div className={'w-full md:px-14'}>
                            {category.children && category.children.length > 0 &&
                                <Swiper navigation={true} slidesPerView={5}>
                                    {category.children.map((child, index) => {
                                        return <SwiperSlide key={index}>
                                            <Link href={`/categories/${child.title.replace(" ", "_")}`}>
                                                <div
                                                    className={`w-max p-5 h-max flex flex-col items-center justify-center cursor-pointer`}>
                                                    <Image src={child.imageURL} alt={child.title} width={250}
                                                           height={250}
                                                           objectFit={'contain'}/>
                                                    <h2 className={'text-xl md:text-3xl '}>{child.title}</h2>
                                                </div>
                                            </Link>
                                        </SwiperSlide>
                                    })}
                                </Swiper>
                            }
                        </div>

                    </div>
                )


            })}
        </div>
    );
};

export async function getServerSideProps() {
    const {data} = await client.query({
        query: GetParentCategories_Query,
    })
    return {
        props: {
            categories: data.category,
        }
    }
}

export default Categories;

