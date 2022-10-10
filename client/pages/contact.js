import React from 'react';
import Link from "next/link";

const Contact = () => {
    return (
        <div className={'w-full h-screen flex flex-col items-center justify-center'}>
            <div className="flex flex-col w-3/5 lg:w-2/5 h-max border-2 border-blue-500 py-7 px-10 rounded-lg">
                <h2 className={'text-2xl lg:text-4xl'}>Email : <span className={'text-bold text-sky-400'}>mohammadrezajafari.dev@gmail.com</span></h2>
                <a className={'text-2xl lg:text-4xl'} href={'https://github.com/dayeezus/e-commerce'} target={"_blank"}>Github</a>
                <a className={'text-2xl lg:text-4xl'} href={'https://t.me/DaYeezus'} target={"_blank"}>Telegram ID</a>
            </div>
        </div>
    );
};

export default Contact;
