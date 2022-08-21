import React from 'react';
import {useRouter} from "next/router";
import Link from "next/link";

const NotFoundPage = () => {
    const router = useRouter();
    return (
        <div className={'flex flex-col items-center justify-center h-max w-full py-24 space-y-5'}>
            <h2 className={'text-9xl font-bold'}>404</h2>
            <h4 className={'text-3xl  lg:text-5xl'}>Page you looking for is not available.</h4>
            <div className="flex flex-col items-center justify-center pt-10">
                <h5 className={'text-2xl lg:text-3xl font-mono'}>There are some helpful links.</h5>
                <ul className={'flex flex-row items-center w-max space-x-10 pt-5'}>
                    <li><Link href={'/'}><a className={'nav_link'}>Home</a></Link></li>
                    <li><Link href={'/categories'}><a className={'nav_link'}>Categories</a></Link></li>
                    <li><Link href={'/about'}><a className={'nav_link'}>Discounts</a></Link></li>
                    <li><Link href={'/contact'}><a className={'nav_link'}>Contact</a></Link></li>
                    <li>
                        <button className={'nav_link'} onClick={() => router.back()}>
                            Go back
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default NotFoundPage;
