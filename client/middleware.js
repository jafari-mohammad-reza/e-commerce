export default async function middleware(req) {
    let user = req.cookies.get("access_token");

    // if(user){
    //     if(req.url.includes("/admin" ) && user.Role === "SUPERADMIN"){
    //         return NextResponse.next()
    //     } else if (req.url.includes("/admin" ) && user.Role !== "SUPERADMIN"){
    //         return NextResponse.redirect("http://localhost:3000/404")
    //     }else if (req.url.includes('/auth')) {
    //         return NextResponse.redirect(`http://localhost:3000`)
    //     } else {
    //         return NextResponse.next()
    //     }
    // }
    // if(!user){
    //     if(req.url.includes("/user")){
    //         return NextResponse.redirect("http://localhost:3000/auth/login")
    //     }
    //     if(req.url.includes("/admin")){
    //         return NextResponse.redirect("http://localhost:3000/404")
    //     }
    //     else{
    //         return NextResponse.next()
    //     }
    // }

}