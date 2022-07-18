import {useSelector} from "react-redux";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {selectCurrentUser} from "./authSlice";
import {Roles} from "../../../conf/constants";

const RequireAuth = ({allowedRoutes}) => {
    const user = useSelector(selectCurrentUser);
    const location = useLocation();
    return allowedRoutes?.includes(user?.Role) || user?.Role === Roles.SUPERADMIN ? (
        <Outlet/>
    ) : user?.email || user?.mobile ? <Navigate to={"/"}/> : (
        <Navigate to="/login" state={{from: location}} replace/>
    );
};

export default RequireAuth;
