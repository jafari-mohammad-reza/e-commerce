import {useSelector} from "react-redux";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {selectCurrentUser} from "./authSlice";

const RequireAuth = ({allowedRoutes}) => {
    const user = useSelector(selectCurrentUser);
    const location = useLocation();
    return allowedRoutes?.includes(user?.Role) ? (
        <Outlet/>
    ) : user?.email || user?.mobile ? <Navigate to={"/"}/> : (
        <Navigate to="/login" state={{from: location}} replace/>
    );
};

export default RequireAuth;
