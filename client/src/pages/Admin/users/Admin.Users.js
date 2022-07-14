import React, {Fragment, useEffect, useState} from 'react';
import {CloseButton} from "../../../components/FormsComponents";
import {AiFillEdit, AiOutlineClose} from "react-icons/ai";
import {Header, Table, Wrapper} from "../../../components/tableComponents";
import {BiDownArrow} from "react-icons/bi";
import LoadingComponent from "../../../components/LoadingComponent";
import {BsGearWide} from "react-icons/bs";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../../app/features/auth/authSlice";
import {useGetUsersQuery} from "../../../app/features/AdminApies/UsersApiSlice";
import AdminUsersForm from "./Admin.UsersForm";
import {Link} from "react-router-dom";
import {FaCriticalRole, FaUniversalAccess} from "react-icons/fa";

const AdminUsers = () => {
    const token = useSelector(selectCurrentToken);
    const {data, isLoading} = useGetUsersQuery({credentials: token});
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null)
    useEffect(() => {
        if (!isLoading) {
            setUsers(data.users)
        }
    }, [data])
    return (
        <Fragment>
            {showForm && (
                <Fragment>
                    <CloseButton onClick={() => {
                        setShowForm(false)
                        setSelectedUser(null)
                    }}>
                        <AiOutlineClose/>
                    </CloseButton>
                    <AdminUsersForm id={selectedUser}/>
                </Fragment>
            )}
            <Wrapper>
                <Header>
                    <h3>Users</h3>
                    <div>
                        <button>
                            Export <BiDownArrow/>
                        </button>
                        <button>
                            <Link to={"/admin/roles"}>Roles <FaCriticalRole/></Link>
                        </button>
                        <button>
                            <Link to={"/admin/Permissions"}>Permissions <FaUniversalAccess/></Link>
                        </button>

                    </div>
                </Header>
                <Table>
                    {isLoading ? (
                        <LoadingComponent/>
                    ) : users?.length > 0 ? (
                        <Fragment>
                            <thead>
                            <th>ID</th>
                            <th>UserName</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Role</th>
                            <th>
                                <BsGearWide/>
                            </th>
                            </thead>
                            {users?.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.username ? user.username : "❌"}</td>
                                    <td>{user.email ? user.email : "❌"}</td>
                                    <td>{user.mobile ? user.mobile : "❌"}</td>
                                    <td>{user.Role}</td>
                                    <td className="flex">
                                        <div className="btnContainer">
                                            <button className={"editBtn"} onClick={() => {
                                                setShowForm(true)
                                                setSelectedUser(user._id)
                                            }}>
                                                Edit <AiFillEdit/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </Fragment>
                    ) : (
                        <h1>No User</h1>
                    )}
                </Table>
            </Wrapper>
        </Fragment>
    );
};

export default AdminUsers;