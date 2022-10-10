import { NextResponse } from 'next/server'
import {CLIENT_ADDRESS} from "./conf/constantValues";

export function middleware(request) {
    const accessToken = request.cookies.get('access_token')
    if(accessToken){
        if(request.nextUrl.pathname.startsWith("/auth"))
        {
            return NextResponse.redirect(CLIENT_ADDRESS)
        }
    }

    if(!accessToken){
        if(request.nextUrl.pathname.startsWith("/user") || request.nextUrl.pathname.startsWith("/cart") || request.nextUrl.pathname.startsWith("/admin"))
        {
            return NextResponse.redirect(CLIENT_ADDRESS)
        }
    }
    return NextResponse.next()
}
