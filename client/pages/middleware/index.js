// This function can be marked `async` if using `await` inside
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../app/features/authSlice";
import {NextResponse} from "next/server";

export function middleware(request) {
    console.log("Hello from the middleware");
    const user = useSelector(selectCurrentUser)
    if (request.nextUrl.pathname.startsWith('/auth')) {
        if (user) {
            return NextResponse.redirect(request.nextUrl.pathname.replace('/auth', ''))
        }
    }


}