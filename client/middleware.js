import {NextResponse} from "next/server";

export default async function middleware(req) {
    let user = req.cookies.get("access_token");
    if (user && req.url.includes('/auth')) {
        return NextResponse.redirect(`http://localhost:3000`)
    } else {
        return NextResponse.next()
    }
}